const { GoogleGenAI } = require("@google/genai");
const User = require("../models/user");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateSummary = async (req, res) => {
  try {
    const { content } = req.body;
    console.log("REQ USER:");
    console.log(req.user);
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Reset summary count every day
    const today = new Date().toDateString();
    const lastReset = new Date(
      user.lastReset
    ).toDateString();

    if (today !== lastReset) {
      user.summaryCount = 0;
      user.lastReset = new Date();
      await user.save();
    }

    // Daily limit
    const DAILY_LIMIT = 20;

    if (
      user.summaryCount >= DAILY_LIMIT
    ) {
      return res.status(429).json({
        message:
          "Daily summary limit reached. Please try again tomorrow.",
      });
    }

    const prompt = `
Summarize the following notes.

Return plain text only.

Rules:
- Use bullet points
- Do not use markdown
- Do not use ** symbols
- Do not use backticks
- Keep it concise

Notes:
${content}
`;

    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

    user.summaryCount++;
    await user.save();

    res.status(200).json({
      summary: response.text,
      summariesUsed:
        user.summaryCount,
      summariesRemaining:
        DAILY_LIMIT -
        user.summaryCount,
    });
  } catch (error) {
    console.log(
      "AI ERROR:"
    );
    console.log(error);

    res.status(500).json({
      message:
        "Failed to generate summary",
      error: error.message,
    });
  }
};

module.exports = {
  generateSummary,
};