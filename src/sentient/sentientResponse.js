/** @format */

import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
});

const generationConfig = {
  temperature: 2,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

export async function runSentienceResponse(input) {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: 'user',
        parts: [
          {
            text: 'Analyze the sentiment of the following Tweets and classify them as POSITIVE, NEGATIVE, or NEUTRAL. "It\'s so beautiful today!"',
          },
        ],
      },
      {
        role: 'model',
        parts: [{ text: 'POSITIVE' }],
      },
      {
        role: 'user',
        parts: [{ text: '"It\'s so cold today I can\'t feel my feet..."' }],
      },
      {
        role: 'model',
        parts: [{ text: 'NEGATIVE' }],
      },
      {
        role: 'user',
        parts: [{ text: '"The weather today is perfectly adequate."' }],
      },
      {
        role: 'model',
        parts: [{ text: 'NEUTRAL' }],
      },
      {
        role: 'user',
        parts: [{ text: 'I am feeling very good about my Life today\n' }],
      },
      {
        role: 'model',
        parts: [{ text: 'POSITIVE\n' }],
      },
    ],
  });

  const result = await chatSession.sendMessage(input);
  return result.response.text();
}
