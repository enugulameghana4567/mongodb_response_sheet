const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Schema & Model
const responseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other", "Prefer not to say"],
    },
    studies: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 1, max: 120 },
    schoolName: { type: String, required: true, trim: true },
    collegeName: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Response = mongoose.model("Response", responseSchema);

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "✅ Backend is running!" });
});

// GET all responses
app.get("/api/responses", async (req, res) => {
  try {
    const responses = await Response.find().sort({ createdAt: -1 });
    res.json({ success: true, data: responses });
  } catch (err) {
    console.error("❌ GET error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single response
app.get("/api/responses/:id", async (req, res) => {
  try {
    const response = await Response.findById(req.params.id);
    if (!response) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json({ success: true, data: response });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST - Create new response
app.post("/api/responses", async (req, res) => {
  try {
    const { name, gender, studies, age, schoolName, collegeName } = req.body;

    if (!name || !gender || !studies || !age || !schoolName || !collegeName) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newResponse = new Response({
      name,
      gender,
      studies,
      age,
      schoolName,
      collegeName,
    });

    const saved = await newResponse.save();

    res.status(201).json({
      success: true,
      data: saved,
      message: "Response submitted successfully!",
    });
  } catch (err) {
    console.error("❌ POST error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT - Update response
app.put("/api/responses/:id", async (req, res) => {
  try {
    const updated = await Response.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.json({
      success: true,
      data: updated,
      message: "Updated successfully!",
    });
  } catch (err) {
    console.error("❌ PUT error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE response
app.delete("/api/responses/:id", async (req, res) => {
  try {
    const deleted = await Response.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.json({
      success: true,
      message: "Deleted successfully!",
    });
  } catch (err) {
    console.error("❌ DELETE error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ CONNECT DB FIRST, THEN START SERVER
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
};

startServer();