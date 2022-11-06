"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const store_1 = require("../controllers/store");
const router = express_1.default.Router();
// Set up route handlers for all routes beginning with "/user"
router.post("/", store_1.createStore);
router.post("/login", store_1.loginStore);
router.get("/logout", store_1.logoutStore);
router.post("/stores", store_1.fetchStores);
exports.default = router;
