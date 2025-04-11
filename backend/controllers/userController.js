import { User } from "../models/index.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import emailjs from "@emailjs/nodejs";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import dotenv from "dotenv";
dotenv.config();

const userController = {
  registerUser: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
  
      // Kiểm tra định dạng email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
  
      // Kiểm tra độ mạnh của mật khẩu
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character",
        });
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        const err = new Error("Email is already in use");
        err.statusCode = 400;
        next(err); // 👉 tự gọi để log bug
        return res.status(400).json({ message: err.message });
      }
      const newUser = new User({
        username,
        email,
        password,
        role: "user",
      });
  
      await newUser.save();
      res.status(201).json({ message: "Registration successful" });
    } catch (error) {
      next(error); // Ghi log lỗi vào BugLog
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ message: "Email or password is incorrect" });
      }
  
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Email or password is incorrect" });
      }
  
      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
  
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          isBlocked: user.isBlocked,
        },
      });
    } catch (error) {
      console.error("Server error:", error.message); // Log server error
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Get a list of all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Update user information
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Delete a user
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Block or unblock a user account
  toggleUserBlock: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.isBlocked = !user.isBlocked;
      await user.save();

      res.status(200).json({
        message: user.isBlocked ? "Account blocked" : "Account unblocked",
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  resetPasswordRequest: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Email does not exist" });
      }

      const token = crypto.randomBytes(20).toString("hex");
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      const host = req.hostname;
      const protocol = req.get("x-forwarded-proto") || "http";
      const resetUrl = `${protocol}://${host}:5173/reset-password/${token}`;

      const templateParams = {
        to_email: user.email,
        reset_url: resetUrl,
      };

      // Use environment variables for sensitive data
      const serviceID = process.env.EMAILJS_SERVICE_ID || "service_w7stawa";
      const templateID = process.env.EMAILJS_TEMPLATE_ID || "template_ujykint";
      const apiKey = process.env.EMAILJS_API_KEY;
      const privateKey = process.env.EMAILJS_PRIVATE_KEY;

      emailjs
        .send(serviceID, templateID, templateParams, {
          publicKey: apiKey, // Required: Public API key for client-side
          privateKey: privateKey, // Required: Private API key for Node.js
        })
        .then(
          (response) => {
            res
              .status(200)
              .json({ message: "Email sent to reset password" });
          },
          (error) => {
            res
              .status(500)
              .json({ message: "Error sending email", error: error.message });
          }
        );
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token, password } = req.body;
  
      // Kiểm tra độ mạnh của mật khẩu
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character",
        });
      }
  
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ message: "Token is invalid or has expired" });
      }
  
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
  
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/users/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            user.googleId = profile.id;
          } else {
            const randomPassword = crypto.randomBytes(16).toString("hex");
            user = new User({
              googleId: profile.id,
              username: profile.displayName,
              email: profile.emails[0].value,
              password: randomPassword,
              role: "user",
            });
          }
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default userController;