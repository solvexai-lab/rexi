import { extractTextWithMistral } from "../src/lib/mistral-ocr.js";
import { config } from "dotenv";
import fs from "fs";

// Load environment variables
config({ path: ".env.local" });

console.log("🧪 Testing Mistral OCR...");
console.log("API Key present:", process.env.MISTRAL_API_KEY ? "YES" : "NO");

async function testOCR() {
    try {
        // Test with the first PDF we can find
        const testPdfPath = "knowledge-base/motor-vehicle-insurance/samples/two-wheeler/acko/acko-two-wheeler-insurance-policy-brochurepdf.pdf";

        console.log(`\nReading PDF: ${testPdfPath}`);
        const buffer = fs.readFileSync(testPdfPath);
        console.log(`PDF size: ${(buffer.length / 1024).toFixed(2)} KB`);

        console.log("\nCalling Mistral OCR...");
        const text = await extractTextWithMistral(buffer);

        console.log("\n✅ SUCCESS!");
        console.log(`Extracted ${text.length} characters`);
        console.log("\nFirst 500 characters:");
        console.log(text.substring(0, 500));

    } catch (error) {
        console.error("\n❌ ERROR:");
        console.error(error);
    }
}

testOCR();
