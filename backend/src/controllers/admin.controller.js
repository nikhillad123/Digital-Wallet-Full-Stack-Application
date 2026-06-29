const userModel = require("../models/user.model");
const accountModel = require("../models/account.model");
const transactionModel = require("../models/transaction.model");
const auditLogModel = require("../models/auditLog.model");

async function getAllUsers(req, res) {
    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalUsers = await userModel.countDocuments();

        const users = await userModel
            .find()
            .select("-password +role")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            page,
            limit,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            users
        });

    } catch (err) {

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }
}

async function getAllTransactions(req, res) {
    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { type, status } = req.query;

        const filter = {};

        if (type) {
            if (!["CREDIT", "DEBIT"].includes(type)) {
                return res.status(400).json({
                    message: "Invalid transaction type"
                });
            }

            filter.type = type;
        }

        if (status) {
            if (!["PENDING", "SUCCESS", "FAILED", "REVERSED"].includes(status)) {
                return res.status(400).json({
                    message: "Invalid transaction status"
                });
            }

            filter.status = status;
        }

        const totalTransactions = await transactionModel.countDocuments(filter);

        const transactions = await transactionModel
            .find(filter)
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            page,
            limit,
            totalTransactions,
            totalPages: Math.ceil(totalTransactions / limit),
            transactions
        });

    } catch (err) {

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function getAdminStats(req, res) {
    try {

        const [
            totalUsers,
            totalAccounts,
            totalTransactions,
            moneyData
        ] = await Promise.all([
            userModel.countDocuments(),
            accountModel.countDocuments(),
            transactionModel.countDocuments(),
            accountModel.aggregate([
                {
                    $group: {
                        _id: null,
                        totalMoneyInSystem: {
                            $sum: "$balance"
                        }
                    }
                }
            ])
        ]);

        const totalMoneyInSystem =
            moneyData.length > 0
                ? moneyData[0].totalMoneyInSystem
                : 0;

        return res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalAccounts,
                totalTransactions,
                totalMoneyInSystem
            }
        });

    } catch (error) {
        console.error("Get Admin Stats Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch admin statistics"
        });
    }
}

async function freezeUser(req, res) {
    try {
        const { userId } = req.params;

        if (req.user._id.toString() === userId) {
            return res.status(400).json({
                success: false,
                message: "Admin cannot freeze their own account"
            });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isFrozen) {
            return res.status(400).json({
                success: false,
                message: "User account is already frozen"
            });
        }

        user.isFrozen = true;
        await user.save();

        await auditLogModel.create({
            admin: req.user._id,
            action: "FREEZE_USER",
            targetUser: user._id
        });

        return res.status(200).json({
            success: true,
            message: "User account frozen successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function unfreezeUser(req, res) {
    try {
        const { userId } = req.params;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.isFrozen) {
            return res.status(400).json({
                success: false,
                message: "User account is not frozen"
            });
        }

        user.isFrozen = false;
        await user.save();

        await auditLogModel.create({
            admin: req.user._id,
            action: "UNFREEZE_USER",
            targetUser: user._id
        });

        return res.status(200).json({
            success: true,
            message: "User account unfrozen successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function getAuditLogs(req, res) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};

        if (req.query.action) {
            filter.action = req.query.action;
        }

        const auditLogs = await auditLogModel
            .find(filter)
            .populate("admin", "name email")
            .populate("targetUser", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalLogs = await auditLogModel.countDocuments(filter);

        return res.status(200).json({
            success: true,
            count: auditLogs.length,
            totalLogs,
            currentPage: page,
            totalPages: Math.ceil(totalLogs / limit),
            auditLogs
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = { getAllUsers, getAllTransactions, getAdminStats, freezeUser, unfreezeUser, getAuditLogs };