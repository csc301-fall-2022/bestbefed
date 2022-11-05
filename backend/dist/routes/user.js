"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const user_1 = require("../controllers/user");
const router = express_1.default.Router();
// Set up route handlers for all routes beginning with "/user"
router.post("/", user_1.createUser);
router.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../frontend/build', 'index.html'));
});
router.post("/login", user_1.loginUser);
router.get("/logout", user_1.logoutUser);
exports.default = router;
