const express = require("express");
const router = express.Router();
const {
    generateSummary
} = require("../controllers/aiController");
const authMiddleware =
    require("../middleware/authMiddleware");
router.post(
    "/summary",
    authMiddleware,
    generateSummary
);
module.exports = router;