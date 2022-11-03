import express, { Express, Request, Response } from 'express';
import path from 'path'
import "reflect-metadata"

// Local imports
import { AppDataSource } from './data-source';

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, "../../frontend/build")))

// Initialize the database connection via TypeORM
AppDataSource.initialize()
    .then(() => {
        // here you can start to work with your database
    })
    .catch((error) => console.log(error));


app.get('/api', (req: Request, res: Response) => {
  res.send('<h1>Hello from API endpoint!<h1>');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});