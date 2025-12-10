const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    
    FoodName: {
        type: String,
        required: true,
    },
    FoodPrice: {
        type: Number,
        required: true,
    },
});
const Food = mongoose.model('Food', foodSchema);
module.exports = Food;