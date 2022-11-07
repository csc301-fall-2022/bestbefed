"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../routes/user"));
const globals_1 = require("@jest/globals");
const request = require('supertest');
const express = require('express');
var bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', user_1.default);
(0, globals_1.describe)('Not implemented yet.', function () {
    (0, globals_1.test)('Not implemented yet.', () => {
    });
});
// describe('Test User Routes', function () {
//   test('POST to /user/', async () => {
//   // Store the response from the user creation
//   const res = await request(app).post('/')
//   .send({ 
//       username: "heyhellotesttest",
//       password: "LovelyLif3$",
//       firstName: "Matty",
//       lastName: "P",
//       email: "bigmattyp@aol.com",
//       paymentInfo: {
//         "creditCard": "4485011320017596",
//         "expiryDate": "12/24",
//         "cvv": "923"
//     }
//   });
//   expect(res.statusCode).toBe(201);
//   });
// }); 
