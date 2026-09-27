require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const requestRoutes = require("./routes/requestRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Waste Collection API is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api", requestRoutes); // /api/categories, /api/requests
app.use("/api/admin", adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`♻️  Waste Collection API listening on http://localhost:${PORT}`);
});
