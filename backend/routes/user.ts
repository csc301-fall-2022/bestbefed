import express from "express";
import { createUser } from "../controllers/user";

const router = express.Router();

// Set up route handlers for all routes beginning with "/user"
router.post("/", createUser);

export default router;