const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const transactionModel = require("../models/transaction.model");
const accountModel = require("../models/account.model");


async function depositMoney(req, res) {
    // Declare variables at the top so they're accessible in both try and catch blocks
    // (try/catch blocks don't share variable scope, so we need let here)
    let session;
    let userId;
    let idempotencyKey;

    try {
        // Extract amount and idempotencyKey from request body
        const { amount } = req.body;
        idempotencyKey = req.body.idempotencyKey;
        // Get the authenticated user's ID from req.user (attached by authMiddleware)
        userId = req.user._id;

        // 1. Validation: ensure amount is positive and idempotencyKey exists
        // idempotencyKey prevents duplicate deposits from being processed multiple times
        if (!amount || amount <= 0 || !idempotencyKey) {
            return res.status(400).json({
                message: "Valid amount (> 0) and idempotencyKey are required"
            });
        }

        // 2. Start a MongoDB session for transaction (ensures atomic operations)
        session = await mongoose.startSession();
        session.startTransaction();

        // 3. Get the user's account within the transaction session
        // Using .session(session) ensures this read is part of the transaction
        const account = await accountModel.findOne({ user: userId }).session(session);

        // If no account exists, throw an error to trigger catch block
        if (!account) {
            throw new Error("Account not found");
        }

        // 4. Create the transaction record FIRST (idempotency protection)
        // Using an array with create() and { session } ensures this is part of the transaction
        // The idempotencyKey will cause a duplicate key error (code 11000) if the same key is used again
        const transaction = await transactionModel.create([{
            user: userId,
            type: "CREDIT",
            fromAccount: null,
            toAccount: account._id,
            amount,
            status: "SUCCESS",
            idempotencyKey,
            description: "Deposit"
        }], { session });

        // 5. Update the account balance atomically using $inc
        // returnDocument: "after" returns the updated document after the increment
        const updatedAccount = await accountModel.findOneAndUpdate(
            { user: userId },
            { $inc: { balance: amount } },
            { returnDocument: "after", session }
        );

        // 6. Commit the transaction and end the session
        await session.commitTransaction();
        session.endSession();

        // 7. Return success response with new balance and transaction ID
        return res.status(200).json({
            message: "Amount deposited successfully",
            balance: updatedAccount.balance,
            transactionId: transaction[0]._id
        });

    } catch (error) {

        // Handle duplicate key error (idempotency protection)
        // This occurs when the same idempotencyKey is used again
        if (error.code === 11000) {
            // Abort and end session if it was started
            if (session) {
                await session.abortTransaction();
                session.endSession();
            }

            // Find the existing transaction to return it instead of processing again
            const existingTransaction = await transactionModel.findOne({
                user: userId,
                idempotencyKey
            });

            return res.status(409).json({
                message: "Duplicate request blocked",
                transaction: existingTransaction
            });
        }

        // Abort transaction for all other errors
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }

        // Return 500 error for unexpected issues
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

async function withdrawMoney(req, res) {
    let session;

    try {
        // Extract amount and idempotencyKey from request body
        const { amount, idempotencyKey } = req.body;
        const userId = req.user._id;

        // 1. Validation: ensure amount is positive and idempotencyKey exists
        if (!amount || amount <= 0 || !idempotencyKey) {
            return res.status(400).json({
                message: "Valid amount (> 0) and idempotencyKey are required"
            });
        }

        // 2. Start a MongoDB session for transaction
        session = await mongoose.startSession();
        session.startTransaction();

        // 3. Get the user's account within the transaction session
        const account = await accountModel.findOne({ user: userId }).session(session);

        // If no account exists, throw an error
        if (!account) {
            throw new Error("Account not found");
        }

        // 4. Idempotency check BEFORE deducting balance (VERY IMPORTANT)
        // Check if a transaction with this idempotencyKey already exists
        const existingTransaction = await transactionModel.findOne({
            user: userId,
            idempotencyKey
        }).session(session);

        // If duplicate found, abort transaction and return the existing transaction
        if (existingTransaction) {
            await session.abortTransaction();
            session.endSession();

            return res.status(409).json({
                message: "Duplicate request blocked",
                transaction: existingTransaction
            });
        }

        // 5. Atomic balance deduction using findOneAndUpdate with condition
        // balance: { $gte: amount } ensures the update only happens if balance >= amount
        // This prevents race conditions where two withdrawals could happen simultaneously
        const updatedAccount = await accountModel.findOneAndUpdate(
            { _id: account._id, balance: { $gte: amount } },
            { $inc: { balance: -amount } },
            { returnDocument: "after", session }
        );

        // 6. If updatedAccount is null, the balance was insufficient
        if (!updatedAccount) {
            throw new Error("Insufficient balance");
        }

        // 7. Create transaction record AFTER successful deduction
        const transaction = await transactionModel.create([{
            user: userId,
            type: "DEBIT",
            fromAccount: account._id,
            toAccount: null,
            amount,
            status: "SUCCESS",
            idempotencyKey,
            description: "Withdraw"
        }], { session });

        // 8. Commit the transaction and end the session
        await session.commitTransaction();
        session.endSession();

        // 9. Return success response with new balance and transaction ID
        return res.status(200).json({
            message: "Amount withdrawn successfully",
            balance: updatedAccount.balance,
            transactionId: transaction[0]._id
        });

    } catch (error) {

        // Duplicate key error fallback (extra safety)
        if (error.code === 11000) {
            if (session) {
                await session.abortTransaction();
                session.endSession();
            }

            const existingTransaction = await transactionModel.findOne({
                user: req.user._id,
                idempotencyKey: req.body.idempotencyKey
            });

            return res.status(409).json({
                message: "Duplicate request blocked",
                transaction: existingTransaction
            });
        }

        // Abort transaction for all other errors
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }

        // Return error message (either from error object or default)
        return res.status(500).json({
            message: error.message || "Something went wrong"
        });
    }
}

