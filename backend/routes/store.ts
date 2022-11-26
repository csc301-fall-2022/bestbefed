import express, { Request, Response } from "express";
import {
  createStore,
  loginStore,
  logoutStore,
  fetchStores,
} from "../controllers/store";
import {
  listInventory,
  addInventoryItem,
  removeInventoryItem,
  updateInventoryItem,
} from "../controllers/inventory";
import { isAuthenticated } from "../controllers/auth";

const router = express.Router();

// Set up route handlers for all routes beginning with "/store"
router.post("/", createStore);

// Store creation and auth
router.post("/login", loginStore);
router.get("/logout", logoutStore);
router.post("/stores", fetchStores);

// Store inventory CRUD endpoints
router.get("/items", isAuthenticated, listInventory);
router.post("/items/add", isAuthenticated, addInventoryItem);
router.patch("/items/:itemId", isAuthenticated, updateInventoryItem);
router.delete("/items/:itemId", isAuthenticated, removeInventoryItem);

export default router;
