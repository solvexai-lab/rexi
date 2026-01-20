import { Mistral } from "@mistralai/mistralai";

const apiKey = process.env.MISTRAL_API_KEY;

export async function extractTextWithMistral(fileBuffer: Buffer) {
  if (!apiKey) {
    throw new Error("MISTRAL_API_KEY is not configured");
  }

  const client = new Mistral({ apiKey });

  try {
    // 1. Convert buffer to base64
    const base64Content = fileBuffer.toString("base64");

    // 2. Run the OCR Model (mistral-ocr-latest)
    // The structure should be { model: string, document: { type: "document_url", document_url: string } }
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
  } catch (error) {
    console.error("Mistral OCR Error:", error);
    throw new Error("Mistral OCR failed to process the document");
  }
}
