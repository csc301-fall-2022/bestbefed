import express from "express";
import { PassThrough } from "stream";
import { createUser, loginUser, logoutUser } from "../controllers/user";

const router = express.Router();

// Set up route handlers for all routes beginning with "/user"
router.post("/", createUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

export default router;