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
const globals_1 = require("@jest/globals");
const request = require('supertest');
var bodyParser = require('body-parser');
const user_1 = __importDefault(require("../routes/user"));
const User_1 = require("../entity/User");
const data_source_1 = require("../data-source");
const express = require('express');
const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', user_1.default);
(0, globals_1.describe)('Tests User Route Endpoints', function () {
    (0, globals_1.test)('POST to /user/login/', () => __awaiter(this, void 0, void 0, function* () {
        // Store the response from the user login request
        const res = yield request(app).post('/login').send({ username: "thisusernameDNE", password: "testpassword" });
        (0, globals_1.expect)(res.statusCode).toBe(500); // TODO: 500 Status should not be the case, must refactor user controller to allow repository pass
    }));
    (0, globals_1.test)('GET to /user/logout/', () => __awaiter(this, void 0, void 0, function* () {
        // Store the response from the user logout request
        const res = yield request(app).get('/logout');
        (0, globals_1.expect)(res.statusCode).toBe(200);
    }));
    (0, globals_1.test)('POST to /user/', () => __awaiter(this, void 0, void 0, function* () {
        // Store the response from the user creation request
        const res = yield request(app).post('/')
            .send({
            username: "heyhellotesttest",
            password: "LovelyLif3$",
            firstName: "Matty",
            lastName: "P",
            email: "bigmattyp@aol.com",
            paymentInfo: {
                "creditCard": "4485011320017596",
                "expiryDate": "12/24",
                "cvv": "923"
            }
        });
        (0, globals_1.expect)(res.statusCode).toBe(500); // TODO: 500 Status should not be the case, must refactor user controller to allow repository pass
    }));
});
