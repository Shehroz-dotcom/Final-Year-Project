// backend/utils/embedding.js
import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export const getEmbedding = async (text) => {
  try {
    const embedding = await hf.featureExtraction({
      model: "BAAI/bge-m3",
      inputs: text,
    });
    return embedding;
  } catch (error) {
    console.error("HF Embedding Error:", error);
  }
};