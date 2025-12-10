const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    
    TaskName: {
        type: String,
        required: true,
    },
    TaskStatus: {
        type: Boolean,
        required: true,
    },
});
const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;