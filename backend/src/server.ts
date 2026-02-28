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
  const { title, reminderTime } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tasks (id, title, "isCompleted", "reminderTime", "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW()) RETURNING *',
      [title, false, reminderTime || null]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error("Database Error:", err);
    res.status(500).json({ error: 'Failed to add task', details: err.message });
  }
});

// 3. Update a task (Toggle OR Edit Title)
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { isCompleted, title, reminderTime } = req.body;

  try {
    let result;
    if (title !== undefined || reminderTime !== undefined) {
      const updates = [];
      const values = [];
      let paramIndex = 1;
      if (title !== undefined) {
        updates.push(`title = $${paramIndex++}`);
        values.push(title);
      }
      if (reminderTime !== undefined) {
        updates.push(`"reminderTime" = $${paramIndex++}`);
        values.push(reminderTime);
      }
      values.push(id);

      const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
      result = await pool.query(query, values);
    } else if (isCompleted !== undefined) {
      // If we are just toggling the checkbox
      result = await pool.query(
        'UPDATE tasks SET "isCompleted" = $1 WHERE id = $2 RETURNING *',
        [isCompleted, id]
      );
    }
    res.json(result?.rows[0]);
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