const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  createComparison,
  getComparison,
  getUserComparisons,
  deleteComparison,
} = require("../controllers/comparisonController");

router.post("/", authenticate, createComparison);
router.get("/", authenticate, getUserComparisons);
router.get("/:id", authenticate, getComparison);
router.delete("/:id", authenticate, deleteComparison);

module.exports = router;
