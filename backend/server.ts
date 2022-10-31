import express, { Express, Request, Response } from 'express';
import path from 'path'

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, "../../frontend/build")))

app.get('/api', (req: Request, res: Response) => {
  res.send('<h1>Hello from API endpoint!<h1>');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});