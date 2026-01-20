import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

if (!supabaseUrl || !supabaseServiceRoleKey || !process.env.GEMINI_API_KEY) {
  console.error('Missing environment variables (Supabase or Gemini)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const industries = [
  "Software/SaaS", "Real Estate", "Employment", "Construction", "Healthcare",
  "Finance/Banking", "Manufacturing", "Retail/E-commerce", "Logistics", "Energy",
  "Entertainment", "Education", "Consulting", "Government Contracting", "Insurance"
];

  const categories = ["liability", "termination", "payment", "ip", "warranties", "other"];
  
  async function generateBatch(industry, round) {
    const prompt = `Generate 20 unique high-risk legal patterns (red flags) specifically found in ${industry} contracts.
    This is round ${round} of generation, so focus on diverse and less common risks if possible.
    Return as a JSON array of objects with these fields:
    - id: string (unique, lowercase-hyphenated, e.g., "${industry.toLowerCase().replace(/[^a-z0-9]/g, '-')}-risk-name-${round}")
    - name: string (concise name)
    - category: one of [${categories.join(', ')}]
    - severity: one of [low, medium, high, critical]
    - description: string (detailed explanation of the clause)
    - why_it_matters: string (risk explanation)
    - plain_english: string (simplified explanation)
    - how_it_should_be: string (fairer alternative)
    - negotiation_script: string (how to negotiate it)
    - suggested_alternative: string (sample legal text)
    
    Ensure the "id" is unique by including the industry and round ${round} in it.
    Only return the JSON array, no other text.`;


  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonStr = text.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error(`Error generating for ${industry}:`, e.message);
    return [];
  }
}

async function main() {
  console.log("Starting autonomous knowledge expansion to 1000+ patterns...");
  
  let totalIngested = 0;
  
  // We'll run in a loop across industries
  for (let i = 0; i < 4; i++) { // Run 4 rounds to reach 1000+ patterns
    console.log(`\n--- Round ${i + 1} ---`);
      for (const industry of industries) {
        console.log(`Generating for ${industry} (Round ${i + 1})...`);
        const batch = await generateBatch(industry, i + 1);

      
      if (batch.length > 0) {
        // Add dummy embeddings
        const patternsToInsert = batch.map(p => ({
          ...p,
          embedding: Array(768).fill(0)
        }));

        const { error } = await supabase.from('patterns').upsert(patternsToInsert, { onConflict: 'id' });
        
        if (error) {
          console.error(`Error inserting batch for ${industry}:`, error.message);
        } else {
          totalIngested += patternsToInsert.length;
          console.log(`Successfully ingested ${patternsToInsert.length} patterns for ${industry}. Total: ${totalIngested}`);
        }
      }
      
        // Delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 10000));

    }
  }

  console.log(`\nKnowledge base expansion complete. Total new patterns: ${totalIngested}`);
}

main();
