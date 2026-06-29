async function checkFrozenAccount(req, res, next) {

    if (req.user.isFrozen) {
        return res.status(403).json({
            success: false,
            message: "Account is frozen. Please contact support."
        });
    }

    next();
}

module.exports = { checkFrozenAccount };