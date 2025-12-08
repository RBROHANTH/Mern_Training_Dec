const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
    foodName:{
        name : stringify,
        required: true
    },
    daysSinceIAte:{
        type: Number,
        required: true
    }
});
const Food = mongoose.model('Food', FoodSchema);

module.exports = Food;