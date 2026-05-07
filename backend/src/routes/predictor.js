const express = require("express");
const router = express.Router();
const { predictColleges } = require("../controllers/predictorController");

router.get("/", predictColleges);

module.exports = router;
