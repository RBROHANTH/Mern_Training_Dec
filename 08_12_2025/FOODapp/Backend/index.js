import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Food from "./Food.js";
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
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/foods", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/foods", async (req, res) => {
  try {
    const newFood = new Food(req.body);
    await newFood.save();
    res.status(201).json(newFood);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