async function transferMoney(req, res) {
    let session;

    try {
        const { toEmail, amount, idempotencyKey } = req.body;
        const fromUserId = req.user._id;

        const normalizedEmail = toEmail.toLowerCase().trim();

        // 1. Resolve receiver by email
        const toUser = await userModel.findOne({ email: normalizedEmail }).lean();
        if (!toUser) {
            return res.status(404).json({
                message: "Receiver not found"
            });
        }
        const toUserId = toUser._id;

        // console.log("Passed email lookup");
        // console.log("Receiver ID:", toUserId);

        // 2. Prevent self-transfer
        if (toUserId.toString() === fromUserId.toString()) {
            return res.status(400).json({
                message: "Sender and receiver cannot be the same"
            });
        }

        // console.log("Passed self-transfer check");

        // 3. Start MongoDB session
        session = await mongoose.startSession();
        session.startTransaction();

        // 4. Fetch both accounts within the session
        const fromAccount = await accountModel.findOne({ user: fromUserId }).session(session);
        if (!fromAccount) throw new Error("Sender account not found");

        const toAccount = await accountModel.findOne({ user: toUserId }).session(session);
        if (!toAccount) throw new Error("Receiver account not found");

        // console.log("Found sender account");
        // console.log("Found receiver account");

        // 5. Idempotency check before any balance changes
        const existingTransaction = await transactionModel.findOne({
            user: fromUserId,
            idempotencyKey
        }).session(session);

        // console.log("Existing transaction:", existingTransaction);

        if (existingTransaction) {
            await session.abortTransaction();
            session.endSession();

            return res.status(200).json({
                message: "Duplicate request",
                transaction: existingTransaction
            });
        }

        // 6. Deduct sender balance atomically
        const updatedSender = await accountModel.findOneAndUpdate(
            { _id: fromAccount._id, balance: { $gte: amount } },
            { $inc: { balance: -amount } },
            { returnDocument: "after", session }
        );

        if (!updatedSender) {
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        // 7. Credit receiver balance
        const updatedReceiver = await accountModel.findOneAndUpdate(
            { _id: toAccount._id },
            { $inc: { balance: amount } },
            { returnDocument: "after", session }
        );

        // console.log("Before create()");

        // 8. Create both transaction records
        const transactions = await transactionModel.create([
            {
                user: fromUserId,
                type: "DEBIT",
                fromAccount: fromAccount._id,
                toAccount: toAccount._id,
                amount,
                status: "SUCCESS",
                idempotencyKey,
                description: "Transfer"
            },
            {
                user: toUserId,
                type: "CREDIT",
                fromAccount: fromAccount._id,
                toAccount: toAccount._id,
                amount,
                status: "SUCCESS",
                description: "Transfer"
            }
        ], { session, ordered: true });

        // 9. Commit
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            message: "Transfer successful",
            data: {
                amount,
                senderBalance: updatedSender.balance,
                receiverEmail: toEmail,
                transactionId: transactions[0]._id
            }
        });

    } catch (error) {

        console.log("FULL ERROR:");
        console.log(error);

        // Duplicate key fallback
        if (error.code === 11000) {
            if (session) {
                await session.abortTransaction();
                session.endSession();
            }

            const existingTransaction = await transactionModel.findOne({
                user: req.user._id,
                idempotencyKey: req.body.idempotencyKey
            });

            return res.status(200).json({
                message: "Duplicate request",
                transaction: existingTransaction
            });
        }

        if (session) {
            await session.abortTransaction();
            session.endSession();
        }

        return res.status(500).json({
            message: error.message || "Something went wrong"
        });
    }
}

