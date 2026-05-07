const express = require("express");
const router = express.Router();
const {
  listColleges,
  getCollegeDetail,
  searchColleges,
} = require("../controllers/collegeController");

router.get("/", listColleges);
router.get("/search", searchColleges);
router.get("/:id", getCollegeDetail);

module.exports = router;
