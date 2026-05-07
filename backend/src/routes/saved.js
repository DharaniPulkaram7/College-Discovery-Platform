const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  saveCollege,
  unsaveCollege,
  getSavedColleges,
  checkIfSaved,
} = require("../controllers/savedController");

router.post("/:collegeId", authenticate, saveCollege);
router.delete("/:collegeId", authenticate, unsaveCollege);
router.get("/", authenticate, getSavedColleges);
router.get("/:collegeId/check", authenticate, checkIfSaved);

module.exports = router;
