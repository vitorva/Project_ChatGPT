import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const part = req.body.part || "";
  if (part.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid part",
      },
    });
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a talented sports coach. Each of your answers should be an workout plan even if we want to talk to you about something else. Be concise in your reponses. Respond in the language of the user",
        },
        { role: "user", content: generatePrompt(part) },
      ],
    });
    res
      .status(200)
      .json({ result: completion.data.choices[0].message.content });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(part) {
  const capitalizedPart = part[0].toUpperCase() + part.slice(1).toLowerCase();
  return `Suggest a workout plan that targets ${capitalizedPart}`;
}
