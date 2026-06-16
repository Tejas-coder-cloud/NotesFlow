const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const generateSummary = async (req, res) => {
    try {

        const { content } = req.body;

        const prompt = `
Summarize the following notes in concise bullet points:

${content}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

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