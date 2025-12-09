const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Todo = require('./Model/Todo');

// User Schema (add this since it's missing)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

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

app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const HashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: HashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

app.post('/api/todos', VerifyToken, async (req, res) => {
    try {
        const { TaskName, TaskStatus } = req.body;
        const newTodo = new Todo({ TaskName, TaskStatus });
        await newTodo.save();
        res.status(201).json({ message: 'Todo item created successfully', todo: newTodo });
    } catch (error) {
        res.status(500).json({ message: 'Error creating todo item', error });
    }
});

app.get('/api/todos', VerifyToken, async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todo items', error });
    }
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on  http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    }); 
