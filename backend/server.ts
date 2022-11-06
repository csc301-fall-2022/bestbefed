import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import path from "path";
import "dotenv/config";
import "reflect-metadata";

// Local imports
import userRouter from "./routes/user";
import { AppDataSource } from "./data-source";
import { isAuthenticated } from "./controllers/auth";

const app: Express = express();
const port = process.env.PORT || 8000;
const cors = require("cors");

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Middleware via External Libraries.
app.use(cookieParser());
app.use(express.json());

// Example of Auth middleware - the second argument is our auth function that verifies user is logged in before proceeding
app.get("/api", isAuthenticated, (req: Request, res: Response) => {
  res.send("<h1>Hello from API endpoint!<h1>");
});

// User routing middleware.
app.use("/user", userRouter);

// All other routes are directed to the React app
app.use(express.static(path.join(__dirname, "../../frontend/build/")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/build/"));
});

// Initializes connection to DB using TypeORM when called.
const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Conncection to database established...");
  } catch (e) {
    console.log(e);
  }
};

app.listen(port, () => {
  connectDB();
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});