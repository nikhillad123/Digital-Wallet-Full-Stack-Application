const express = require("express");
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/user.middleware");
const authorizationMiddleware = require("../middlewares/authorization.middleware");

const router = express.Router();

router.get( "/test", authMiddleware.authMiddleware, authorizationMiddleware.authorizeAdmin, (req, res) => {
        res.status(200).json({
            message: "Welcome Admin"
        });
    }
);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get( "/users",
     authMiddleware.authMiddleware,
      authorizationMiddleware.authorizeAdmin,
       adminController.getAllUsers );

/**
 * @swagger
 * /api/admin/transactions:
 *   get:
 *     summary: Get all transactions with filters and pagination
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *         description: Number of records per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [CREDIT, DEBIT]
 *         description: Filter by transaction type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, SUCCESS, FAILED, REVERSED]
 *         description: Filter by transaction status
 *     responses:
 *       200:
 *         description: Transactions fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.get( "/transactions",
     authMiddleware.authMiddleware,
      authorizationMiddleware.authorizeAdmin,
       adminController.getAllTransactions );

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get platform statistics
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.get("/stats",
     authMiddleware.authMiddleware,
      authorizationMiddleware.authorizeAdmin,
       adminController.getAdminStats );

router.patch(
    "/users/:userId/freeze",
     authMiddleware.authMiddleware,
      authorizationMiddleware.authorizeAdmin,
       adminController.freezeUser
);

router.patch(
    "/users/:userId/unfreeze",
     authMiddleware.authMiddleware,
      authorizationMiddleware.authorizeAdmin,
       adminController.unfreezeUser
);

router.get(
    "/audit-logs",
     authMiddleware.authMiddleware,
      authorizationMiddleware.authorizeAdmin,
       adminController.getAuditLogs
);

module.exports = router;