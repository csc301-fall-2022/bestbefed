import express, { Request, Response } from "express";
import path from 'path'
import { isAuthenticated } from "../controllers/auth";
import { createUser, loginUser, logoutUser, getUserProfile, updateUserProfile } from "../controllers/user";

const router = express.Router();

router.post("/login", loginUser);
router.get("/logout", logoutUser);

// Get and update a user's profile
router.get("/profile", isAuthenticated, getUserProfile);
router.patch("/profile", isAuthenticated, updateUserProfile);

// Set up route handlers for all routes beginning with "/user"
router.post("/", createUser);

export default router;