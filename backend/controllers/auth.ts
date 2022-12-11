import { Request, Response } from "express";
import jwt from "jsonwebtoken";

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
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: Function
) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.send("Unauthorized - request not authenticated.").status(401);
  }

  // Verify that the cookie is valid
  jwt.verify(
    token,
    <string>(
      (process.env.PRODUCTION == "true" ? process.env.SECRET : "hellomyfriend")
    ),
    (err: any, payload: any) => {
      if (err) {
        // Ideally this should prompt a redirect to the User login page
        return res
          .json("Session token is invalid. Please login again.")
          .status(403);
      }

      // Add a property to the request containing user or store's id
      if (<string>payload.type === "user") {
        // Successful JWT Verify decodes the payload, i.e., we will have access to the user's uuid
        (<any>req).user = {
          id: <string>payload.id,
        };
      } else if (<string>payload.type === "store") {
        // Successful JWT Verify decodes the payload, i.e., we will have access to the user's uuid
        (<any>req).store = {
          id: <string>payload.id,
        };
      } else {
        return res
          .status(401)
          .json("This token doesn't correspond to a valid user.");
      }

      next();
    }
  );
};
