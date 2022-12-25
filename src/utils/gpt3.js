import axios from "axios";
const apiKey = process.env.OPENAI_TOKEN;
const GPT3_API_URL = "https://api.openai.com/v1/completions";

export async function generateText(prompt, model = "text-babbage-001") {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const data = {
    model,
    prompt: prompt,
    temperature: 0.5,
    max_tokens: 2048,
    top_p: 1,
  };

  const response = await axios.post(GPT3_API_URL, data, { headers: headers });
  return response.data.choices[0].text;
}
