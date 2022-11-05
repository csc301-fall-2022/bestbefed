import express, { Request, Response } from "express";
import path from 'path'
import { createUser, loginUser, logoutUser } from "../controllers/user";

const router = express.Router();

// Set up route handlers for all routes beginning with "/user"
router.post("/", createUser);
router.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
});

router.post("/login", loginUser);
router.get("/logout", logoutUser);

export default router;