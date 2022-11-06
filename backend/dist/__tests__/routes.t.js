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
// import express from 'express';
const user_1 = __importDefault(require("../routes/user"));
const globals_1 = require("@jest/globals");
const request = require('supertest');
const express = require('express');
var bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', user_1.default);
(0, globals_1.describe)('Test User Routes', function () {
    // describe('POST /users', function() {
    //   it('responds with json', function(done) {
    //     request(app)
    //       .post('/users')
    //       .send({name: 'john'})
    //       .set('Accept', 'application/json')
    //       .expect('Content-Type', /json/)
    //       .expect(200)
    //       .end(function(err, res) {
    //         if (err) return done(err);
    //         return done();
    //       });
    //   });
    // });
    (0, globals_1.test)('POST to /user/', () => __awaiter(this, void 0, void 0, function* () {
        // Store the response from the user creation
        const res = yield request(app).post('/')
            .send({
            username: "mikehawkislarge1234",
            password: "IHateMyLif3$",
            firstName: "Matty",
            lastName: "P",
            email: "bigmattyp@aol.com",
            paymentInfo: {
                "creditCard": "4485011320017596",
                "expiryDate": "12/24",
                "cvv": "923"
            }
        });
        (0, globals_1.expect)(res.statusCode).toBe(201);
    }));
});