async function getTransactionHistory(req, res) {
    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { type, minAmount, maxAmount, startDate, endDate } = req.query;

        if (type && !["CREDIT", "DEBIT"].includes(type)) {
            return res.status(400).json({
                message: "Invalid transaction type"
            });
        }

        if ((minAmount && isNaN(Number(minAmount))) || (maxAmount && isNaN(Number(maxAmount)))) {
            return res.status(400).json({
                message: "Amount must be a valid number"
            });
        }

        if ((minAmount && Number(minAmount) < 0) || (maxAmount && Number(maxAmount) < 0)) {
            return res.status(400).json({
                message: "Amount cannot be negative"
            });
        }

        if (minAmount && maxAmount && Number(minAmount) > Number(maxAmount)) {
            return res.status(400).json({
                message: "minAmount cannot be greater than maxAmount"
            });
        }

        if (startDate && isNaN(Date.parse(startDate))) {
            return res.status(400).json({
                message: "Invalid startDate"
            });
        }

        if (endDate && isNaN(Date.parse(endDate))) {
            return res.status(400).json({
                message: "Invalid endDate"
            });
        }

        if (
            startDate &&
            endDate &&
            new Date(startDate) > new Date(endDate)
        ) {
            return res.status(400).json({
                message: "startDate cannot be after endDate"
            });
        }

        const filter = {
            user: req.user._id
        };

        if (type) {
            filter.type = type;
        }

        if (minAmount || maxAmount) {
            filter.amount = {};

            if (minAmount) {
                filter.amount.$gte = Number(minAmount);
            }

            if (maxAmount) {
                filter.amount.$lte = Number(maxAmount);
            }
        }

        if (startDate || endDate) {
            filter.createdAt = {};

            if (startDate) {
                filter.createdAt.$gte = new Date(startDate);
            }

            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);

                filter.createdAt.$lte = end;
            }
        }

        const transactions = await transactionModel
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalTransactions =
            await transactionModel.countDocuments(filter);

        const totalPages = Math.ceil(totalTransactions / limit);

        return res.status(200).json({
            page,
            limit,
            totalTransactions,
            totalPages,
            transactions
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

async function getTransactionReceipt(req, res) {
    try {

        const { transactionId } = req.params;

        const transaction = await transactionModel.findById(transactionId);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        if (transaction.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this receipt"
            });
        }

        return res.status(200).json({
            success: true,
            receipt: {
                transactionId: transaction._id,
                type: transaction.type,
                amount: transaction.amount,
                status: transaction.status,
                description: transaction.description,
                fromAccount: transaction.fromAccount,
                toAccount: transaction.toAccount,
                createdAt: transaction.createdAt
            }
        });

    } catch (error) {
        console.error("Get Transaction Receipt Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch receipt"
        });
    }
}

async function getDashboardStats(req, res) {
    try {

        const userId = req.user.id;

        const stats = await transactionModel.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                    status: "SUCCESS"
                }
            },
            {
                $group: {
                    _id: null,

                    totalDeposits: {
                        $sum: {
                            $cond: [
                                { $eq: ["$description", "Deposit"] },
                                "$amount",
                                0
                            ]
                        }
                    },

                    totalWithdrawals: {
                        $sum: {
                            $cond: [
                                { $eq: ["$description", "Withdraw"] },
                                "$amount",
                                0
                            ]
                        }
                    },

                    totalTransfers: {
                        $sum: {
                            $cond: [
                                { $eq: ["$description", "Transfer"] },
                                "$amount",
                                0
                            ]
                        }
                    },

                    transactionCount: {
                        $sum: 1
                    }
                }
            }
        ]);

        const dashboardStats = stats[0] || {
            totalDeposits: 0,
            totalWithdrawals: 0,
            totalTransfers: 0,
            transactionCount: 0
        };

        return res.status(200).json({
            stats: dashboardStats
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = { depositMoney, withdrawMoney, transferMoney, getTransactionHistory, getTransactionReceipt, getDashboardStats };