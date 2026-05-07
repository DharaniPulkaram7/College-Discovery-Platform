const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  createReview,
  getCollegeReviews,
  deleteReview,
} = require("../controllers/reviewController");

router.post("/:collegeId", authenticate, createReview);
router.get("/:collegeId", getCollegeReviews);
router.delete("/:id", authenticate, deleteReview);

module.exports = router;
