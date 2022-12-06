"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const user_1 = require("../controllers/user");
const router = express_1.default.Router();
router.post("/login", user_1.loginUser);
router.get("/logout", user_1.logoutUser);
// Get and update a user's profile
router.get("/profile", auth_1.isAuthenticated, user_1.getUserProfile);
router.patch("/profile", auth_1.isAuthenticated, user_1.updateUserProfile);
// Set up route handlers for all routes beginning with "/user"
router.post("/", user_1.createUser);
exports.default = router;
