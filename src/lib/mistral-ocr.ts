import { Mistral } from "@mistralai/mistralai";

const apiKey = process.env.MISTRAL_API_KEY;

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function extractTextWithMistral(fileBuffer: Buffer, retries = 3) {
  if (!apiKey) {
    throw new Error("MISTRAL_API_KEY is not configured");
  }

  const client = new Mistral({ apiKey });

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // 1. Convert buffer to base64
      const base64Content = fileBuffer.toString("base64");

      // 2. Run the OCR Model (mistral-ocr-latest)
      const response = await client.ocr.process({
        model: "mistral-ocr-latest",
        document: {
          type: "document_url",
          documentUrl: `data:application/pdf;base64,${base64Content}`,
        }
      });

      // 3. Combine all pages into a single Markdown document
      if (!response.pages || response.pages.length === 0) {
        throw new Error("No pages detected in the document by Mistral OCR");
      }

      return response.pages.map(p => p.markdown).join("\n\n");
    } catch (error: any) {
      const isRateLimit = error?.message?.includes("Too many requests") ||
        error?.statusCode === 429 ||
        error?.status === 429;

      // If it's a rate limit error and we have retries left, wait and retry
      if (isRateLimit && attempt < retries) {
        const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
        console.log(`Rate limited. Retrying in ${waitTime}ms... (Attempt ${attempt + 1}/${retries})`);
        await sleep(waitTime);
        continue;
      }

      // Otherwise, throw the error
      console.error("Mistral OCR Error:", error);
      if (isRateLimit) {
        throw new Error("Too many requests to Mistral API. Please wait a moment and try again.");
      }
      throw new Error("Mistral OCR failed to process the document");
    }
  }

  throw new Error("Failed after maximum retries");
}
