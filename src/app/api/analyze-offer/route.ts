import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getClientIP,
  checkRateLimit,
  rateLimitedResponse,
  sanitizeText,
  addSecurityHeaders,
  validateRequestOrigin,
  logSecurityEvent,
} from "@/lib/security";
import type { OfferAnalysisResponse, OneTimeBenefits, EconomicAnalysis } from "@/lib/types/offer-analysis";
import {
  calculateEconomicAnalysis,
  calculateDeterministicSalaryBreakdown,
  type WorkMode,
  type RelocationType,
  type SalaryComponent,
} from "@/lib/salary-engine";

export const maxDuration = 60;
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DISCLAIMER = "This analysis is for informational purposes only and does not constitute legal or financial advice. Always consult with appropriate professionals before making career decisions.";

const MAX_TEXT_LENGTH = 150000;
const MIN_TEXT_LENGTH = 100;

export async function POST(req: NextRequest) {
  const clientIP = getClientIP(req);

  if (!validateRequestOrigin(req)) {
    logSecurityEvent("INVALID_ORIGIN", { ip: clientIP, origin: req.headers.get("origin") });
    return addSecurityHeaders(
      NextResponse.json({ error: "Invalid request origin" }, { status: 403 })
    );
  }

  const rateLimit = await checkRateLimit(clientIP);
  if (!rateLimit.allowed) {
    logSecurityEvent("RATE_LIMIT_EXCEEDED", { ip: clientIP });
    return rateLimitedResponse(rateLimit.resetIn);
  }

  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return addSecurityHeaders(
        NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
      );
    }

    const { text, fileName } = body;

    if (!text || typeof text !== "string") {
      return addSecurityHeaders(
        NextResponse.json({ error: "No text provided or invalid format" }, { status: 400 })
      );
    }

    if (text.length < MIN_TEXT_LENGTH) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Text too short for meaningful analysis" }, { status: 400 })
      );
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Text exceeds maximum allowed length" }, { status: 400 })
      );
    }

    const sanitizedText = sanitizeText(text);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 })
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 8192,
      },
    });

    const prompt = `You are REXI - an expert HR analyst and compensation specialist with 20+ years of experience analyzing Indian job offers. Your task is to extract data from an offer letter with 100% mathematical accuracy AND intelligently detect nuances, conditions, and fine print.

OFFER LETTER TEXT:
${sanitizedText}

=== NEGATIVE CONSTRAINTS (ANTI-HALLUCINATION RULES) ===
- DO NOT make up or assume Income Tax (TDS) or Professional Tax amounts. Extract ONLY if explicitly written.
- DO NOT assume Bonus amounts if not mentioned.
- DO NOT hallucinate city names. If the location is not mentioned, use "Not Disclosed".
- DO NOT assume "Take Home" or "Net Salary" if not explicitly listed in a table. The system will calculate it deterministically later.
- IF there is a CTC table, prioritize the table values over the body text.

=== INTELLIGENT DETECTION SYSTEM ===

**BONUS & VARIABLE PAY DETECTION** - Set bonusIsVariable: true if ANY of these patterns exist:
1. RANGE INDICATORS: "up to X%", "upto X%", "0-20%", "10% to 20%", "between X and Y"
2. MAXIMUM LANGUAGE: "maximum", "max", "ceiling", "cap", "not exceeding"
3. PERFORMANCE TRIGGERS: "target bonus", "at 100% achievement", "based on performance", "performance-linked", "subject to targets"
4. CONDITIONAL LANGUAGE: "subject to", "dependent on", "based on", "contingent upon", "as per", "discretionary"
5. COMPANY DISCRETION: "at company's discretion", "management discretion", "as decided by", "may include"
6. RATING BASED: "based on rating", "bell curve", "performance rating", "appraisal cycle"
7. PRORATED: "pro-rata", "prorated", "proportionate", "for the period worked"
8. MARKET/BUSINESS: "subject to business performance", "company performance", "market conditions"

**HIDDEN RISKS TO DETECT** - Create a risk entry for each:
1. CLAWBACK CLAUSES: "recovery", "clawback", "refund", "repayment if you leave within X"
2. NON-COMPETE: "cannot join competitor", "restricted from", "cooling off period"
3. NOTICE PERIOD TRAPS: "3 months notice", "90 days", notice buyout restrictions
4. BOND/SERVICE AGREEMENT: "minimum service", "bond period", "service commitment"
5. RELOCATION CLAUSES: "transfer to any location", "company may relocate"
6. IP ASSIGNMENT: "all inventions belong to", "intellectual property transfer"
7. MOONLIGHTING BAN: "no other employment", "exclusive service", "cannot freelance"
8. SALARY REVISION CAVEATS: "salary revision subject to", "increments are discretionary"
9. PROBATION TRAPS: "extended probation", "termination during probation without notice"
10. VARIABLE DEDUCTIONS: "deductions may apply", "recovery from salary"
11. ESOP FINE PRINT: "cliff period", "accelerated vesting only on acquisition", "buyback at company discretion"
12. ARBITRATION CLAUSES: "disputes settled by arbitration", "waive right to court"
13. CONFIDENTIALITY OVERREACH: "perpetual confidentiality", "even after termination"
14. TERMINATION WITHOUT CAUSE: "may terminate at will", "without assigning reason"
15. GARDEN LEAVE: "garden leave period", "relieving at company's convenience"

**BENEFITS NUANCES TO DETECT**:
1. INSURANCE LIMITATIONS: "up to X lakhs", "subject to policy terms", "pre-existing conditions excluded"
2. LEAVE ENCASHMENT: "leave cannot be encashed", "use it or lose it", "maximum carry forward"
3. GRATUITY CONDITIONS: "after 5 years", "forfeited if terminated"
4. PF OPT-OUT: "can opt out of PF", "PF on basic only"
5. FLEXIBLE BENEFITS: "flexi basket", "choose your benefits", "reimbursement basis"

**LEAVE POLICY EXTRACTION** - Extract ALL leave types mentioned:
1. TOTAL ANNUAL LEAVE: Sum of all paid leaves (CL + SL + EL/PL)
2. CASUAL LEAVE (CL): Usually 6-12 days per year
3. SICK LEAVE (SL): Medical leave, usually 6-12 days
4. EARNED/PRIVILEGE LEAVE (EL/PL): Accrued leave, usually 15-21 days
5. MATERNITY LEAVE: Usually 26 weeks (as per law)
6. PATERNITY LEAVE: Varies 5-15 days
7. BEREAVEMENT LEAVE: Death in family, usually 3-5 days
8. MARRIAGE LEAVE: Usually 3-5 days
9. COMP-OFF: Compensatory off for extra work
10. WFH DAYS: Work from home allowance per month
11. CARRY FORWARD: How many days can be carried to next year
12. ENCASHMENT: Can unused leave be converted to cash?
13. PROBATION RESTRICTION: "no leave during probation", "prorated leave"
14. PUBLIC HOLIDAYS: Number of public/national holidays
15. FLOATER HOLIDAYS: Flexible holidays to choose
16. SABBATICAL: Long leave policy after X years
17. UNLIMITED PTO: "unlimited leave", "flexible time off"

**ONE-TIME vs RECURRING** - Clearly distinguish:
1. JOINING BONUS: One-time, usually has clawback
2. RELOCATION: One-time assistance
3. RETENTION BONUS: One-time, milestone-based
4. ANNUAL BONUS: Recurring but variable
5. ESOP: Vests over time, not immediate cash

=== VERIFICATION PROCESS (Chain of Verification) ===
1. Read the ENTIRE document first, including annexures and fine print
2. Identify compensation components - separate FIXED from VARIABLE from ONE-TIME
3. For each bonus/variable component, check for conditional language
4. Look for the word "up to", "upto", "maximum" - if found, bonusIsVariable = true
5. Check clawback periods for all one-time payments
6. Verify math: Fixed + Variable (at 100%) + Benefits should equal Total CTC
7. Flag any clause that could negatively impact the candidate

CRITICAL ONE-TIME BENEFITS EXTRACTION:
Look for these components and extract them accurately:
1. JOINING BONUS / SIGN-ON BONUS: One-time payment upon joining
2. CLAWBACK PERIOD: How many months before bonus is fully vested (usually 12-24 months)
3. RELOCATION ALLOWANCE: Support for moving to job location (lump_sum, reimbursement, or arranged)
4. NOTICE PERIOD BUYOUT: Amount to buy out current notice period
5. ESOP/RSU GRANTS: Stock options with vesting schedule and cliff period

CITY AND WORK MODE EXTRACTION:
- Extract the exact city name (Bengaluru, Mumbai, Pune, Hyderabad, Chennai, Delhi, Gurugram, Noida, etc.)
- Identify work mode: "Office 5-day", "Hybrid 3-day", "Hybrid 2-day", or "Full Remote"

Return this exact JSON structure:
{
  "offer": {
    "company": "Company Name",
    "role": "Job Title",
    "baseSalary": 0,
    "currency": "INR or USD",
    "bonus": 0,
    "bonusPercentage": 0,
    "bonusType": "annual/performance/retention/etc",
    "bonusIsVariable": true,
    "bonusCondition": "up to 20% based on performance rating",
    "equity": { 
      "type": "RSU/ESOP/etc", 
      "amount": 0, 
      "vestingSchedule": "4 years with 25% annual", 
      "cliffPeriod": "1 year",
      "exerciseWindow": "90 days post termination",
      "buybackTerms": "at company discretion"
    },
    "benefits": ["benefit1", "benefit2"],
    "pto": "X days",
    "ptoCarryForward": "max 10 days",
    "leavePolicy": {
      "totalAnnualLeave": 24,
      "casualLeave": 12,
      "sickLeave": 6,
      "earnedLeave": 15,
      "privilegedLeave": 0,
      "maternityLeave": "26 weeks",
      "paternityLeave": "5 days",
      "bereavementLeave": "3 days",
      "marriageLeave": "5 days",
      "compOff": "As per manager approval",
      "wfhDays": 0,
      "carryForwardLimit": 10,
      "carryForwardPolicy": "Max 10 days to next year",
      "encashmentAllowed": true,
      "encashmentCondition": "At separation or year-end",
      "probationLeaveRestriction": "Prorated during probation",
      "publicHolidays": 12,
      "floaterHolidays": 2,
      "sabbatical": "Not mentioned",
      "unlimitedPTO": false
    },
    "startDate": "date",
    "location": "city name only",
    "workMode": "Office 5-day/Hybrid 3-day/Hybrid 2-day/Full Remote",
    "noticePeriod": "X days/months",
    "noticeBuyoutAllowed": true,
    "nonCompete": { 
      "duration": "X months", 
      "scope": "description", 
      "concerns": ["concern1"],
      "enforceability": "likely unenforceable in India"
    },
    "signingBonus": 0,
    "relocation": "details",
    "probationPeriod": "X months",
    "probationNoticePeriod": "7 days during probation",
    "bondPeriod": "24 months",
    "bondAmount": 200000,
    "salaryBreakdown": {
      "components": [
        { "name": "Basic Salary", "annual": 0, "monthly": 0, "type": "fixed", "isNegotiable": false, "description": "Core component" },
        { "name": "PF (Employer Contribution)", "annual": 0, "monthly": 0, "type": "deduction", "isNegotiable": false }
      ],
      "totalCTC": 0,
      "monthlyTakeHome": 0,
      "annualTakeHome": 0,
      "taxDeductions": 0,
      "complianceInfo": {
        "pfEnabled": true,
        "gratuityEnabled": true,
        "professionalTax": 200,
        "esiEnabled": false
      }
    }
  },
  "oneTimeBenefits": {
    "joiningBonus": 0,
    "joiningBonusClawbackMonths": 12,
    "relocationAllowance": 0,
    "relocationType": "lump_sum/reimbursement/arranged/none",
    "noticeBuyout": 0,
    "esopGrant": { "value": 0, "vestingSchedule": "4 years", "cliffMonths": 12 }
  },
  "risks": [
    { 
      "category": "compensation/legal/operational/career", 
      "severity": "critical/high/medium/low", 
      "title": "Risk Title", 
      "description": "Clear explanation of the risk and its impact on the candidate", 
      "clause": "Exact clause text from document if found", 
      "suggestion": "What to do about it", 
      "negotiationTip": "Specific language to use when negotiating" 
    }
  ],
  "overallScore": 0,
  "summary": "Brief summary highlighting key points - both positive and concerning",
  "strengths": ["strength1"],
  "concerns": ["concern1"],
  "negotiationPoints": ["point1"],
  "marketComparison": { 
    "salaryPercentile": "75th", 
    "overallCompetitiveness": "Summary of how this offer compares to market",
    "benchmarks": {
      "role": "Role",
      "location": "City",
      "percentile25": 1200000,
      "percentile50": 1800000,
      "percentile75": 2500000,
      "confidence": "High/Medium/Low",
      "reasoning": "Explanation of benchmark data sources and confidence.",
      "currency": "INR"
    }
  }
}


  CRITICAL INSTRUCTIONS:
  1. Extract ALL salary components from the CTC breakdown table if present.
  2. MATHEMATICAL ACCURACY: For bonuses, if the text says "20%", set bonusPercentage to 20 and bonus to (0.2 * Base Salary).
  3. If the document is in INR, use Lakhs/Crores if appropriate in text descriptions but raw numbers in JSON.
  4. Calculate monthlyTakeHome by subtracting PF, PT, and estimated Tax from monthly Gross.
  5. ALWAYS extract one-time benefits even if they are 0 - this is critical for Year 1 vs Year 2 analysis.
  6. If joining bonus has a clawback clause, extract the exact clawback period in months.
7. Extract the EXACT city name for location - not country, just city.
8. ESTIMATE MARKET BENCHMARKS: Based on the extracted Role, Company Stage, and Location, provide a realistic salary range (P25, P50, P75). 
STABILITY RULE: Benchmarks MUST be based on the Role and Location. For a Senior Software Engineer in Bengaluru, P50 should be around 25-30L. For a Junior in Pune, 6-10L. 
Ensure P25 < P50 < P75 and they are realistic for the Indian market.
9. CALCULATE overallScore (0-100) dynamically based on:

   - Compensation competitiveness (30%): Higher CTC = higher score
   - Benefits quality (20%): Health insurance, PTO, bonuses
   - Risk level (25%): Low risks = higher score, critical risks = lower score
   - Work-life balance (15%): Flexible work mode, reasonable notice period
   - Growth potential (10%): Equity, career trajectory
   DO NOT default to 75. Calculate a unique score for EACH offer.
9. RETURN ONLY VALID JSON. NO MARKDOWN. NO PREAMBLE. NO POSTAMBLE.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text().trim();

    if (responseText.startsWith("```json")) {
      responseText = responseText.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Initial JSON parse failed, attempting repair. First 500 chars:", responseText.substring(0, 500));

      let repairedText = responseText;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        repairedText = jsonMatch[0];
      }

      try {
        parsedResponse = JSON.parse(repairedText);
      } catch {
        const openBraces = (repairedText.match(/\{/g) || []).length;
        const closeBraces = (repairedText.match(/\}/g) || []).length;
        const openBrackets = (repairedText.match(/\[/g) || []).length;
        const closeBrackets = (repairedText.match(/\]/g) || []).length;

        for (let i = 0; i < openBrackets - closeBrackets; i++) repairedText += "]";
        for (let i = 0; i < openBraces - closeBraces; i++) repairedText += "}";

        try {
          parsedResponse = JSON.parse(repairedText);
        } catch (finalError) {
          console.error("All JSON parse attempts failed. Raw text length:", responseText.length);
          console.error("Raw text (first 2000 chars):", responseText.substring(0, 2000));
          return addSecurityHeaders(
            NextResponse.json({ error: "AI returned invalid response format. Please try uploading again." }, { status: 500 })
          );
        }
      }
    }

    const risksWithIds = (parsedResponse.risks || []).map((risk: any, index: number) => ({
      ...risk,
      id: risk.id || `risk-${Date.now()}-${index}`,
    }));

    const extractedOneTimeBenefits = parsedResponse.oneTimeBenefits || {};
    const oneTimeBenefits: OneTimeBenefits = {
      joiningBonus: extractedOneTimeBenefits.joiningBonus || parsedResponse.offer?.signingBonus || 0,
      joiningBonusClawbackMonths: extractedOneTimeBenefits.joiningBonusClawbackMonths || 12,
      relocationAllowance: extractedOneTimeBenefits.relocationAllowance || 0,
      relocationType: (extractedOneTimeBenefits.relocationType as RelocationType) || "none",
      noticeBuyout: extractedOneTimeBenefits.noticeBuyout || 0,
      esopGrant: extractedOneTimeBenefits.esopGrant || undefined,
      retentionBonus: extractedOneTimeBenefits.retentionBonus || 0,
      performanceBonusGuarantee: extractedOneTimeBenefits.performanceBonusGuarantee || 0,
    };

    const annualCTC = parsedResponse.offer?.salaryBreakdown?.totalCTC || parsedResponse.offer?.baseSalary || 0;
    const currency = parsedResponse.offer?.currency || "INR";
    const city = parsedResponse.offer?.location || "Bengaluru";

    const aiComponents: SalaryComponent[] = (parsedResponse.offer?.salaryBreakdown?.components || []).map((c: any) => ({
      name: c.name || "Unknown",
      annual: c.annual || 0,
      monthly: c.monthly || 0,
      type: c.type || "fixed",
      isNegotiable: c.isNegotiable || false,
      description: c.description,
    }));

    const deterministicBreakdown = calculateDeterministicSalaryBreakdown(aiComponents, annualCTC, currency);

    const monthlyInHand = deterministicBreakdown.monthlyTakeHome;

    let workMode: WorkMode = "Office 5-day";
    const rawWorkMode = parsedResponse.offer?.workMode?.toLowerCase() || "";
    if (rawWorkMode.includes("remote") || rawWorkMode === "full remote") {
      workMode = "Full Remote";
    } else if (rawWorkMode.includes("hybrid")) {
      if (rawWorkMode.includes("2") || rawWorkMode.includes("two")) {
        workMode = "Hybrid 2-day";
      } else {
        workMode = "Hybrid 3-day";
      }
    }

    let economicAnalysis: EconomicAnalysis | undefined;
    if (annualCTC > 0 && city) {
      const economicResult = calculateEconomicAnalysis(
        annualCTC,
        monthlyInHand,
        city,
        workMode,
        false,
        {
          joiningBonus: oneTimeBenefits.joiningBonus,
          joiningBonusClawbackMonths: oneTimeBenefits.joiningBonusClawbackMonths,
          relocationAllowance: oneTimeBenefits.relocationAllowance,
          relocationType: oneTimeBenefits.relocationType,
          noticeBuyout: oneTimeBenefits.noticeBuyout,
          esopGrant: oneTimeBenefits.esopGrant,
        }
      );

      economicAnalysis = {
        cityEconomics: economicResult.cityEconomics,
        livabilityIndex: economicResult.livabilityIndex,
        livabilityGrade: economicResult.livabilityGrade,
        analysisMode: economicResult.analysisMode,
        year1EffectiveCTC: economicResult.year1EffectiveCTC,
        year1MonthlyEffective: economicResult.year1MonthlyEffective,
        year2SteadyCTC: economicResult.year2SteadyCTC,
        year2MonthlyEffective: economicResult.year2MonthlyEffective,
        monthlySavingsYear1: economicResult.monthlySavingsYear1,
        monthlySavingsYear2: economicResult.monthlySavingsYear2,
        savingsRateYear1: economicResult.savingsRateYear1,
        savingsRateYear2: economicResult.savingsRateYear2,
        clawbackRisk: economicResult.clawbackRisk,
        netRelocationValue: economicResult.netRelocationValue,
        esopYear1Value: economicResult.esopYear1Value,
      };
    }

    let calculatedScore = parsedResponse.overallScore || 0;
    if (calculatedScore === 0 || calculatedScore === 75) {
      let score = 50;

      if (annualCTC >= 3000000) score += 15;
      else if (annualCTC >= 1500000) score += 10;
      else if (annualCTC >= 800000) score += 5;

      if (oneTimeBenefits.joiningBonus > 0) score += 5;
      if (oneTimeBenefits.relocationAllowance > 0) score += 3;
      if (parsedResponse.offer?.equity?.amount > 0) score += 5;

      const benefits = parsedResponse.offer?.benefits || [];
      if (benefits.length >= 5) score += 8;
      else if (benefits.length >= 3) score += 5;

      const risks = parsedResponse.risks || [];
      const criticalRisks = risks.filter((r: any) => r.severity === 'critical').length;
      const highRisks = risks.filter((r: any) => r.severity === 'high').length;
      score -= (criticalRisks * 10) + (highRisks * 5);

      if (economicAnalysis) {
        if (economicAnalysis.livabilityIndex >= 2.5) score += 8;
        else if (economicAnalysis.livabilityIndex >= 2.0) score += 5;
        else if (economicAnalysis.livabilityIndex < 1.5) score -= 5;
      }

      if (rawWorkMode.includes("remote")) score += 3;
      else if (rawWorkMode.includes("hybrid")) score += 2;

      calculatedScore = Math.max(20, Math.min(95, score));
    }

    const finalResponse: OfferAnalysisResponse = {
      offer: {
        ...parsedResponse.offer,
        id: parsedResponse.offer?.id || `offer-${Date.now()}`,
        rawText: sanitizedText,
        fileName: fileName || "Uploaded Document",
        oneTimeBenefits,
        economicAnalysis,
        salaryBreakdown: {
          components: deterministicBreakdown.components,
          totalCTC: deterministicBreakdown.totalCTC,
          monthlyTakeHome: deterministicBreakdown.monthlyTakeHome,
          annualTakeHome: deterministicBreakdown.annualTakeHome,
          taxDeductions: deterministicBreakdown.taxDeductions,
          complianceInfo: deterministicBreakdown.complianceInfo,
        },
      },
      risks: risksWithIds,
      overallScore: calculatedScore,
      summary: parsedResponse.summary || "Analysis complete.",
      strengths: parsedResponse.strengths || [],
      concerns: parsedResponse.concerns || [],
      negotiationPoints: parsedResponse.negotiationPoints || [],
      marketComparison: parsedResponse.marketComparison,
      metadata: {
        analysisDate: new Date().toISOString(),
        disclaimer: DISCLAIMER,
      },
    };

    return addSecurityHeaders(NextResponse.json(finalResponse));
  } catch (error) {
    console.error("Offer analysis error:", error);
    return addSecurityHeaders(
      NextResponse.json(
        { error: "Failed to analyze offer letter. Please try again." },
        { status: 500 }
      )
    );
  }
}
