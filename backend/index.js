require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Middleware
const { errorHandler } = require("./src/middleware/errorHandler");

// Routes
const authRoutes = require("./src/routes/auth");
const collegeRoutes = require("./src/routes/colleges");
const comparisonRoutes = require("./src/routes/comparisons");
const reviewRoutes = require("./src/routes/reviews");
const savedRoutes = require("./src/routes/saved");
const predictorRoutes = require("./src/routes/predictor");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/colleges", collegeRoutes);
app.use("/api/comparisons", comparisonRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/predictor", predictorRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
