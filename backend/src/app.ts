import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app: Application = express();

// --- 1. Middleware (The Gatekeepers) ---
app.use(express.json());       // Allows us to read JSON data sent from frontend
app.use(express.urlencoded({ extended: true }));
app.use(cors());               // Allows frontend to talk to backend
app.use(helmet());             // Security headers
app.use(morgan('dev'));        // Logs requests to the console

// --- 2. Test Route (To check if it works) ---
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Task Manager Backend is Live!',
    timestamp: new Date().toISOString()
  });
});

export default app;