"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Connect to Neon Database
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// --- ROUTES ---
// 0. Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// 1. Get all tasks
app.get('/api/tasks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield pool.query('SELECT * FROM tasks ORDER BY id ASC');
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}));
// 2. Add a new task
app.post('/api/tasks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = req.body;
    try {
        const result = yield pool.query('INSERT INTO tasks (title, "isCompleted") VALUES ($1, $2) RETURNING *', [title, false]);
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: 'Failed to add task' });
    }
}));
// 3. Update a task (Toggle OR Edit Title)
app.put('/api/tasks/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { isCompleted, title } = req.body; // Now we accept title too!
    try {
        let result;
        if (title !== undefined) {
            // If we are editing the text
            result = yield pool.query('UPDATE tasks SET title = $1 WHERE id = $2 RETURNING *', [title, id]);
        }
        else {
            // If we are just toggling the checkbox
            result = yield pool.query('UPDATE tasks SET "isCompleted" = $1 WHERE id = $2 RETURNING *', [isCompleted, id]);
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update task' });
    }
}));
// 4. Delete a task
app.delete('/api/tasks/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.json({ message: 'Task deleted' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete task' });
    }
}));
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}
// Export for Vercel (matches what @vercel/node expects for CommonJS)
module.exports = app;
