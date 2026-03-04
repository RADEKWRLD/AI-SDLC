import OpenAI from "openai";
import { env } from "@/lib/env";

export const ai = new OpenAI({
  apiKey: env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

export const AI_MODEL = "deepseek-chat";
