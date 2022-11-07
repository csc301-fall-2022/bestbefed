import express, { Request, Response } from "express";
import {
  createStore,
  loginStore,
  logoutStore,
  fetchStores,
} from "../controllers/store";

const router = express.Router();

// Set up route handlers for all routes beginning with "/user"
router.post("/", createStore);

router.post("/login", loginStore);
router.get("/logout", logoutStore);
router.post("/stores", fetchStores);

export default router;
