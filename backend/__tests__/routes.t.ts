import {describe, expect, test} from '@jest/globals';
const request = require('supertest');
var bodyParser = require('body-parser');
import router from '../routes/user';
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { Repository } from 'typeorm';

const express = require('express');
const userRepository = AppDataSource.getRepository(User);
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', router);


describe('Tests User Route Endpoints', function () {
  test('POST to /user/login/', async () => {
    // Store the response from the user login request
    const res = await request(app).post('/login').send({username:"thisusernameDNE", password:"testpassword"});
    expect(res.statusCode).toBe(500); // TODO: 500 Status should not be the case, must refactor user controller to allow repository pass
  });

  test('GET to /user/logout/', async () => {
    // Store the response from the user logout request
    const res = await request(app).get('/logout')
    expect(res.statusCode).toBe(200);
  });

  test('POST to /user/', async () => {
    // Store the response from the user creation request
    const res = await request(app).post('/')
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
    expect(res.statusCode).toBe(500); // TODO: 500 Status should not be the case, must refactor user controller to allow repository pass
  });
});