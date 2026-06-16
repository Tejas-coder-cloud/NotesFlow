require("dotenv").config();
console.log("JWT SECRET:", process.env.JWT_SECRET)
const express = require("express");
const noteRoutes = require("./routes/noteRoutes");
const aiRoutes = require("./routes/aiRoutes");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const connectDB = require("./config/db");
const protect = require("./middleware/authMiddleware");
const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use(
    "/api/ai",
    aiRoutes
);
app.get("/", (req, res) => {
    res.send("NotesFlow Backend Running");
});
// const protect = require("./middleware/authMiddleware");
app.get("/api/test", protect, (req, res) => {
    res.json({
        message: "Protected Route Accessed",
        user: req.user
    });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});