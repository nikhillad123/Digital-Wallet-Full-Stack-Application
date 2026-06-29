async function getCurrentUser(req, res) {
    const user = req.user;

    res.status(200).json({
        message: "Current user data",
        user
    })
}

module.exports = { getCurrentUser };