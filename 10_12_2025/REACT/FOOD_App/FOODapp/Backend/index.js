const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Food = require('./Model/FOODs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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

// ==================== FOOD ROUTES ====================

// Create Food
app.post('/api/foods', async (req, res) => {
    try {
        const { FoodName, FoodPrice } = req.body;
        
        if (!FoodName || FoodPrice === undefined) {
            return res.status(400).json({ message: 'Missing required fields: FoodName and FoodPrice' });
        }
        
        const newFood = new Food({ 
            FoodName, 
            FoodPrice: Number(FoodPrice) 
        });
        await newFood.save();
        res.status(201).json({ message: 'Food item created successfully', food: newFood });
    } catch (error) {
        res.status(500).json({ message: 'Error creating food item', error: error.message });
    }
});

// Get All Foods
app.get('/api/foods', async (req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching food items', error: error.message });
    }
});

// Update Food
app.put('/api/foods/:id', async (req, res) => {
    try {
        const { FoodName, FoodPrice } = req.body;
        const updatedFood = await Food.findByIdAndUpdate(
            req.params.id,
            { FoodName, FoodPrice },
            { new: true }
        );
        if (!updatedFood) {
            return res.status(404).json({ message: 'Food not found' });
        }
        res.json({ message: 'Food updated successfully', food: updatedFood });
    } catch (error) {
        res.status(500).json({ message: 'Error updating food item', error: error.message });
    }
});

// Delete Food
app.delete('/api/foods/:id', async (req, res) => {
    try {
        const deletedFood = await Food.findByIdAndDelete(req.params.id);
        if (!deletedFood) {
            return res.status(404).json({ message: 'Food not found' });
        }
        res.json({ message: 'Food deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting food item', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});