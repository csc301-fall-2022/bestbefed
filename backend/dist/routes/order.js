"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const order_1 = require("../controllers/order");
const router = express_1.default.Router();
router.post("/add", auth_1.isAuthenticated, order_1.createOrder);
router.post("/cancel", auth_1.isAuthenticated, order_1.cancelOrder);
exports.default = router;
