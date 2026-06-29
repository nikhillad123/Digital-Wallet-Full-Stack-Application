const express = require("express");
const authController = require("../controllers/auth.controller");
const { registerValidation, loginValidation, changePasswordValidation } = require("../validations/auth.validation");

const validate = require("../middlewares/validation.middleware");

const { loginLimiter, registerLimiter } = require("../middlewares/rateLimit.middleware");
const authMiddleware = require("../middlewares/user.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nikhil
 *               email:
 *                 type: string
 *                 example: nikhil@gmail.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
router.post("/register", 
    registerLimiter, 
    registerValidation, 
    validate, 
    authController.registerUser
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: nikhil@gmail.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
router.post("/login", 
    loginLimiter, 
    loginValidation, 
    validate, 
    authController.loginUser
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/logout", 
    authMiddleware.authMiddleware, 
    authController.logoutUser
);

router.post("/refresh-token",
    authController.refreshAccessToken
);

router.patch(
    "/change-password",
    authMiddleware.authMiddleware,
    changePasswordValidation,
    validate,
    authController.changePassword
);

router.post(
    "/forgot-password",
    authController.forgotPassword
);

router.patch(
    "/reset-password/:token",
    authController.resetPassword
);

module.exports = router;