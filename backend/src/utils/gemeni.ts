import dotenv from "dotenv"
dotenv.config({ quiet: true })

import { GoogleGenerativeAI } from "@google/generative-ai";
import { ApiError } from "./ApiError.ts";

const api_key: string = process.env.GEMINI_API_KEY as string
if (!api_key) throw new ApiError(403, "gemeni api key is missing !!")

const genAI = new GoogleGenerativeAI(api_key);
export const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

console.log("key ----> ", process.env.GEMINI_API_KEY)
