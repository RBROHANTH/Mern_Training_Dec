import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });
const userSchema = new mongoose.Schema({
  name: {type: String,required: true},
  email: {type: String,required: true, unique: true},
  age: {type: Number,required: true}
});
const User = mongoose.model('User', userSchema);

const newUser = new User({
  name: "John Doe",
  email: "john doe",
  age: 30
});

newUser.save().then(() => {
  console.log("User saved successfully!");
}).catch((err) => {
  console.log("Error saving user:", err);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/info", (req, res) => {
  res.send("This is a sample Express.js server.");
});
app.get('/user/:userId/profile', (req, res) => {
  const userId = req.params.userId;
  const name = req.query.name || 'Guest';
  res.send(`User ID requested: ${userId}, Name: ${name}`);
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});