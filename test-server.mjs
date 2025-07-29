#!/usr/bin/env node
import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();

// CORS
app.use(cors({
  origin: "http://localhost:5001",
  credentials: true,
}));

app.use(express.json());

// Simple test login
app.post("/api/login", (req, res) => {
  console.log("Login test called with:", req.body);
  
  const { username, password } = req.body;
  
  if (username === "Admin" && password === "Zed2025") {
    console.log("✅ Login successful");
    return res.json({ success: true, user: { username: "Admin" } });
  } else {
    console.log("❌ Login failed");
    return res.status(401).json({ error: "Invalid credentials" });
  }
});

app.get("/api/auth/user", (req, res) => {
  res.status(401).json({ error: "Not authenticated" });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
});
