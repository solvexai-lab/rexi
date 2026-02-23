# Knowledge Base Builder - Testing Instructions

## ✅ What We Built

1. **API Route**: `/api/insurance/build-kb`
   - Accepts multiple PDF files
   - Extracts text using Mistral OCR
   - Detects field patterns (IDV, NCB, policy numbers, premiums, add-ons)
   - Aggregates knowledge base across all insurers
   - Saves to `knowledge-base/motor-vehicle-insurance/patterns/field-mappings.json`

2. **Frontend Page**: `http://localhost:3000/insurance/kb-builder`
   - Beautiful upload interface
   - Multi-file PDF selection
   - Real-time analysis progress
   - Results dashboard with:
     - Total PDFs processed
     - Insurers analyzed
     - Field patterns detected
     - Average confidence score
     - Detailed per-PDF results

## 🚀 How to Test

### Step 1: Open the KB Builder Page
```
http://localhost:3000/insurance/kb-builder
```

### Step 2: Select Your 15 PDFs
1. Click the file upload button
2. Navigate to: `knowledge-base/motor-vehicle-insurance/samples/two-wheeler/`
3. Select ALL 15 PDFs from all insurer folders
4. Click "Open"

### Step 3: Analyze
1. Click the "Analyze & Build Knowledge Base" button
2. Wait 2-5 minutes (Mistral OCR processes each PDF)
3. Watch the progress indicator

### Step 4: Review Results
You'll see:
- ✅ Total PDFs processed
- ✅ Number of insurers (should be ~7)
- ✅ Field patterns discovered
- ✅ Average extraction confidence
- ✅ Per-PDF breakdown with confidence scores

### Step 5: Check Output Files
After analysis completes, check:

**Knowledge Base**:
```
knowledge-base/motor-vehicle-insurance/patterns/field-mappings.json
```

**Extracted Texts**:
```
knowledge-base/motor-vehicle-insurance/extracted/
```

## 📊 Expected Results

### Sample Knowledge Base Structure:
```json
{
"version": "1.0",
  "generated_date": "2026-02-05T...",
  "insurers_analyzed": ["acko", "bajaj-allianz", "digit", "hdfc-ergo", "icici-lombard", ...],
  "pdfs_processed": 15,
  "field_patterns": {
    "idv": {
      "variations": ["IDV", "Insured Declared Value", "Sum Insured"],
      "sample_values": ["65000", "45000", "80000"],
      "insurers": ["acko", "bajaj-allianz", "digit", ...]
    },
    "ncb": {
      "variations": ["NCB", "No Claim Bonus", "NCB %"],
      "sample_values": ["20%", "25%", "35%"],
      "insurers": ["acko", "bajaj-allianz", ...]
    },
    "premium": {
      "variations": ["Net Premium", "Total Premium", "Gross Premium"],
      "sample_values": ["2500", "3200", "4100"],
      "insurers": [...]
    }
  },
  "confidence_scores": {
    "acko": 85,
    "bajaj-allianz": 90,
    "digit": 88,
    ...
  }
}
```

### What This Enables:
1. **Smarter Extraction**: We now know which field names each insurer uses
2. **Better Prompts**: Can customize Mistral prompts per insurer
3. **Validation**: Know expected value ranges for each field
4. **Error Detection**: Flag anomalies based on learned patterns

## 🎯 Next Steps After KB is Built

1. **Review the knowledge base file** to see patterns
2. **Use it to refine extraction prompts** (I can update the Mistral prompt automatically)
3. **Start building the actual two-wheeler analysis feature** with this knowledge

---

## Troubleshooting

### If analysis fails:
- Check console logs for errors
- Verify `MISTRAL_API_KEY` is set in `.env.local`
- Ensure PDFs are in correct folders

### If no output files appear:
- Check browser console for JavaScript errors
- Verify the API route is accessible
- Check server logs (Next.js terminal)

**Ready to test? Open the page and let me know what you see!** 🚀
