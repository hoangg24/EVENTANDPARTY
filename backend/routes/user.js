import express from "express";
import userController from "../controllers/userController.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
// Lấy danh sách người dùng
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);

// Cập nhật thông tin người dùng
router.put("/:id", userController.updateUser);

// Xóa người dùng
router.delete("/:id", userController.deleteUser);

// Chặn hoặc mở chặn tài khoản người dùng
router.put("/block/:id", userController.toggleUserBlock);

router.post("/reset-password-request", userController.resetPasswordRequest);
router.post("/reset-password", userController.resetPassword);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, send user data and token
    const token = jwt.sign(
      { id: req.user._id, username: req.user.username, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.redirect(
      `http://localhost:5173/login-success?token=${token}&id=${req.user._id}&username=${req.user.username}&role=${req.user.role}`
    );
  }
);

export default router;
