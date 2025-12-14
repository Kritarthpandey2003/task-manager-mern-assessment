import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

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
app.use(express.json());

// --- ROUTES ---

// 1. Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 2. Add a new task
app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, "isCompleted") VALUES ($1, $2) RETURNING *',
      [title, false]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// 3. Update a task (Toggle OR Edit Title)
app.put('/tasks/:id', async (req, res) => {
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
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});