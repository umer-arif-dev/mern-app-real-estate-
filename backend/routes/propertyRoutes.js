const express = require("express");
const router = express.Router();

const {
  createProperty,
  getProperties,
  deleteProperty,
} = require("../controllers/propertyController");

const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getProperties).post(protect, createProperty);

router.delete("/:id", protect, deleteProperty);

module.exports = router;
