import bcrypt from "bcryptjs";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import validator from "validator";

import { AppDataSource } from "../data-source";
import { PaymentInfo, UserErrors, UserRequest } from "./interfaces";
import { Order } from "../entity/Order";
import { Item } from "../entity/Item";
import { User } from "../entity/User";

// Create a user repository that allows us to use TypeORM to interact w/ User entities in DB.
const userRepository = AppDataSource.getRepository(User);

// Helper functions
const isUserErrors = (obj: any) => {
    return 'numErrors' in obj;
}

/**
 * Takes in the request body of a "create user" request, validates and sanitizes the data.
 *
 * @param {UserRequest}  user   Object containing user data from User sign-up form.
 *
 * @return {userRequest | userErrors } Validated.
 */
const cleanUser = async (newUser: UserRequest) => { // consider implementing try-catch?
    // Takes in the request body of a "create user" request, validates and sanitizes the data
    const errors: UserErrors = {
        numErrors: 0,
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        paymentInfo: []
    }
    
    // Check if a user with this username exists in the database
    const existingUser: User | null = await userRepository.findOneBy({
        username: newUser.username,
    });
    if (existingUser) {
        errors.numErrors += 1;
        errors['username'] = "Username already exists! Please choose something else.";
    }

    // Verify that password is strong enough
    if (!validator.isStrongPassword(newUser.password)) {
        errors.numErrors += 1;
        errors['password'] = "Password is too weak! You need to have at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 symbol!";
    }

    // Check for valid email address
    if (!validator.isEmail(newUser.email)) {
        errors.numErrors += 1;
        errors['email'] = "Please enter a valid email address.";
    }

    // Check that first and last names aren't empty
    if (newUser.firstName.length == 0) {
        errors.numErrors += 1;
        errors['firstName'] = "Please enter your first name.";
    }
    if (newUser.lastName.length == 0) {
        errors.numErrors += 1;
        errors['lastName'] = "Please enter your last name.";
    }

    // Check that every piece of the payment info is valid
    if (!validator.isCreditCard(newUser.paymentInfo.creditCard)) {
        errors.numErrors += 1;
        errors["paymentInfo"].push("Please enter a valid credit card number!"); 
    }
    if (!validator.isDate(newUser.paymentInfo.expiryDate)) {
        errors["paymentInfo"].push("Please enter a valid card expiry date!");
    }
    if (newUser.paymentInfo.cvv.length != 3 || !validator.isNumeric(newUser.paymentInfo.cvv)) {
        errors.numErrors += 1;
        errors["paymentInfo"].push("Please enter a valid CVV code for your credit card.");
    }

    // Needs to return either the cleaned user or errors dictionary
    if (errors.numErrors) {
        return errors;
    } else {
        return newUser;
    }
}

/**
 * Handles POST user/ and attempts to create new User in database.
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 * 
 * @return {null}          Simply sends response back to client to notify of success or failure.
 */
export const createUser = async (req: Request, res: Response) => {    
    try {
        // Try validating the data entered for the new user.
        const userData: UserRequest = {
            username: (<any>req.body).username.trim(),
            password: (<any>req.body).password.trim(),
            firstName: (<any>req.body).firstName.trim(),
            lastName: (<any>req.body).lastName.trim(),
            email: (<any>req.body).email.trim(),
            paymentInfo: {
                creditCard: (<any>req.body).paymentInfo.creditCard.trim(),
                expiryDate: (<any>req.body).paymentInfo.expiryDate,
                cvv: (<any>req.body).paymentInfo.cvv.trim(),
            }
        } 
        const user = await cleanUser(userData);

        // Do not proceed with user creation if there are errors with entered data.
        if (isUserErrors(user)) {
            // Send back a 200 OK to acknowledge register attempt but send back errors
            return res.send({errors: user}).status(200);
        }

        // All user data was valid - user will now be created properly.
        const salt = bcrypt.genSaltSync(10);
        const hashedPass = bcrypt.hashSync(user.password, salt);
        
        const newUser: User = new User();
        newUser.username = user.username;
        newUser.firstName = user.firstName;
        newUser.lastName = user.lastName;
        newUser.email = user.email;
        newUser.password = hashedPass;
        newUser.emailVerified = false;
        newUser.createDate = new Date();
        newUser.orders = new Array<Order>;
        newUser.cart = new Array<Item>;
        newUser.paymentInfo = <any>user.paymentInfo;        // this is bad practice - but we know it'll implement the interface if we get here

        await userRepository.save(newUser);
        
        // Send back 201 upon successful creation
        res.status(201).json("New user created.");
    } catch (err) {
        res.send(err).status(500);
    }
}

/**
 * Handles POST user/login and attempts to log in and authenticate a user.
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 * 
 * @return {null}          Simply sends response back to client to notify of success or failure.
 */
export const loginUser = (req: Request, res: Response) => {

}