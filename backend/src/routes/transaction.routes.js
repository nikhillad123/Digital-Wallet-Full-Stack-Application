const express = require("express");
const transactionController = require("../controllers/transaction.controller");
const authMiddleware = require("../middlewares/user.middleware");
const statusMiddleware = require("../middlewares/accountStatus.middleware");
const { depositValidation, withdrawValidation, transferValidation } = require("../validations/transaction.validation");


const validate = require("../middlewares/validation.middleware");

const { transferLimiter } = require("../middlewares/rateLimit.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/transaction/deposit:
 *   post:
 *     summary: Deposit money into wallet
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - idempotencyKey
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 1000
 *               idempotencyKey:
 *                 type: string
 *                 example: dep-001
 *     responses:
 *       200:
 *         description: Money deposited successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/deposit",
     authMiddleware.authMiddleware,
      statusMiddleware.checkFrozenAccount,
       depositValidation, validate,
        transactionController.depositMoney);

/**
 * @swagger
 * /api/transaction/withdraw:
 *   post:
 *     summary: Withdraw money from wallet
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - idempotencyKey
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 500
 *               idempotencyKey:
 *                 type: string
 *                 example: wd-001
 *     responses:
 *       200:
 *         description: Money withdrawn successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/withdraw",
     authMiddleware.authMiddleware,
      statusMiddleware.checkFrozenAccount,
       withdrawValidation,
        validate,
         transactionController.withdrawMoney);

/**
 * @swagger
 * /api/transaction/transfer:
 *   post:
 *     summary: Transfer money to another user
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - toUserId
 *               - amount
 *               - idempotencyKey
 *             properties:
 *               toUserId:
 *                 type: string
 *                 example: 687c4f6f2d0d9a1234567890
 *               amount:
 *                 type: number
 *                 example: 1000
 *               idempotencyKey:
 *                 type: string
 *                 example: transfer-001
 *     responses:
 *       200:
 *         description: Money transferred successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Receiver not found
 */
router.post("/transfer",
     transferLimiter,
    authMiddleware.authMiddleware,
    statusMiddleware.checkFrozenAccount,
    transferValidation,
    validate,
    transactionController.transferMoney
);

/**
 * @swagger
 * /api/transaction/history:
 *   get:
 *     summary: Get transaction history
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [CREDIT, DEBIT]
 *       - in: query
 *         name: minAmount
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxAmount
 *         schema:
 *           type: number
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Transaction history fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/history", authMiddleware.authMiddleware, transactionController.getTransactionHistory);

/**
 * @swagger
 * /api/transaction/{transactionId}/receipt:
 *   get:
 *     summary: Get transaction receipt
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         example: 687c4f6f2d0d9a1234567890
 *     responses:
 *       200:
 *         description: Receipt fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Transaction does not belong to user
 *       404:
 *         description: Transaction not found
 */
router.get("/:transactionId/receipt", authMiddleware.authMiddleware, transactionController.getTransactionReceipt);

router.get("/dashboard",authMiddleware.authMiddleware, transactionController.getDashboardStats);

module.exports = router;