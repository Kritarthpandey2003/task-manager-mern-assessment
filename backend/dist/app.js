"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
// --- 1. Middleware (The Gatekeepers) ---
app.use(express_1.default.json()); // Allows us to read JSON data sent from frontend
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)()); // Allows frontend to talk to backend
app.use((0, helmet_1.default)()); // Security headers
app.use((0, morgan_1.default)('dev')); // Logs requests to the console
// --- 2. Test Route (To check if it works) ---
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Task Manager Backend is Live!',
        timestamp: new Date().toISOString()
    });
});
exports.default = app;
