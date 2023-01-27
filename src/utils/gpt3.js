import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const apiKey = process.env.OPENAI_TOKEN;
const GPT3_API_URL = "https://api.openai.com/v1/completions";

export async function generateText(prompt, model = "text-davinci-003") {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const data = {
    model,
    prompt: prompt,
    temperature: 0.5,
    max_tokens: 3000,
    top_p: 0.5,
  };

  const response = await axios.post(GPT3_API_URL, data, { headers: headers });
  const choices = response.data.choices;
  return choices[0].text;
}
