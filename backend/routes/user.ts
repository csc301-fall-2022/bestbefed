import express, { Request, Response } from "express";
import path from 'path'
import { createUser, loginUser, logoutUser } from "../controllers/user";

const router = express.Router();

router.post("/login", loginUser);
router.get("/logout", logoutUser);

// Set up route handlers for all routes beginning with "/user"
router.post("/", createUser);

export default router;