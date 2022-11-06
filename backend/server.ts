import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import path from "path";
import "dotenv/config";
import "reflect-metadata";

// Local imports
import userRouter from "./routes/user";
import storeRouter from "./routes/store";
import { AppDataSource } from "./data-source";
import { isAuthenticated } from "./controllers/auth";

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, "../../frontend/build")));

// Middleware via External Libraries.
app.use(cookieParser());
app.use(express.json());

// Routing middleware.
app.use("/user", userRouter);
app.use("/store", storeRouter);

// Initializes connection to DB using TypeORM when called.
const connectDB = async () => {
  try {
      await AppDataSource.initialize();
      console.log("Connection to database established...");
  } catch (e) {
    console.log(e);
  }
};

// Serving up the landing page - Change this to daniel's landing page
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/build", "index.html"));
});

// Example of Auth middleware - the second argument is our auth function that verifies user is logged in before proceeding
app.get("/api", isAuthenticated, (req: Request, res: Response) => {
  res.send("<h1>Hello from API endpoint!<h1>");
});

app.listen(port, () => {
  connectDB();
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
