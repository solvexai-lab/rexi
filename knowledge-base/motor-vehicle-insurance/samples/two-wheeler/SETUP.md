# Quick Setup Guide

## Where to Place Your Downloaded PDFs

Place your two-wheeler insurance PDFs in subdirectories by insurer:

```
knowledge-base/motor-vehicle-insurance/samples/two-wheeler/
├── icici-lombard/
│   └── policy.pdf
├── bajaj-allianz/
│   └── policy.pdf
├── hdfc-ergo/
│   └── policy.pdf
├── digit/
│   └── policy.pdf
└── acko/
    └── policy.pdf
```

## Example Commands

### Create insurer directories:
```powershell
cd "e:\Rexi -Legal\e--orchids-projects-orchids-lexi-contract-analysis\knowledge-base\motor-vehicle-insurance\samples\two-wheeler"

mkdir icici-lombard, bajaj-allianz, hdfc-ergo, digit, acko, future-generali
```

### Then copy your PDFs into the respective folders

### Run analysis:
```bash
npx tsx scripts/analyze-bike-pdfs.ts
```

This will extract all PDFs and build the knowledge base!
