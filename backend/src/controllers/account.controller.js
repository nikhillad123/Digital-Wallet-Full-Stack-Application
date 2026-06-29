const accountModel = require("../models/account.model");


async function getAccount(req, res) {
    // Get the authenticated user's ID from the user object attached by authMiddleware
    const userId = req.user._id;

    // Find the account belonging to this user in the database
    // findOne returns a single document matching the condition { user: userId }
    const account = await accountModel.findOne({ user: userId });

    // If no account is found for this user, return 404 Not Found
    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        });
    }

    // If account exists, return 200 OK with the account details
    // Only expose balance and currency, not the entire account document
    return res.status(200).json({
        message: "Account found",
        account: {
            balance: account.balance,
            currency: account.currency
        }
    });
}



module.exports = { getAccount };