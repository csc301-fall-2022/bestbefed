import express, { Request, Response } from "express";
import { createUser, loginUser, logoutUser } from "../controllers/user";
import {
  listCartItem,
  addCartItem,
  removeCartItem,
  updateCartQuantity,
} from "../controllers/cart";
import { isAuthenticated } from "../controllers/auth";
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

export default router;
