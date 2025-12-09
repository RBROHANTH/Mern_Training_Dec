const express = require('express');

const mongoose = require('mongoose');

const cors = require('cors');

require('dotenv').config();

const Food = require('./models/Foods');

const app = express();

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.log('MongoDB connection error:', err));

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.post('/test', (req, res) => {
    console.log('Test endpoint called');
    console.log('Body:', req.body);
    res.json({ received: req.body });
});

app.post('/insert', async (req, res) => {
    try {
        const foodName = req.body.foodName;
        const daysSinceIAte = req.body.daysSinceIAte;
        
        console.log('Received data:', { foodName, daysSinceIAte });
        
        // Validate data
        if (!foodName || daysSinceIAte === undefined) {
            return res.status(400).send('Missing required fields: foodName and daysSinceIAte');
        }
        
        const food = new Food({ 
            foodName: foodName, 
            daysSinceIAte: Number(daysSinceIAte)
        });
        
        await food.save();
        res.status(201).json({ message: 'Food item inserted', data: food });
    } catch (err) {
        console.error('Insert error:', err.message, err.stack);
        res.status(500).json({ error: 'Error inserting food item', details: err.message });
    }
});

app.get('/read', async (req, res) => {
    try {
        const fooditems = await Food.find({});
        res.status(200).json(fooditems);
    } catch (err) {
        res.status(500).send('Error reading food items');
    }
});

app.put('/update', async (req, res) => {
    const newDays = req.body.newDays;
    const id = req.body.id;
    try {
        await Food.findByIdAndUpdate(id, { daysSinceIAte: newDays });
        res.status(200).send('Food item updated');
    } catch (err) {
        res.status(500).send('Error updating food item');
    }
});

app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await Food.findByIdAndDelete(id);
        res.status(200).send('Food item deleted');
    } catch (err) {
        res.status(500).send('Error deleting food item');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});