const mongoose = require('mongoose');

require('dotenv').config();
const dbURI =  process.env.DB_URI;
require('dotenv').config();
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/myapp";

mongoose.connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });