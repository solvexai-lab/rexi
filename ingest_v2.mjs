import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

const patterns = [
  // INSURANCE PATTERNS
  {
    "name": "Force-Placed Insurance Authorization",
    "category": "other",
    "severity": "high",
    "description": "Lender reserves the right to purchase insurance on the borrower's behalf if the borrower fails to maintain required coverage, often at significantly higher premiums and with less coverage than a self-purchased policy.",
    "why_it_matters": "Lenders may use this to generate profit through commissions or higher premiums, while providing minimal protection to the borrower's equity. It can lead to a 'death spiral' of debt if the borrower cannot afford the new, higher payments.",
    "plain_english": "If you forget to pay your insurance, the bank can buy a super-expensive version for you and add it to your bill. This bank-bought insurance usually only protects them, not your belongings.",
    "how_it_should_be": "Lender should provide at least 45 days notice and multiple warnings before placing insurance, and must cancel it immediately upon proof of borrower's own coverage with a full pro-rated refund.",
    "negotiation_script": "We'd like to extend the notice period for force-placed insurance to 60 days and ensure that any policy placed is at market rates without commissions to the lender.",
    "suggested_alternative": "Lender shall provide Client with written notice at least forty-five (45) days prior to placing any insurance. Lender shall cancel any force-placed insurance within fifteen (15) days of receiving proof of Client's own coverage and provide a full pro-rated refund for the overlapping period."
  },
  {
    "name": "Post-Claim Underwriting Clause",
    "category": "warranties",
    "severity": "critical",
    "description": "Insurer reserves the right to re-evaluate the original application after a claim is filed to find errors or omissions that would justify cancelling the policy retroactively (rescission).",
    "why_it_matters": "This allows insurers to take premiums for years and then avoid paying a large claim by finding a minor, unintentional mistake in the initial paperwork. It effectively makes the coverage illusory.",
    "plain_english": "They take your money for years, but when you finally have a claim, they comb through your old application to find any tiny mistake so they can cancel your policy and not pay you.",
    "how_it_should_be": "Insurers should be barred from rescinding policies after a certain period (e.g., 2 years) except for documented intentional fraud.",
    "negotiation_script": "We need to limit the insurer's right to rescind this policy to cases of intentional fraud and establish a two-year limit on challenging the initial application.",
    "suggested_alternative": "After this policy has been in effect for two (2) years, the Insurer shall not contest the validity of the policy or rescind coverage based on statements made in the application, except in cases of documented intentional fraud."
  },
  {
    "name": "Inflexible 24-Hour Claim Reporting Window",
    "category": "other",
    "severity": "medium",
    "description": "Policy requires insured to report any incident or loss within a very short timeframe (e.g., 24-48 hours), failing which the insurer may deny the claim entirely regardless of the reason for delay.",
    "why_it_matters": "In high-stress situations (accidents, medical emergencies), reporting immediately is often impossible. This clause gives insurers a technicality to deny valid claims.",
    "plain_english": "If you don't call them within 24 hours of an accident, they can refuse to pay—even if you were in the hospital or couldn't reach a phone.",
    "how_it_should_be": "The reporting window should be 'as soon as reasonably practicable' and denial should only be allowed if the delay actually prejudiced the insurer's investigation.",
    "negotiation_script": "We'd like to change the reporting requirement to 'as soon as reasonably practicable' and ensure that claims aren't denied for late reporting unless it harms your ability to investigate.",
    "suggested_alternative": "Insured shall provide notice of any loss as soon as reasonably practicable. Failure to provide notice within a specific timeframe shall not justify denial of a claim unless the Insurer demonstrates that its interests were materially prejudiced by the delay."
  },
  {
    "name": "Anti-Concurrent Causation Clause",
    "category": "liability",
    "severity": "high",
    "description": "Excludes coverage for a loss if a non-covered event (e.g., flood) occurs at the same time as a covered event (e.g., wind), even if the covered event was the primary cause of damage.",
    "why_it_matters": "Common in hurricane zones. If wind rips your roof off but water also enters from below, the insurer may try to deny the entire claim because of the 'flood' exclusion.",
    "plain_english": "If two things happen at once—like a storm and a flood—they won't pay for either, even if the storm did most of the damage and you're covered for storms.",
    "how_it_should_be": "Coverage should apply to the portion of damage caused by the covered peril, regardless of other contributing factors.",
    "negotiation_script": "We need to remove the anti-concurrent causation language to ensure that covered perils like wind damage remain protected even if other excluded events occur simultaneously.",
    "suggested_alternative": "Where a loss is caused by a combination of a covered peril and an excluded peril, the Insurer shall remain liable for the portion of the loss attributable to the covered peril."
  },
  {
    "name": "Discretionary 'Medical Necessity' Review",
    "category": "other",
    "severity": "high",
    "description": "Insurer retains 'sole and absolute discretion' to determine if a medical procedure or treatment is 'medically necessary,' overriding the judgment of the treating physician.",
    "why_it_matters": "Allows the insurer to prioritize cost-cutting over patient health by denying doctor-recommended treatments as 'unnecessary' or 'experimental.'",
    "plain_english": "The insurance company's accountants get to decide if you really need that surgery, even if your doctor says it's life-saving.",
    "how_it_should_be": "Medical necessity should be determined by independent medical review boards based on peer-reviewed clinical standards.",
    "negotiation_script": "We want to ensure that medical necessity determinations are made based on objective clinical standards and allow for independent third-party review if there's a disagreement.",
    "suggested_alternative": "Determinations of medical necessity shall be based on objective, peer-reviewed clinical standards. In the event of a dispute, the parties shall submit the claim to an independent third-party medical review organization whose decision shall be binding."
  },

  // PERSONAL LOAN PATTERNS
  {
    "name": "Rule of 78s Prepayment Penalty",
    "category": "payment",
    "severity": "high",
    "description": "Uses a mathematical formula (Rule of 78s) to front-load interest payments, ensuring that if the loan is paid off early, the borrower receives a much smaller interest refund than with standard simple interest.",
    "why_it_matters": "Effectively penalizes borrowers for being responsible and paying off debt early. It's a hidden cost that can add hundreds or thousands to the payoff amount.",
    "plain_english": "If you try to pay your loan off early to save on interest, they use a trick formula to make sure they've already taken most of the interest anyway.",
    "how_it_should_be": "Interest should be calculated using the simple interest method on the declining principal balance.",
    "negotiation_script": "We require the loan to use simple interest rather than the Rule of 78s to ensure that early payoff results in fair interest savings.",
    "suggested_alternative": "Interest on this Loan shall be calculated using the simple interest method based on the actual daily unpaid principal balance. No 'Rule of 78s' or other front-loaded interest formulas shall be applied."
  },
  {
    "name": "Loan Packing (Involuntary Credit Insurance)",
    "category": "payment",
    "severity": "high",
    "description": "Lender automatically includes 'optional' products like credit life, disability, or unemployment insurance in the loan amount without clear disclosure or separate consent.",
    "why_it_matters": "Increases the total loan amount and interest costs for products the borrower may not need, want, or even know they have. It's a way for lenders to hide additional fees.",
    "plain_english": "They sneak extra insurance policies into your loan that you didn't ask for, which makes your monthly payment and total debt higher.",
    "how_it_should_be": "Any add-on products must be presented separately with a clear opt-in and a 30-day 'free look' cancellation period.",
    "negotiation_script": "We noticed several insurance products bundled into the loan. We'd like these removed and a clear disclosure of all optional fees provided.",
    "suggested_alternative": "All optional products, including credit insurance, must be disclosed separately from the principal loan amount. Purchase of such products is not a condition of the loan. Client retains the right to cancel any such product within thirty (30) days for a full refund."
  },
  {
    "name": "Confession of Judgment (Cognovit) Clause",
    "category": "other",
    "severity": "critical",
    "description": "Borrower waives the right to notice or a hearing and allows the lender to automatically enter a judgment against them in court if the lender claims a default occurred.",
    "why_it_matters": "The lender can seize your bank accounts or assets before you even know you're being sued. You lose your day in court and the ability to defend yourself against false claims of default.",
    "plain_english": "You're signing a paper that lets them win a lawsuit against you instantly without you even being told or allowed to tell your side to a judge.",
    "how_it_should_be": "Any judgment must follow standard legal process, including proper service of notice and a right to a hearing.",
    "negotiation_script": "We cannot accept a confession of judgment clause. We require that any dispute or claim of default follow standard judicial procedures.",
    "suggested_alternative": "[Delete the Confession of Judgment section]. Any legal action arising from this Agreement must be brought in a court of competent jurisdiction with proper notice provided to all parties in accordance with applicable rules of civil procedure."
  },
  {
    "name": "Broad Default Acceleration Clause",
    "category": "termination",
    "severity": "high",
    "description": "Allows the lender to declare the entire loan balance due immediately for minor, non-financial reasons, such as the lender 'feeling insecure' or a minor technical breach of a reporting requirement.",
    "why_it_matters": "Gives the lender too much power to force a borrower into default even if they are making all payments on time. It can be used as leverage to force unfavorable renegotiations.",
    "plain_english": "They can demand you pay back the whole loan today just because they 'feel' like you might not pay later, even if you've never missed a payment.",
    "how_it_should_be": "Acceleration should only be permitted for material breaches (e.g., non-payment) after a 15-day grace period and written notice.",
    "negotiation_script": "We'd like to limit the acceleration clause to material defaults like non-payment, and ensure we have at least 15 days to fix any issues before the full balance is called.",
    "suggested_alternative": "Lender may only accelerate the unpaid balance of the Loan in the event of a material default (defined as non-payment of principal or interest) that remains uncured for fifteen (15) days after written notice is provided to the Borrower."
  },
  {
    "name": "Cross-Collateralization Clause",
    "category": "other",
    "severity": "medium",
    "description": "Assets used to secure one loan (e.g., a car) are automatically used as collateral for all other current and future loans with the same lender.",
    "why_it_matters": "If you pay off your car loan but fall behind on a credit card from the same bank, they can still repossess your car. It makes it very difficult to fully own any one asset.",
    "plain_english": "Even if you pay off your car loan, the bank can still take your car if you miss a payment on a completely different loan or credit card you have with them.",
    "how_it_should_be": "Collateral should be tied specifically to the loan it was intended to secure.",
    "negotiation_script": "We'd like to remove the cross-collateralization provision so that each loan is secured only by its own designated collateral.",
    "suggested_alternative": "The collateral provided for this Loan shall secure only the obligations arising under this specific Agreement and shall not be used as security for any other past, present, or future indebtedness to the Lender."
  }
];

