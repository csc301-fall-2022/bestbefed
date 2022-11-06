// import express from 'express';
import router from '../routes/user';
import {describe, expect, test} from '@jest/globals';
const request = require('supertest');
const express = require('express');
var bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', router);


describe('Test User Routes', function () {

test('POST to /user/', async () => {
  // Store the response from the user creation
  const res = await request(app).post('/')
  .send({ 
      username: "heyhellotesttest",
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
  expect(res.statusCode).toBe(201);
  });
}); 