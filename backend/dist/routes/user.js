"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const cart_1 = require("../controllers/cart");
const router = express_1.default.Router();
// Set up route handlers for all routes beginning with "/user"
router.post("/", user_1.createUser);
// Store inventory CRUD endpoints
router.patch("/items/:cartItemId", cart_1.updateCartQuantity);
router.delete("/items/:cartItemId/:clearAll", cart_1.removeCartItem);
router.post("/items", cart_1.addCartItem);
router.get("/items", cart_1.listCartItem);
router.post("/login", user_1.loginUser);
router.get("/logout", user_1.logoutUser);
exports.default = router;
