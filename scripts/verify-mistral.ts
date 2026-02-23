
import { Mistral } from "@mistralai/mistralai";
import * as dotenv from "dotenv";
dotenv.config();

async function check() {
    const key = process.env.MISTRAL_API_KEY;
    if (!key) {
        console.error("❌ MISTRAL_API_KEY is missing!");
        return;
    }
    console.log("✅ MISTRAL_API_KEY is present (starts with " + key.substring(0, 4) + ")");

    try {
        const client = new Mistral({ apiKey: key });
        console.log("✅ Mistral Client initialized");
        // List models to verify key validity
        const models = await client.models.list();
        console.log("✅ API Key works. Found " + models.data?.length + " models.");
    } catch (error: any) {
        console.error("❌ API Key invalid or connection error:", error.message);
    }
}

check();
