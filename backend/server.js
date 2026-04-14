const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Middleware
app.use(cors()); // or restrict to your Vercel URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Schema & Model
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

// ✅ Test Route
app.get("/", (req, res) => {
  res.json({ message: "✅ Backend is running!" });
});

// ✅ Routes
app.get("/api/responses", async (req, res) => {
  const responses = await Response.find().sort({ createdAt: -1 });
  res.json({ success: true, data: responses });
});

app.post("/api/responses", async (req, res) => {
  const newResponse = new Response(req.body);
  const saved = await newResponse.save();
  res.status(201).json({ success: true, data: saved });
});

app.put("/api/responses/:id", async (req, res) => {
  const updated = await Response.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json({ success: true, data: updated });
});

app.delete("/api/responses/:id", async (req, res) => {
  await Response.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ DB Error:", err));