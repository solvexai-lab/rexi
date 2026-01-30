# REXI - Usage Guide

## Table of Contents
- [Getting Started](#getting-started)
- [Document Analysis](#document-analysis)
- [Employment Offer Analysis](#employment-offer-analysis)
- [Comparing Multiple Offers](#comparing-multiple-offers)
- [Understanding Results](#understanding-results)
- [Supported Document Types](#supported-document-types)
- [Best Practices](#best-practices)
- [Limitations & Disclaimers](#limitations--disclaimers)
- [Troubleshooting](#troubleshooting)
- [API Usage](#api-usage)

---

## Getting Started

### Accessing REXI

1. **Navigate to**: [https://rexilegal.com](https://rexilegal.com)
2. **Choose your analysis type**:
   - **Documents** - For general contracts (rental, service agreements, NDAs, insurance)
   - **Offer Letters** - For employment offer letters with salary breakdown

### Quick Start (3 Steps)

```
1. Upload → Choose your document (PDF, DOCX, or TXT)
2. Analyze → Wait 15-30 seconds for AI processing
3. Review → Get plain-English insights with risk ratings
```

---

## Document Analysis

### Supported File Formats

| Format | Max Size | Notes |
|--------|----------|-------|
| PDF | 10 MB | Best results with text-based PDFs |
| DOCX | 10 MB | Microsoft Word documents |
| DOC | 10 MB | Older Word format |
| TXT | 10 MB | Plain text files |

### How to Analyze a Document

#### Method 1: Drag & Drop
1. Go to `/analyze` page
2. Drag your document file into the upload area
3. Wait for automatic processing

#### Method 2: File Browser
1. Click "Upload Document" button
2. Select file from your device
3. Confirm upload

#### Method 3: Text Input (Coming Soon)
- Paste document text directly
- Useful for copied content or short agreements

### What You'll Get

After analysis (typically 15-30 seconds), you'll receive:

#### 1. **Overall Risk Score**
- **Low** (Green) - Safe to proceed with normal review
- **Medium** (Yellow) - Review carefully, some concerns noted
- **High** (Orange) - Significant concerns, seek legal advice
- **Critical** (Red) - Major risks detected, professional review strongly recommended

#### 2. **Clause-by-Clause Breakdown**
Each flagged clause includes:
- **Severity**: Critical, High, Medium, or Low
- **Clause Text**: Exact snippet from your document
- **Plain English Explanation**: What it means in everyday language
- **Concern**: Why this matters to you
- **Suggestion**: What you can do about it

#### 3. **Legal Pattern Matching**
- Cross-referenced against 1000+ known legal patterns
- Identifies common predatory clauses
- Flags unusual or one-sided terms

#### 4. **Indian Law Compliance** (for Indian users)
- Checks against Central and State laws
- Flags potential legal violations
- References relevant legal provisions

### Document Analysis Example

**Input**: Rental Agreement PDF

**Output Includes**:
```
✓ Security Deposit Analysis
  → "Rs. 5,00,000 security deposit is 5x monthly rent"
  → Concern: Unusually high, standard is 2-3 months
  → Severity: Medium

⚠ Termination Clause
  → "Landlord can terminate with 7 days notice"
  → Concern: One-sided; tenant gets 60 days notice requirement
  → Severity: High

⚠ Maintenance Responsibility
  → "Tenant responsible for structural repairs"
  → Concern: Typically landlord's responsibility per Rent Control Acts
  → Severity: High
```

---

## Employment Offer Analysis

### Specialized Features for Offer Letters

The `/offers` page provides deep employment-specific analysis:

### 1. **Comprehensive Salary Breakdown**

#### What's Analyzed:
- **Base Salary** (Annual CTC)
- **Variable Pay** (Performance bonuses)
- **Joining Bonus** (One-time)
- **Relocation Allowance**
- **ESOPs/Stock Options**
- **Annual Bonus Structure**
- **PF Contributions** (Employee + Employer)

#### Tax Calculation:
- **Old Tax Regime** (with deductions)
- **New Tax Regime** (lower rates, no deductions)
- Automatic recommendation based on your profile
- Professional Tax included
- Take-home salary (monthly)

### 2. **Economic Analysis**

#### Livability Index
```
Formula: (Monthly Take-Home) / (Estimated Living Cost in Your City)

Interpretation:
- 2.5x+ : Comfortable savings potential
- 1.5-2.5x : Manageable but limited savings
- <1.5x : May struggle to save
```

#### City Clusters:
- **Metro** (Mumbai, Delhi, Bangalore): Higher cost baseline
- **Tier-1** (Pune, Hyderabad, Chennai): Moderate costs
- **Tier-2** (Jaipur, Indore, Chandigarh): Lower costs

### 3. **Risk Detection**

#### Clawback Risk
Identifies if you must return money when leaving early:
```
Example:
- Joining Bonus: ₹2,00,000
- Clawback Period: 24 months
- Risk Level: High (if >15% of Year 1 CTC)
```

#### Notice Period Analysis
```
Standard: 30-90 days
Concerning: 120+ days or buyout >3 months salary
```

#### Non-Compete Clauses
- Geographic scope
- Duration (6-24 months typical)
- Industry restrictions

#### Probation Terms
```
Standard: 3-6 months
Concerning: 9-12 months with full notice during probation
```

### 4. **Market Comparison**

- **Salary Percentile**: Where you stand vs peers
- **Industry Benchmarks**: Based on role and location
- **Growth Trajectory**: Year-over-year earning potential

### 5. **Benefits Scorecard**

Evaluates quality of:
- Health insurance (coverage amount)
- Leave policy (earned, sick, casual)
- Work-from-home flexibility
- Learning & Development budget
- Retirement benefits (beyond PF)

### Offer Analysis Example

**Input**: Employment Offer Letter (Software Engineer, Bangalore)

**Output Dashboard**:

```
┌─────────────────────────────────────────┐
│        SALARY BREAKDOWN                 │
├─────────────────────────────────────────┤
│ Annual CTC:          ₹18,00,000         │
│ Year 1 Effective:    ₹20,50,000         │
│   (includes joining bonus & relocation) │
│ Year 2+ CTC:         ₹18,00,000         │
├─────────────────────────────────────────┤
│ Monthly Take-Home:   ₹96,250            │
│ (after all deductions)                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│        ECONOMIC ANALYSIS                │
├─────────────────────────────────────────┤
│ Livability Index:    2.4x (Good)        │
│ Bangalore Living:    ₹40,000/month      │
│ Savings Potential:   ₹56,250 (58%)     │
│ Salary Percentile:   68th               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│        RISK ALERTS                      │
├─────────────────────────────────────────┤
│ ⚠ Clawback Risk: MEDIUM                 │
│   → ₹2,50,000 locked for 18 months      │
│                                          │
│ ⚠ Notice Period: HIGH                   │
│   → 90 days (industry standard)         │
│   → Buyout clause: 3 months gross       │
│                                          │
│ ✓ Probation: STANDARD                   │
│   → 6 months with 30-day notice         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│        RECOMMENDATIONS                  │
├─────────────────────────────────────────┤
│ ✓ Salary is competitive for Bangalore  │
│ ⚠ Consider negotiating clawback terms  │
│ ⚠ Verify ESOP vesting schedule clarity │
│ ✓ Tax: New Regime saves ₹12K annually  │
└─────────────────────────────────────────┘
```

---

## Comparing Multiple Offers

### How to Compare Offers

1. **Navigate** to `/offers`
2. **Upload first offer** → Get individual analysis
3. **Click "Compare with another offer"**
4. **Upload second offer** (up to 3 total)
5. **View side-by-side comparison**

### Comparison Metrics

#### Financial Comparison
```
┌──────────────┬─────────────┬─────────────┬─────────────┐
│              │  Offer A    │  Offer B    │  Offer C    │
├──────────────┼─────────────┼─────────────┼─────────────┤
│ Year 1 CTC   │ ₹18.0 L     │ ₹20.0 L     │ ₹17.0 L     │
│ Take-Home    │ ₹96,250     │ ₹1,05,000   │ ₹92,000     │
│ Livability   │ 2.4x        │ 2.6x        │ 2.3x        │
│ Clawback     │ ₹2.5 L      │ ₹0          │ ₹3.0 L      │
└──────────────┴─────────────┴─────────────┴─────────────┘
```

#### Risk Comparison
- Color-coded severity (Green → Red)
- Key risk factors highlighted
- Weighted risk score (0-100)

#### Overall Recommendation
```
Best Offer: Offer B
Reasoning:
  - Highest take-home salary
  - No clawback risk
  - Better work-life balance terms
  - Standard notice period

Consider: Offer A
  - If company culture/growth matters more
  - Slightly lower take-home but better benefits

Avoid: Offer C
  - Highest clawback risk (₹3L locked 24 months)
  - Below-market health insurance
```

---

## Understanding Results

### Severity Levels Explained

#### 🔴 Critical
- Potential legal violations
- Extremely one-sided terms
- Could result in significant financial loss
- **Action**: Do not sign without legal counsel

#### 🟠 High
- Unfavorable terms compared to industry standards
- Risk of financial or professional impact
- **Action**: Negotiate or seek clarification

#### 🟡 Medium
- Worth noting but not necessarily deal-breakers
- Slightly unusual or restrictive
- **Action**: Review carefully, consider negotiating

#### 🟢 Low
- Minor concerns or informational
- Standard clauses with minor variations
- **Action**: Acknowledge and proceed if acceptable

### Key Metrics Glossary

#### Financial Terms

**CTC (Cost to Company)**
- Total cost employer pays (includes your PF, benefits, bonuses)
- NOT the same as take-home salary

**Take-Home Salary**
- Actual amount in your bank account monthly
- CTC minus (Income Tax + PF + Prof Tax + other deductions)

**Fixed Pay vs Variable Pay**
- Fixed: Guaranteed monthly salary
- Variable: Performance-linked bonuses (may not be guaranteed)

**Clawback**
- Money you must return if you leave before a certain period
- Usually applies to signing bonuses and relocation

#### Living Cost Metrics

**Livability Index**
```
Your Take-Home ÷ Basic Living Cost

Basic Living = Rent + Food + Transport + Utilities
(Does NOT include luxuries, entertainment, or advanced savings)
```

**Savings Rate**
```
(Take-Home - Estimated Expenses) ÷ Take-Home × 100
```

#### Risk Metrics

**Notice Period Severity**
- 30 days: Standard
- 60 days: Common in senior roles
- 90 days: IT industry standard
- 120+ days: Concerning, limits job mobility

**Non-Compete Risk**
- Duration: Longer = Higher risk
- Geography: Wider = Higher risk
- Industry: Broader = Higher risk

---

## Supported Document Types

### Currently Supported

| Document Type | Examples | Key Analysis Features |
|---------------|----------|----------------------|
| **Employment Offers** | Offer letters, appointment letters | Salary breakdown, tax calc, risk detection |
| **Rental Agreements** | Residential leases, rent agreements | Deposit analysis, termination clauses, maintenance |
| **Service Agreements** | Freelance contracts, consulting | Payment terms, IP rights, liability |
| **NDAs** | Confidentiality agreements | Scope, duration, penalties |
| **Insurance Policies** | Life, health, property | Coverage gaps, exclusions, premium analysis |
| **General Contracts** | Business agreements, MOUs | Obligation balance, termination, liability |

### Coming Soon
- Loan Agreements (Home, Personal, Vehicle)
- Partnership Deeds
- Franchise Agreements
- Software Licenses (SaaS)
- Real Estate Sale Deeds

---

## Best Practices

### Before Uploading

1. **Ensure Document Quality**
   - Use text-based PDFs (not scanned images)
   - DOCX files should be properly formatted
   - Remove password protection

2. **Review Privacy**
   - Remove personal information you don't want processed (optional)
   - REXI processes documents securely but doesn't store content permanently

3. **Prepare Questions**
   - Note specific clauses you're concerned about
   - Have industry standards in mind for comparison

### During Analysis

1. **Wait for Complete Results**
   - Analysis takes 15-30 seconds
   - Don't refresh the page

2. **Read All Findings**
   - Even "Low" severity items may be important to you
   - Context matters - a clause may be acceptable in some situations

3. **Use Interactive Features**
   - Click on clauses to see full context
   - Hover over info icons (ⓘ) for detailed explanations
   - Toggle severity filters to focus on high-priority items

### After Analysis

1. **Download or Save Results**
   - Take screenshots of key findings
   - Export to PDF (if available)
   - Note the analysis ID for future reference

2. **Cross-Verify Critical Findings**
   - REXI is a helpful tool, not a replacement for legal advice
   - For critical contracts, consult a lawyer

3. **Negotiate Based on Insights**
   - Use findings as negotiation leverage
   - Ask for clarification on flagged clauses
   - Request modifications to high-risk terms

### For Offer Letters Specifically

1. **Compare Multiple Offers**
   - Don't analyze in isolation
   - Use the comparison feature for 2-3 offers

2. **Factor in Non-Monetary Aspects**
   - Company culture and growth
   - Learning opportunities
   - Work-life balance
   - Team and manager quality

3. **Verify Tax Calculations**
   - Results are estimates based on standard deductions
   - Consult a CA for precise tax planning
   - Consider long-term implications (HRA, 80C limits)

4. **Understand City Economics**
   - Living cost estimates are averages
   - Your lifestyle may differ significantly
   - Factor in dependents and debt obligations

---

## Limitations & Disclaimers

### What REXI Can Do

✅ Identify potentially problematic clauses
✅ Explain legal terms in plain English
✅ Calculate tax and take-home salary estimates
✅ Compare documents side-by-side
✅ Flag unusual or one-sided terms
✅ Cross-reference with Indian laws and patterns

### What REXI Cannot Do

❌ **Provide Legal Advice**: REXI is informational only
❌ **Guarantee Accuracy**: AI analysis may miss context
❌ **Replace Lawyers**: Complex matters need professional review
❌ **Predict Future Changes**: Laws and regulations evolve
❌ **Account for Verbal Agreements**: Only analyzes written documents
❌ **Handle Scanned Images**: Requires text-based documents

### Important Disclaimers

> **This is not legal advice** - Think of REXI as a helpful friend pointing out things you might want to look at. For important contracts, always have a real lawyer review them.

**Privacy Note**:
- Document text is sent to Google Gemini AI and Mistral AI for processing
- No documents are stored permanently by REXI
- See [Privacy Policy](/privacy) for details

**Accuracy**:
- Analysis is based on AI interpretation and may not be 100% accurate
- Legal patterns database is continuously updated but may not cover all scenarios
- Indian law references are informational; consult a lawyer for legal compliance

**Tax Calculations**:
- Based on standard deductions and current tax slabs (FY 2025-26)
- Does not account for all possible deductions (HRA, 80C, etc.)
- Consult a Chartered Accountant for personalized tax planning

---

## Troubleshooting

### Common Issues

#### "File Upload Failed"
**Causes**:
- File size exceeds 10 MB
- Unsupported file format
- Corrupted or password-protected file

**Solutions**:
- Compress PDF using online tools
- Convert to DOCX or TXT
- Remove password protection
- Try a different browser

#### "Could Not Extract Text"
**Causes**:
- Scanned PDF without OCR
- Image-based document
- Corrupted file encoding

**Solutions**:
- Use OCR software to convert to text-based PDF
- Copy-paste text into a .txt file
- Try re-saving document from original application

#### "Analysis Taking Too Long"
**Causes**:
- Large document (50+ pages)
- Server high load
- Network issues

**Solutions**:
- Wait up to 60 seconds (max timeout)
- Refresh and try again
- Try during off-peak hours
- Split large documents

#### "Rate Limit Exceeded"
**Causes**:
- Uploaded more than 20 documents in 1 minute

**Solutions**:
- Wait 1 minute before retrying
- Use a different device/network if urgent

#### "Low Confidence Results"
**Causes**:
- Unclear or ambiguous document language
- Non-standard contract format
- Mixed languages

**Solutions**:
- Review flagged clauses manually
- Cross-verify with other tools
- Seek professional legal review

### Error Messages Explained

| Error | Meaning | Solution |
|-------|---------|----------|
| `Invalid JSON body` | Corrupted request | Refresh page and retry |
| `Text too short` | Less than 50 characters | Upload complete document |
| `Text exceeds maximum` | Over 100,000 characters | Split into smaller sections |
| `Service temporarily unavailable` | API key issue or server down | Try again in a few minutes |
| `Invalid request origin` | Security check failed | Ensure using official REXI website |

---

## API Usage

### For Developers

REXI provides REST APIs for programmatic document analysis.

### Base URL
```
https://rexilegal.com/api
```

### Authentication
Currently open (rate-limited by IP). API keys coming soon for higher limits.

### Endpoints

#### 1. Analyze General Document
```bash
POST /api/analyze
Content-Type: application/json

{
  "text": "Your document text here..."
}

Response:
{
  "clauses": [...],
  "risks": [...],
  "overallScore": "medium",
  "disclaimer": "..."
}
```

#### 2. Analyze Contract
```bash
POST /api/analyze-contract
Content-Type: application/json

{
  "text": "Contract text...",
  "fileName": "agreement.pdf"
}

Response:
{
  "clauses": [...],
  "indianLawMatches": [...],
  "patternMatches": [...],
  "overallRisk": "high"
}
```

#### 3. Analyze Employment Offer
```bash
POST /api/analyze-offer
Content-Type: application/json

{
  "text": "Offer letter text...",
  "fileName": "offer.pdf"
}

Response:
{
  "salary": { ... },
  "risks": [...],
  "economicAnalysis": { ... },
  "taxCalculation": { ... }
}
```

#### 4. Compare Offers
```bash
POST /api/compare-offers
Content-Type: application/json

{
  "offers": [
    { "text": "Offer 1 text...", "fileName": "offer1.pdf" },
    { "text": "Offer 2 text...", "fileName": "offer2.pdf" }
  ]
}

Response:
{
  "comparison": { ... },
  "recommendation": "..."
}
```

#### 5. Parse File
```bash
POST /api/parse-file
Content-Type: multipart/form-data

FormData: { file: <File> }

Response:
{
  "text": "Extracted text...",
  "pageCount": 5
}
```

#### 6. Parse PDF (Mistral OCR)
```bash
POST /api/parse-pdf
Content-Type: multipart/form-data

FormData: { file: <PDF File> }

Response:
{
  "text": "OCR extracted text...",
  "markdown": "# Page 1\n..."
}
```

### Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| All endpoints | 20 requests | 60 seconds |

**Headers Returned**:
```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
Retry-After: 45 (if exceeded)
```

### Error Responses

```json
{
  "error": "Error message description",
  "status": 400
}
```

**Common Status Codes**:
- `400` - Bad request (invalid input)
- `403` - Forbidden (origin/security check failed)
- `429` - Rate limit exceeded
- `503` - Service unavailable (API key not configured)

### Example: Node.js Integration

```javascript
const analyzeContract = async (text) => {
  const response = await fetch('https://rexilegal.com/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return await response.json();
};

// Usage
const result = await analyzeContract(documentText);
console.log('Risk Score:', result.overallScore);
console.log('Clauses Found:', result.clauses.length);
```

---

## Advanced Features

### 1. Detailed Field Extraction

For employment offers, REXI extracts 20+ fields:
- Base salary, variable pay, bonuses
- Notice period, probation
- PF, gratuity, insurance
- Stock options (ESOPs)
- Clawback terms
- Non-compete duration

### 2. Stage-by-Stage Analysis

Behind the scenes, REXI uses a 4-stage pipeline:
1. **Router**: Classifies document type
2. **Extractor**: Pulls structured data
3. **Engine**: Applies deterministic rules
4. **Voice**: Generates plain English

### 3. Vector Search

- 1000+ legal patterns stored as embeddings
- Semantic matching (not just keyword)
- Finds similar clauses across 10,000+ documents

### 4. Indian Law Compliance

Database of:
- Central Acts (ICA, ICA 2013, Consumer Protection)
- State laws (Rent Control Acts, Shops & Establishments)
- Municipal regulations
- Recent amendments and judgments

---

## Tips for Best Results

### Document Preparation

✅ **DO**:
- Use original PDFs from sender
- Keep formatting intact
- Include all pages (including annexures)
- Use latest version of document

❌ **DON'T**:
- Screenshot and convert to PDF
- Use scanned copies without OCR
- Remove signatures/headers (they provide context)
- Split multi-part agreements

### Interpreting Results

**Context Matters**:
- A "high" risk clause may be standard in your industry
- Consider your negotiating leverage
- Factor in company reputation and track record

**Prioritize**:
1. Critical + High severity items
2. Financial implications (clawback, penalties)
3. Mobility restrictions (notice, non-compete)
4. Medium severity with large financial impact

**Seek Clarification**:
- Ask employer about flagged clauses
- Request written clarifications for verbal promises
- Negotiate before signing, not after

---

## Feedback & Support

### Report Issues
- Incorrect analysis: Use "Report Issue" button in results
- Missing features: Email feedback@rexilegal.com
- Security concerns: security@rexilegal.com

### Feature Requests
- Vote on roadmap at /roadmap (coming soon)
- Join community Discord (link in footer)

### Legal Emergencies
- REXI is not for emergencies
- Contact a lawyer directly for urgent matters
- See /resources for lawyer directories

---

## Changelog & Updates

### Recent Features (January 2026)

**New**:
- ✨ Employment offer comparison (up to 3 offers)
- ✨ Tax calculation for FY 2025-26
- ✨ Livability index for 50+ Indian cities
- ✨ Interactive clause highlighting

**Improved**:
- 🚀 50% faster analysis (15s avg, down from 30s)
- 🚀 Better PDF extraction with Mistral OCR
- 🚀 More accurate Indian law matching

**Fixed**:
- 🐛 Large file upload timeouts
- 🐛 Tax calculation edge cases
- 🐛 Mobile UI responsiveness

---

## Frequently Asked Questions

### Is my document stored by REXI?
No, document content is processed in real-time and not stored permanently. Analysis results may be stored anonymously for quality improvement.

### Can I use REXI for documents outside India?
REXI is optimized for Indian laws and contracts. International documents can be analyzed but legal references may not be applicable.

### How accurate is the salary calculation?
Tax calculations are ~95% accurate for standard cases. Accuracy depends on correct field extraction from your offer letter. Consult a CA for final verification.

### Can REXI analyze handwritten documents?
No, only typed documents are supported. Use OCR software to convert handwritten documents to text first.

### What if my document is in Hindi/regional language?
Currently English only. Multi-language support is planned for Q2 2026.

### Is REXI free?
Yes, core analysis features are free with rate limits (20/hour). Premium features (unlimited, advanced comparison) coming soon.

---

## Legal Notice

REXI is provided "as-is" without warranties of any kind. By using REXI, you agree to:
- Use results as informational guidance only
- Not rely solely on REXI for legal decisions
- Consult qualified legal professionals for important contracts
- Accept that AI analysis may contain errors

See full [Terms of Service](/terms) and [Privacy Policy](/privacy).

---

*Last Updated: January 21, 2026*
*Version: 1.0.0*
