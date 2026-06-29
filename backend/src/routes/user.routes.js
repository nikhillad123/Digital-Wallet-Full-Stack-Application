const express = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/user.middleware");

const router = express.Router();
router.get("/me", authMiddleware.authMiddleware, userController.getCurrentUser);

module.exports = router;