const userModel = require("../models/user.model");
const accountModel = require("../models/account.model");
const refreshTokenModel = require("../models/refreshToken.model");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const passwordResetTokenModel = require("../models/passwordResetToken.model");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");


async function registerUser(req, res) {
    let session;

    try {

        // Extract name, email, and password from the request body
        const { name, password } = req.body;
        const email = req.body.email?.toLowerCase().trim();

        // Validate that all required fields are present
        // If any field is missing, return 400 Bad Request with an error message
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "name, email and password are all required"
            });
        }

        // Check if a user with this email already exists in the database
        const existingUser = await userModel.findOne({ email });

        // If user already exists, return 400 Bad Request
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Start transaction only after validations pass
        session = await mongoose.startSession();
        session.startTransaction();

        // Create a new user in the database with the provided name, email, and password
        // The user model is expected to handle password hashing internally
        const user = await userModel.create([{
            name,
            email,
            password
        }], { session });

        // Create a new account associated with the newly created user
        // The account is linked using the user's _id
        const account = await accountModel.create([{
            user: user[0]._id
        }], { session });

        // Commiting transaction session and ending it.
        await session.commitTransaction();
        session.endSession();

        // Return 201 Created with the new user's details (excluding password)
        return res.status(201).json({
            message: "User registered successfully",
            id: user[0]._id,
            email: user[0].email,
            name: user[0].name
        });
    } catch (error) {

        if (session) {
            await session.abortTransaction();
            session.endSession();
        }

        // If any error occurs during registration, return 500 Internal Server Error
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

async function loginUser(req, res) {
    try {
        // 1. Get email and password from the request body
        const { email, password } = req.body;

        // Validate that both email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                message: "email and password are required"
            });
        }

        // 2. Find the user by email in the database
        // Use .select("+password") to explicitly include the password field (default may exclude it)
        const user = await userModel.findOne({ email }).select("+password +role");

        // 3. If user not found, return 401 Unauthorized
        if (!user) {
            return res.status(401).json({
                message: "Email or Password is INVALID!"
            });
        }

        // 4. Compare the provided password with the stored hashed password
        // user.comparePassword is expected to be a method defined in the user model
        const isValidPassword = await user.comparePassword(password);

        // 5. If password doesn't match, return 401 Unauthorized
        if (!isValidPassword) {
            return res.status(401).json({
                message: "Email or Password is INVALID"
            });
        }

        // 6. Invalidate all previous refresh tokens 
        await refreshTokenModel.deleteMany({
            user: user._id
        });

        // Access Token (short-lived) 
        const accessToken = jwt.sign({
            userId: user._id
        }, process.env.JWT_SECRET, { expiresIn: "15m" });

        // Refresh Token (long-lived) 
        const refreshToken = jwt.sign({
            userId: user._id
        }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

        // Store refresh token in DB 
        await refreshTokenModel.create({
            user: user._id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        // 6. Send cookies 
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        // 7. Send a successful login response with user details and the token
        return res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            accessToken
        });
    } catch (error) {
        // Log the error for debugging purposes
        console.log(error);

        // Return 500 Internal Server Error for unexpected errors
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function refreshAccessToken(req, res) {
    try {

        // 1. Get refresh token from cookie
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token is missing"
            });
        }

        // 2. Verify refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        // 3. Check if token exists in DB
        const storedToken = await refreshTokenModel.findOne({
            token: refreshToken
        });

        if (!storedToken) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        // 4. Check if token is revoked
        if (storedToken.isRevoked) {
            return res.status(401).json({
                message: "Refresh token has been revoked"
            });
        }

        // 5. Generate new access token
        const accessToken = jwt.sign(
            {
                userId: decoded.userId
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m"
            }
        );

        // 6. Generate new refresh token
        const newRefreshToken = jwt.sign(
            {
                userId: decoded.userId
            },
            process.env.JWT_REFRESH_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // 7. Delete old refresh token
        await refreshTokenModel.deleteOne({
            token: refreshToken
        });

        // 8. Store new refresh token
        await refreshTokenModel.create({
            user: decoded.userId,
            token: newRefreshToken,
            expiresAt: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
            )
        });

        // 9. Send new cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        return res.status(200).json({
            message: "Access token refreshed successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
}

async function logoutUser(req, res) {
    try {

        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            await refreshTokenModel.deleteOne({
                token: refreshToken
            });
        }

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function changePassword(req, res) {
    try {

        const { currentPassword, newPassword } = req.body;

        const user = await userModel
            .findById(req.user._id)
            .select("+password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isValidPassword =
            await user.comparePassword(currentPassword);

        if (!isValidPassword) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        user.password = newPassword;

        await user.save();

        // Invalidate all sessions
        await refreshTokenModel.deleteMany({
            user: user._id
        });

        res.clearCookie("accessToken");

        res.clearCookie("refreshToken");

        return res.status(200).json({
            message:
                "Password changed successfully. Please login again."
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function forgotPassword(req, res) {

    try {

        const { email } = req.body;

        const user = await userModel.findOne({ email });

        // Don't reveal whether email exists
        if (!user) {
            return res.status(200).json({
                message:
                    "If an account with that email exists, a password reset link has been sent."
            });
        }

        // Delete old reset tokens
        await passwordResetTokenModel.deleteMany({
            user: user._id
        });

        // Generate raw token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash token before storing
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Store hashed token
        await passwordResetTokenModel.create({
            user: user._id,
            token: hashedToken,
            expiresAt: new Date(
                Date.now() + 15 * 60 * 1000 // 15 minutes
            )
        });

        const resetLink =
            `http://localhost:5173/reset-password/${resetToken}`;

        await sendEmail({
            to: user.email,
            subject: "Password Reset",
            text: `Reset your password using this link: ${resetLink}`
        });

        return res.status(200).json({
            message:
                "If an account with that email exists, a password reset link has been sent."
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function resetPassword(req, res) {

    try {

        const { token } = req.params;
        const { newPassword } = req.body;

        // Hash incoming token
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find valid token
        const resetTokenDoc =
            await passwordResetTokenModel.findOne({
                token: hashedToken,
                expiresAt: { $gt: new Date() }
            });

        if (!resetTokenDoc) {
            return res.status(400).json({
                message: "Invalid or expired reset token"
            });
        }

        const user = await userModel
            .findById(resetTokenDoc.user)
            .select("+password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Update password
        user.password = newPassword;

        await user.save();

        // Delete used reset token
        await passwordResetTokenModel.deleteOne({
            _id: resetTokenDoc._id
        });

        // Invalidate all refresh tokens
        await refreshTokenModel.deleteMany({
            user: user._id
        });

        return res.status(200).json({
            message:
                "Password reset successfully. Please login again."
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = { registerUser, loginUser, logoutUser, refreshAccessToken, changePassword, forgotPassword, resetPassword };