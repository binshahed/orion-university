import express from 'express';
import cors from 'cors';
import { routes } from './app/router/router';
const app = express();

app.use(express.json());
app.use(cors());

routes(app);

export default app;
