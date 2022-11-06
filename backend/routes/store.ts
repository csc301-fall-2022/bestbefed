import express, { Request, Response } from "express";
import path from "path";
import {
  createStore,
  loginStore,
  logoutStore,
  getStores,
} from "../controllers/store";

const router = express.Router();

// Set up route handlers for all routes beginning with "/user"
router.post("/", createStore);

router.post("/login", loginStore);
router.get("/logout", logoutStore);
router.get("/stores", getStores);

export default router;
