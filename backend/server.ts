import express, { Express, Request, Response } from 'express';
import cookieParser from "cookie-parser";
import path from 'path'
import "reflect-metadata"

// Local imports
import { AppDataSource } from './data-source';
import { User } from './entity/User';
// import { createUser } from './controllers/user';

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, "../../frontend/build")))

// Cookies
app.use(cookieParser());
app.use(express.json());

// Initialize the database connection via TypeORM
// AppDataSource.initialize()
//     .then(() => {
//         console.log("Conncection to database established...");
//     })
//     .catch((error) => console.log(error));

// Alternatively
const connectDB = async() => {
  try {
      await AppDataSource.initialize();
      console.log("Conncection to database established...");
  } catch (e) {
      console.log(e);
  }
}

app.get('/api', (req: Request, res: Response) => {
  res.send('<h1>Hello from API endpoint!<h1>');
});

// Test endpoint
app.post("/login", (req: Request, res: Response) => {
  // Create user
  res.send("User has hopefully been created");
});

app.listen(port, () => {
  connectDB();
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});