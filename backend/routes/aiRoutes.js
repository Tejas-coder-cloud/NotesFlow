const express = require("express");
const router = express.Router();
const {
    generateSummary,
    getUsage,
    generateQuiz
} = require("../controllers/aiController");
const authMiddleware =
    require("../middleware/authMiddleware");
router.post(
    "/summary",
    authMiddleware,
    generateSummary
);
router.get(
    "/usage",
    authMiddleware,
    getUsage
);
router.post(
    "/quiz",
    authMiddleware,
    generateQuiz
);
module.exports = router;