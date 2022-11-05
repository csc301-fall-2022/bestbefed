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
exports.logoutUser = exports.loginUser = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validator_1 = __importDefault(require("validator"));
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
// Create a user repository that allows us to use TypeORM to interact w/ User entities in DB.
const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
// Helper functions
const isUserErrors = (obj) => {
    return "numErrors" in obj;
};
/**
 * Takes in the request body of a "create user" request, validates and sanitizes the data.
 *
 * @param {UserRequest}  user   Object containing user data from User sign-up form.
 *
 * @return {userRequest | userErrors } Validated.
 */
const cleanUser = (newUser) => __awaiter(void 0, void 0, void 0, function* () {
    // consider implementing try-catch?
    // Takes in the request body of a "create user" request, validates and sanitizes the data
    const errors = {
        numErrors: 0,
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        paymentInfo: [],
    };
    // Check if a user with this username exists in the database
    const existingUser = yield userRepository.findOneBy({
        username: newUser.username,
    });
    if (existingUser) {
        errors.numErrors += 1;
        errors["username"] =
            "Username already exists! Please choose something else.";
    }
    // Verify that password is strong enough
    if (!validator_1.default.isStrongPassword(newUser.password)) {
        errors.numErrors += 1;
        errors["password"] =
            "Password is too weak! You need to have at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 symbol!";
    }
    // Check for valid email address
    if (!validator_1.default.isEmail(newUser.email)) {
        errors.numErrors += 1;
        errors["email"] = "Please enter a valid email address.";
    }
    // Check that first and last names aren't empty
    if (newUser.firstName.length == 0) {
        errors.numErrors += 1;
        errors["firstName"] = "Please enter your first name.";
    }
    if (newUser.lastName.length == 0) {
        errors.numErrors += 1;
        errors["lastName"] = "Please enter your last name.";
    }
    // Check that every piece of the payment info is valid
    if (!validator_1.default.isCreditCard(newUser.paymentInfo.creditCard)) {
        errors.numErrors += 1;
        errors["paymentInfo"].push("Please enter a valid credit card number!");
    }
    //   if (!validator.isDate(newUser.paymentInfo.expiryDate)) {
    //     errors["paymentInfo"].push("Please enter a valid card expiry date!");
    //   }
    if (newUser.paymentInfo.cvv.length != 3 ||
        !validator_1.default.isNumeric(newUser.paymentInfo.cvv)) {
        errors.numErrors += 1;
        errors["paymentInfo"].push("Please enter a valid CVV code for your credit card.");
    }
    // Needs to return either the cleaned user or errors dictionary
    if (errors.numErrors) {
        return errors;
    }
    else {
        return newUser;
    }
});
/**
 * Handles POST user/ and attempts to create new User in database.
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure.
 */
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Try validating the data entered for the new user.
        const userData = {
            username: req.body.username.trim(),
            password: req.body.password.trim(),
            firstName: req.body.firstName.trim(),
            lastName: req.body.lastName.trim(),
            email: req.body.email.trim(),
            paymentInfo: {
                creditCard: req.body.paymentInfo.creditCard.trim(),
                expiryDate: req.body.paymentInfo.expiryDate,
                cvv: req.body.paymentInfo.cvv.trim(),
            },
        };
        const user = yield cleanUser(userData);
        // Do not proceed with user creation if there are errors with entered data.
        if (isUserErrors(user)) {
            // Send back a 200 OK to acknowledge register attempt but send back errors
            return res.status(400).send({ errors: user });
        }
        // All user data was valid - user will now be created properly.
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hashedPass = bcryptjs_1.default.hashSync(user.password, salt);
        const newUser = new User_1.User();
        newUser.username = user.username;
        newUser.firstName = user.firstName;
        newUser.lastName = user.lastName;
        newUser.email = user.email;
        newUser.password = hashedPass;
        newUser.email_verified = false;
        newUser.create_date = new Date();
        newUser.payment_info = user.paymentInfo; // this is bad practice - but we know it'll implement the interface if we get here
        yield userRepository.save(newUser);
        // Send back 201 upon successful creation
        res.status(201).json("New user created.");
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.createUser = createUser;
/**
 * Handles POST user/login and attempts to log in and authenticate a user.
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure.
 */
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Try to query and store user corresponding to entered username.
        const user = yield userRepository.findOneBy({
            username: req.body.username,
        });
        if (!user) {
            return res.status(404).json("User does not exist");
        }
        // If user existed, verify password is correct.
        const validPassword = yield bcryptjs_1.default.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json("Password is incorrect");
        }
        // Create the JWT to provide user with authentication.
        const payload = {
            id: user.user_id,
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.SECRET, {
            expiresIn: "1d",
        });
        res
            .cookie("access_token", token, {
            httpOnly: true,
        })
            .status(200)
            .json({
            username: user.username,
        });
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.loginUser = loginUser;
/**
 * Handles GET user/logout and attempts to log the user out of their session.
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the GET request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure after trying to clear cookie.
 */
const logoutUser = (req, res) => {
    res.clearCookie("access_token");
    res.status(200).send("Logged out!");
};
exports.logoutUser = logoutUser;
