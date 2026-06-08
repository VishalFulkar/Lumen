const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authMiddleware.protect, authController.logoutUser);
router.post("/refresh", authController.refreshToken);
router.get("/me", authMiddleware.protect, authController.getMe);

module.exports = router;