import express, { Request, Response } from "express";
import { isAuthenticated } from "../controllers/auth";

import path from "path";

import { createOrder, cancelOrder } from "../controllers/order";

const router = express.Router();

router.post("/add", isAuthenticated, createOrder);
router.post("/cancel", isAuthenticated, cancelOrder);

export default router;