# 📋 Quick Guide: Bike Insurance PDF Analysis

## How to Provide Sample PDFs

### Option 1: Place PDFs in Project Directory
```
knowledge-base/bike-insurance/samples/
├── icici-lombard/
│   └── sample.pdf
├── bajaj-allianz/
│   └── sample.pdf
├── hdfc-ergo/
│   └── sample.pdf
├── digit/
│   └── sample.pdf
└── acko/
    └── sample.pdf
```

### Option 2: Share Drive Link
Upload PDFs to Google Drive/Dropbox and share the link.

---

## What Happens Next

Once you provide PDFs, I will:

1. **Extract Text** - Run Mistral OCR on each PDF
2. **Detect Patterns** - Find field name variations across insurers
3. **Build Knowledge Base** - Create `field-mappings.json` with:
   - IDV field variations
   - NCB naming patterns
   - Premium table structures
   - Add-on naming conventions
4. **Refine Prompts** - Update Mistral extraction prompt with real patterns
5. **Test Accuracy** - Validate against your samples

---

## Run Analysis Script

```bash
npx tsx scripts/analyze-bike-pdfs.ts
```

**Output:**
- `knowledge-base/bike-insurance/extracted/*.md` - OCR text
- `knowledge-base/bike-insurance/patterns/field-mappings.json` - Aggregated patterns

---

## Expected Improvements

**Before KB**: 70-80% extraction accuracy (generic prompts)
**After KB**: 90-95% extraction accuracy (insurer-specific patterns)

**Example:**
- ICICI uses "OD Premium" → KB maps to `ownDamagePremium`
- Bajaj uses "Basic OD" → KB maps to `ownDamagePremium`
- Same field, different names → unified extraction

---

## Ready to Upload?

Drop your PDFs in `knowledge-base/bike-insurance/samples/` or share a drive link!
