const { GoogleGenAI } = require("@google/genai");
const user =
    require("../models/user");
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const generateSummary = async (req, res) => {
    try {

        const { content } = req.body;
        const user =
            await user.findById(
                req.user._id
            );
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

        if (
            user.summaryCount >=
            DAILY_LIMIT
        ) {
            return res.status(429).json({
                message:
                    "Daily summary limit reached"
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

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });
        user.summaryCount++;

        await user.save();

        console.log("FULL RESPONSE:");
        console.log(response);

        res.status(200).json({
            summary: response.text
        });

    } catch (error) {

        console.log("AI ERROR:");
        console.log(error);

        res.status(500).json({
            message: "Failed to generate summary"
        });
    }
};

module.exports = {
    generateSummary
};