async function generateEmbeddings() {
  console.log(`Generating real embeddings for ${patterns.length} patterns...`);
  
  try {
    const results = [];
    
    for (const pattern of patterns) {
      const id = pattern.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      
      const textToEmbed = `${pattern.name}: ${pattern.description}`;
      const result = await model.embedContent(textToEmbed);
      const embedding = result.embedding.values;
      
      results.push({
        ...pattern,
        id,
        embedding
      });
      console.log(`Embedded: ${pattern.name}`);
    }

    const sqls = results.map((p) => {
      return `INSERT INTO patterns (id, name, category, severity, description, why_it_matters, plain_english, how_it_should_be, negotiation_script, suggested_alternative, embedding)
VALUES ('${p.id}', '${p.name.replace(/'/g, "''")}', '${p.category}', '${p.severity}', '${p.description.replace(/'/g, "''")}', '${p.why_it_matters.replace(/'/g, "''")}', '${p.plain_english.replace(/'/g, "''")}', '${p.how_it_should_be.replace(/'/g, "''")}', '${p.negotiation_script.replace(/'/g, "''")}', '${p.suggested_alternative.replace(/'/g, "''")}', '[${p.embedding.join(",")}]')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  severity = EXCLUDED.severity,
  description = EXCLUDED.description,
  why_it_matters = EXCLUDED.why_it_matters,
  plain_english = EXCLUDED.plain_english,
  how_it_should_be = EXCLUDED.how_it_should_be,
  negotiation_script = EXCLUDED.negotiation_script,
  suggested_alternative = EXCLUDED.suggested_alternative,
  embedding = EXCLUDED.embedding;`;
    });

    fs.writeFileSync("insert_more_patterns.sql", sqls.join("\n\n"));
    console.log("Success! SQL saved to insert_more_patterns.sql (with REAL embeddings)");
  } catch (error) {
    console.error("Error generating SQL:", error);
    process.exit(1);
  }
}

generateEmbeddings();
