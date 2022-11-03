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
require("reflect-metadata");
// Local imports
const data_source_1 = require("./data-source");
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.use(express_1.default.static(path_1.default.join(__dirname, "../../frontend/build")));
// Cookies
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// Initialize the database connection via TypeORM
// AppDataSource.initialize()
//     .then(() => {
//         console.log("Conncection to database established...");
//     })
//     .catch((error) => console.log(error));
// Alternatively
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield data_source_1.AppDataSource.initialize();
        console.log("Conncection to database established...");
    }
    catch (e) {
        console.log(e);
    }
});
app.get('/api', (req, res) => {
    res.send('<h1>Hello from API endpoint!<h1>');
});
// Test endpoint
app.post("/login", (req, res) => {
    // Create user
    res.send("User has hopefully been created");
});
app.listen(port, () => {
    connectDB();
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
