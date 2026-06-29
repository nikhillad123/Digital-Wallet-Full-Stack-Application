const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");


async function authMiddleware(req, res, next) {

    // Try to get the token from an HTTP-only cookie named "token"
    // or from the Authorization header in the form "Bearer <token>".
    const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    // If no token is provided, respond with 401 Unauthorized and a message.
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        });
    }

    try {
        // Verify the token using the JWT secret from environment variables.
        // jwt.verify throws if the token is invalid or expired.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Look up the user in the database by the ID stored in the token payload.
        // Use .select("-password") to exclude the password field from the returned user object.
        const user = await userModel.findById(decoded.userId).select("-password +role");
        if (!user) {
            // If the user ID in the token doesn't match any DB user, deny access.
            return res.status(401).json({
                message: "Unauthorized access, user not found"
            });
        }

        // Attach the user object to the request for downstream handlers to use.
        req.user = user;

        // Token valid and user exists — proceed to the next middleware / route handler.
        return next();

    } catch (err) {
        // Any error in verification or DB lookup results in 401 Unauthorized.
        // Common causes: invalid signature, expired token, malformed token.
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        });
    }
}


module.exports = { authMiddleware };