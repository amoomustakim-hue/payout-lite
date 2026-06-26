import "server-only";
import Groq from "groq-sdk";

let groq: Groq | null = null;

export function getGroqClient() {
  if (!groq) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  return groq;
}
