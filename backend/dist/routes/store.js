"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const store_1 = require("../controllers/store");
const inventory_1 = require("../controllers/inventory");
const auth_1 = require("../controllers/auth");
const router = express_1.default.Router();
// Store inventory CRUD endpoints
router.patch("/items/:itemId", auth_1.isAuthenticated, inventory_1.updateInventoryItem);
router.delete("/items/:itemId", auth_1.isAuthenticated, inventory_1.removeInventoryItem);
router.post("/items", auth_1.isAuthenticated, inventory_1.addInventoryItem);
router.get("/items", inventory_1.listInventory);
// Store profile endpoints
router.get("/profile", auth_1.isAuthenticated, store_1.getStoreProfile);
// Set up route handlers for all routes beginning with "/store"
// Store creation and auth
router.post("/login", store_1.loginStore);
router.get("/logout", store_1.logoutStore);
router.get("/stores", store_1.fetchStores);
router.post("/", store_1.createStore);
exports.default = router;
