import express, { Request, Response } from "express";
import path from 'path'
import { isAuthenticated } from "../controllers/auth";
import { createUser, loginUser, logoutUser, getUserProfile, updateUserProfile } from "../controllers/user";
import {
  listCartItem,
  addCartItem,
  removeCartItem,
  updateCartQuantity,
} from "../controllers/cart";
const router = express.Router();

// Set up route handlers for all routes beginning with "/user"
router.post("/", createUser);

// Store inventory CRUD endpoints
router.patch("/items/:cartItemId", isAuthenticated, updateCartQuantity);
router.delete("/items/:cartItemId/:clearAll", isAuthenticated, removeCartItem);
router.post("/items", isAuthenticated, addCartItem);
router.get("/items", isAuthenticated, listCartItem);

router.post("/login", loginUser);
router.get("/logout", logoutUser);

// Get and update a user's profile
router.get("/profile", isAuthenticated, getUserProfile);
router.patch("/profile", isAuthenticated, updateUserProfile);

export default router;
