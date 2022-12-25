import openai from "openai";

export async function generateText(prompt) {
  openai.init({
    apiKey: process.env.OPENAPI_TOKEN,
  });

  const response = await openai.completion.create({
    engine: "davinci",
    prompt: prompt,
    temperature: 0.5,
    max_tokens: 2048,
  });

  return response.text;
}
