const {
  generateContent
} = require("../services/aiService");

const User = require("../models/user");

const DAILY_LIMIT = 20;

// ================= SUMMARY =================

const generateSummary = async (req, res) => {
  try {

    const { content } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Reset every day
    const today = new Date().toDateString();
    const lastReset = new Date(
      user.lastReset
    ).toDateString();

    if (today !== lastReset) {
      user.summaryCount = 0;
      user.lastReset = new Date();
      await user.save();
    }

    if (user.summaryCount >= DAILY_LIMIT) {
      return res.status(429).json({
        message:
          "Daily summary limit reached. Please try again tomorrow."
      });
    }

    const prompt = `
Summarize the following notes.

Return plain text only.

Rules:

- Use bullet points.
- Keep it concise.
- Do not use markdown.
- Do not use **.
- Do not use backticks.

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
      summary: response.text,
      summariesUsed: user.summaryCount,
      summariesRemaining:
        DAILY_LIMIT -
        user.summaryCount
    });

  }
  catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Failed to generate summary",
      error: error.message
    });

  }
};

// ================= USAGE =================

const getUsage = async (req, res) => {

  try {

    const user =
      await User.findById(
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

    res.status(200).json({

      used:
        user.summaryCount,

      remaining:
        DAILY_LIMIT -
        user.summaryCount

    });

  }
  catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Failed to fetch usage"
    });

  }

};

// ================= QUIZ =================

const generateQuiz = async (req, res) => {

  try {

    const { content } = req.body;

    const user =
      await User.findById(
        req.user.id
      );

    if (!user) {

      return res.status(404).json({
        message:
          "User not found"
      });

    }

    // Reset usage every day

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

    if (
      user.summaryCount >= DAILY_LIMIT
    ) {

      return res.status(429).json({

        message:
          "Daily AI limit reached. Please try again tomorrow."

      });

    }

    const prompt = `
Generate exactly 5 multiple choice questions from the following notes.

Return ONLY valid JSON.

Format:

[
  {
    "question":"Question text",
    "options":[
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "answer":1,
    "explanation":"Reason"
  }
]

Rules:

- Exactly 5 questions.
- Exactly 4 options.
- answer must be 0,1,2 or 3.
- Do NOT use markdown.
- Do NOT use \`\`\`.
- Return ONLY JSON.

Notes:

${content}
`;

    const response =
      await generateContent(
        "gemini-2.5-flash",
        prompt
      );

    let raw =
      response.text.trim();

    raw = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let quiz;

    try {

      quiz =
        JSON.parse(raw);

    }
    catch (err) {

      console.log(
        "Invalid AI Response:"
      );

      console.log(raw);

      return res.status(500).json({

        message:
          "AI returned invalid quiz format"

      });

    }

    user.summaryCount++;

    await user.save();

    res.status(200).json({

      quiz,

      summariesUsed:
        user.summaryCount,

      summariesRemaining:
        DAILY_LIMIT -
        user.summaryCount

    });

  }
  catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        "Failed to generate quiz",

      error:
        error.message

    });

  }

};

// ================= EXPORTS =================

module.exports = {

  generateSummary,

  getUsage,

  generateQuiz

};