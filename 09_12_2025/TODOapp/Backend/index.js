const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Todo = require('./Model/Todo');

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// JWT Token Verification Middleware
const VerifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Access Denied' });
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.log('MongoDB connection error:', err));

// Home Route
app.get('/', (req, res) => {
    res.send('Server is running');
});

// ==================== AUTH ROUTES ====================

// Register User
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// Login User
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// ==================== TODO ROUTES (Protected) ====================

// Create Todo
app.post('/api/todos', VerifyToken, async (req, res) => {
    try {
        const { TaskName, TaskStatus } = req.body;
        
        if (!TaskName || TaskStatus === undefined) {
            return res.status(400).json({ message: 'Missing required fields: TaskName and TaskStatus' });
        }
        
        const newTodo = new Todo({ 
            TaskName, 
            TaskStatus: Boolean(TaskStatus) 
        });
        await newTodo.save();
        res.status(201).json({ message: 'Todo item created successfully', todo: newTodo });
    } catch (error) {
        res.status(500).json({ message: 'Error creating todo item', error: error.message });
    }
});

// Get All Todos
app.get('/api/todos', VerifyToken, async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todo items', error: error.message });
    }
});

// Update Todo
app.put('/api/todos/:id', VerifyToken, async (req, res) => {
    try {
        const { TaskName, TaskStatus } = req.body;
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { TaskName, TaskStatus },
            { new: true }
        );
        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json({ message: 'Todo updated successfully', todo: updatedTodo });
    } catch (error) {
        res.status(500).json({ message: 'Error updating todo item', error: error.message });
    }
});

// Delete Todo
app.delete('/api/todos/:id', VerifyToken, async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting todo item', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});