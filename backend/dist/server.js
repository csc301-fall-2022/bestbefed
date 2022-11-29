"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
require("dotenv/config");
require("reflect-metadata");
// Local imports
const user_1 = __importDefault(require("./routes/user"));
const store_1 = __importDefault(require("./routes/store"));
const data_source_1 = require("./data-source");
const auth_1 = require("./controllers/auth");
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
// const cors = require("cors");
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// Middleware via External Libraries.
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// Example of Auth middleware - the second argument is our auth function that verifies user is logged in before proceeding
app.get("/api", auth_1.isAuthenticated, (req, res) => {
    res.send("<h1>Hello from API endpoint!<h1>");
});
// User routing middleware.
app.use("/user", user_1.default);
// Store routing middleware.
app.use("/store", store_1.default);
// All other routes are directed to the React app
app.use(express_1.default.static(path_1.default.join(__dirname, "../../frontend/build/")));
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../frontend/build/"));
});
// Initializes connection to DB using TypeORM when called.
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield data_source_1.AppDataSource.initialize();
        let host = process.env.PRODUCTION == "true"
            ? "bestbefed-data.czbbb7d5g36e.us-east-2.rds.amazonaws.com"
            : "localhost";
        console.log(`⚡️[server]: Connection to database established (${host})`);
    }
    catch (e) {
        console.log(e);
    }
});
app.listen(port, () => {
    connectDB();
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
