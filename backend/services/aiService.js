const { GoogleGenAI } = require("@google/genai");

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const delay = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

const generateContent = async (
  model,
  prompt
) => {

  try {

    const response =
      await gemini.models.generateContent({
        model,
        contents: prompt,
      });

    return response;

  } catch (error) {

    console.log(
      "Gemini failed. Retrying..."
    );

    await delay(2000);

    try {

      const response =
        await gemini.models.generateContent({
          model,
          contents: prompt,
        });

      return response;

    } catch (retryError) {

      console.log(
        "Retry failed."
      );

      throw retryError;

    }

  }

};

module.exports = {
  generateContent,
};