import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to Neon Database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.url}`);
  next();
});

// --- ROUTES ---

// 0. Health Check
app.get('/', (req, res) => {
  res.status(200).send('Backend is running!');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 1. Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 2. Add a new task
app.post('/api/tasks', async (req, res) => {
  const { title } = req.body;
  console.log("POST /api/tasks body:", req.body);
  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, "isCompleted") VALUES ($1, $2) RETURNING *',
      [title, false]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error("Database Error:", err);
    res.status(500).json({
      error: 'Failed to add task',
      details: err.message,
      receivedBody: req.body,
      contentType: req.headers['content-type']
    });
  }
});

// 3. Update a task (Toggle OR Edit Title)
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { isCompleted, title } = req.body; // Now we accept title too!

  try {
    let result;
    if (title !== undefined) {
      // If we are editing the text
      result = await pool.query(
        'UPDATE tasks SET title = $1 WHERE id = $2 RETURNING *',
        [title, id]
      );
    } else {
      // If we are just toggling the checkbox
      result = await pool.query(
        'UPDATE tasks SET "isCompleted" = $1 WHERE id = $2 RETURNING *',
        [isCompleted, id]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// 4. Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

// Export for Vercel (matches what @vercel/node expects for CommonJS)
export default app;