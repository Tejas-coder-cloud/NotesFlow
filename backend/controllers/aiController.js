const {
  generateContent
} = require("../services/aiService");
const User = require("../models/user");
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
      await generateContent(
        "gemini-2.5-flash",
        prompt
      );
    user.summaryCount++;
    await user.save();
    console.log(
      `User ${user.email} has used ${user.summaryCount}/${DAILY_LIMIT} summaries today`
    );
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
const getUsage = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    );
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });

    }
    const today =
      new Date().toDateString();
    const lastReset =
      new Date(
        user.lastReset
      ).toDateString();
    if (today !== lastReset) {
      user.summaryCount = 0;
      user.lastReset =
        new Date();
      await user.save();
    }
    const DAILY_LIMIT = 20;
    res.status(200).json({
      used:
        user.summaryCount,
      remaining:
        DAILY_LIMIT -
        user.summaryCount
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Failed to fetch usage"
    });
  }
};
const generateQuiz = async (req, res) => {
  try {

    const { content } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Reset AI usage daily
    const today = new Date().toDateString();
    const lastReset = new Date(
      user.lastReset
    ).toDateString();

    if (today !== lastReset) {
      user.summaryCount = 0;
      user.lastReset = new Date();
      await user.save();
    }

    const DAILY_LIMIT = 20;

    if (user.summaryCount >= DAILY_LIMIT) {
      return res.status(429).json({
        message:
          "Daily AI limit reached. Please try again tomorrow.",
      });
    }

    const prompt = `
Generate a quiz from the following notes.

Rules:

- Generate exactly 5 multiple-choice questions.
- Each question must have 4 options:
A)
B)
C)
D)

- Mention the correct answer after every question.

- Return plain text only.

Notes:

${content}
`;

    const response =
      await generateContent(
        "gemini-2.5-flash",
        prompt
      );

    user.summaryCount++;

    await user.save();

    res.status(200).json({
      quiz: response.text,
      summariesUsed: user.summaryCount,
      summariesRemaining:
        DAILY_LIMIT - user.summaryCount,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to generate quiz",
      error: error.message,
    });

  }
};
module.exports = {
  generateSummary,
  getUsage,
  generateQuiz
};