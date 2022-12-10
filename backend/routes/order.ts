import express, { Request, Response } from "express";

import path from "path";

import { createOrder } from "../controllers/order";

const router = express.Router();

router.post("/add", createOrder);

// TODO: Implement a route to list all the orders?
// router.get("/items", listCartItem);

export default router;