"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Self-defined middleware function (used as second argument to route-handlers) which checks if
 * a user is logged in/authenticated before handling their request.
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 * @param {Function} next  The function to be run after this one has finished running.
 *
 * @return {null}          Will send message of failure to client or yield execution to controller handling endpoint.
 */
const isAuthenticated = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.send("Unauthorized - request not authenticated.").status(401);
    }
    // Verify that the cookie is valid
    jsonwebtoken_1.default.verify(token, (process.env.PRODUCTION ? process.env.SECRET : "hellomyfriend"), (err, payload) => {
        if (err) {
            // Ideally this should prompt a redirect to the User login page
            return res
                .json("Session token is invalid. Please login again.")
                .status(403);
        }
        // Successful JWT Verify decodes the payload, i.e., we will have access to the user's uuid
        req.user = {
            id: payload.id,
        };
        next();
    });
};
exports.isAuthenticated = isAuthenticated;
