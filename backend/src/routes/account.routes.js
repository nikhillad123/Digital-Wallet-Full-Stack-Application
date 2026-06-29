const express = require("express");
const accountController = require("../controllers/account.controller");
const authMiddleware = require("../middlewares/user.middleware");

const router = express.Router();
router.get("/", authMiddleware.authMiddleware, accountController.getAccount);

module.exports = router;