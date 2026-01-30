# REXI - Architecture Documentation

## Table of Contents
- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Core Components](#core-components)
- [API Endpoints](#api-endpoints)
- [Data Flow](#data-flow)
- [Security & Rate Limiting](#security--rate-limiting)
- [Database & Storage](#database--storage)
- [Deployment](#deployment)

---

## Project Overview
https://github.com/Bedaant/e--orchids-projects-orchids-lexi-contract-analysis.git
**REXI** (Smart Legal Document Review Platform) is a Next.js-based web application that provides AI-powered analysis of legal documents. The platform helps everyday users understand complex legal documents (employment offers, rental agreements, insurance policies, etc.) by extracting key information, identifying risks, and providing plain-language explanations.

**Core Value Proposition**: "Don't sign without scanning" - democratizing legal document review for everyone.

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15.5.7 (React 19.2.0)
- **UI Library**: Radix UI components with Tailwind CSS 4
- **Animations**: Framer Motion 12.23.24
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React hooks (useState, useEffect)

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **AI/ML Services**:
  - Google Gemini AI (2.0-flash model) for document classification and field extraction
  - Mistral AI OCR for PDF text extraction
- **Database**: Supabase (PostgreSQL with SSR support)
- **File Processing**:
  - PDF.js for PDF parsing
  - Mammoth.js for Word document parsing
  - PDF-parse & pdf2json for fallback parsing

### Development & Infrastructure
- **Language**: TypeScript 5
- **Package Manager**: pnpm (with bun.lock and package-lock.yaml present)
- **Deployment**: Vercel (configured via vercel.json)
- **API Configuration**: Max duration 60s, force-dynamic rendering

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                            │
│  (Next.js Frontend - React Components & Pages)                   │
│  - Landing Page  - Analyze UI  - Contracts/Offers Pages          │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MIDDLEWARE LAYER                            │
│  - Security Checks (User-Agent, Path Validation)                 │
│  - Supabase Session Management                                   │
│  - Request Filtering (SQL injection, XSS protection)             │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER                                 │
│  /api/analyze           - General document analysis              │
│  /api/analyze-contract  - Contract-specific analysis             │
│  /api/analyze-offer     - Employment offer analysis              │
│  /api/parse-pdf         - PDF text extraction (Mistral OCR)      │
│  /api/parse-file        - Multi-format file parsing              │
│  /api/compare-offers    - Side-by-side offer comparison          │
│  /api/store-analysis    - Save analysis results to DB            │
│  /api/contribute-data   - User feedback collection               │
│  /api/stripe/*          - Payment processing                     │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CORE ENGINE LAYER                             │
│  ┌────────────┐   ┌────────────┐   ┌────────────┐               │
│  │   Router   │──▶│ Extractor  │──▶│  Engine    │               │
│  └────────────┘   └────────────┘   └────────────┘               │
│       │                 │                 │                      │
│       ▼                 ▼                 ▼                      │
│  Classify Doc      Extract Fields   Apply Logic Rules           │
│  (Gemini AI)       (Gemini AI)      (Deterministic)             │
│                                                                  │
│  ┌────────────┐                                                  │
│  │   Voice    │◀── Synthesize human-readable explanations       │
│  └────────────┘    (Gemini AI)                                  │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                              │
│  - Supabase (Database)                                           │
│  - Google Gemini AI (Classification, Extraction, Voice)          │
│  - Mistral AI (OCR for PDFs)                                     │
│  - Stripe (Payments - optional premium features)                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Document Analysis Pipeline (4-Stage Engine)

#### Stage 1: Router (`src/lib/router.ts`)
**Purpose**: Classify the document type using AI

```typescript
classifyDocument(text: string) → { type: DocumentType, confidence: number }
```

**Supported Document Types**:
- EMPLOYMENT_OFFER
- RESIDENTIAL_LEASE
- COMMERCIAL_LEASE
- NDA
- SERVICE_AGREEMENT
- INSURANCE_POLICY
- GENERAL_CONTRACT

**Model**: Gemini 2.0-flash (temp: 0.1, JSON output)

---

#### Stage 2: Extractor (`src/lib/extractor.ts`)
**Purpose**: Extract structured fields from unstructured text

```typescript
extractFields(text: string, schema: ExtractionSchema) → ExtractedValue[]
```

**Returns**:
```typescript
{
  key: string,
  value: any,
  sourceText: string,      // Exact snippet from document
  context: string,         // Surrounding text
  confidence: number       // 0-1 confidence score
}
```

**Model**: Gemini 2.0-flash (temp: 0.0, JSON output)

---

#### Stage 3: Deterministic Engine (`src/lib/engine.ts`)
**Purpose**: Apply rule-based logic to extracted values

```typescript
runDeterministicEngine(values: ExtractedValue[], schema: ExtractionSchema) → Finding[]
```

**Logic Rules Example** (from `employment_offer.ts`):
```typescript
{
  id: "LOW_SALARY",
  fieldKeys: ["base_salary"],
  condition: "value < 300000",
  severity: "medium",
  message: "Base salary is below ₹3,00,000 per annum"
}
```

**Severity Levels**: critical | high | medium | low

---

#### Stage 4: Voice Synthesis (`src/lib/voice.ts`)
**Purpose**: Convert technical findings into plain English

```typescript
synthesizeExplanations(findings: Finding[]) → string[]
```

**Constraints**:
- No subjective language (no "bad", "unfair", "predatory")
- No legal advice
- Neutral, factual tone
- Plain English format

**Model**: Gemini 2.0-flash (temp: 0.3)

---

### 2. Orchestrator (`src/lib/orchestrator.ts`)

Central coordinator that chains all 4 stages:

```typescript
analyzeDocumentStageByStage(text: string) → AnalysisStageResult

// Returns:
{
  router: { type, confidence },
  extractor: { values, schema },
  deterministic: { findings },
  voice: { explanations }
}
```

---

### 3. File Processing

#### PDF Processing (`src/lib/mistral-ocr.ts`)
- **Primary**: Mistral OCR API (`mistral-ocr-latest` model)
- Converts PDF buffer to base64 → OCR → Markdown output
- Handles multi-page documents

#### Multi-Format Parser (`src/app/api/parse-file/route.ts`)
- **PDF**: pdf-parse, pdf2json fallback
- **DOCX**: Mammoth.js
- **TXT**: Direct text reading
- Max file size: 10MB
- Allowed types: PDF, DOCX, DOC, TXT

---

### 4. Schema System

**Location**: `src/lib/configs/`

Example: `employment_offer.ts`
```typescript
{
  docType: "EMPLOYMENT_OFFER",
  fields: [
    { key: "base_salary", type: "number", required: true },
    { key: "notice_period", type: "number", required: true },
    { key: "non_compete", type: "boolean", required: true },
    // ... more fields
  ],
  logicRules: [
    { id: "LOW_SALARY", condition: "value < 300000", severity: "medium" },
    // ... more rules
  ]
}
```

**Extensibility**: New document types can be added by creating new schema files.

---

## API Endpoints

### Core Analysis Endpoints

| Endpoint | Method | Purpose | Max Duration |
|----------|--------|---------|--------------|
| `/api/analyze` | POST | General document analysis (full pipeline) | 60s |
| `/api/analyze-contract` | POST | Contract-specific analysis with pattern matching | 60s |
| `/api/analyze-offer` | POST | Employment offer deep analysis | 60s |
| `/api/compare-offers` | POST | Side-by-side comparison of 2+ offers | 60s |

### File Processing Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/parse-pdf` | POST | Extract text from PDF using Mistral OCR |
| `/api/parse-file` | POST | Parse PDF/DOCX/TXT to text |

### Data & Persistence

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/store-analysis` | POST | Save analysis results to Supabase |
| `/api/contribute-data` | POST | Collect user feedback on analyses |

### Payment Integration

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/stripe/checkout` | POST | Create Stripe checkout session |
| `/api/stripe/webhook` | POST | Handle Stripe webhook events |

---

## Data Flow

### Complete Analysis Flow

```
┌─────────────┐
│   User      │
│ Uploads Doc │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ File Validation │ (Size, Type, Security)
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Text Extraction │ (Mistral OCR / pdf-parse / Mammoth)
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Rate Limit      │ (20 req/min per IP)
│ Check           │
└──────┬──────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│         ORCHESTRATOR PIPELINE            │
│                                         │
│  1. Router → Classify document type     │
│  2. Extractor → Extract key fields      │
│  3. Engine → Apply logic rules          │
│  4. Voice → Generate explanations       │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────┐
│ Store to        │
│ Supabase        │ (Optional)
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Return JSON     │
│ Response        │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Frontend        │
│ Displays        │ (Findings, Risk Scores, Explanations)
│ Results         │
└─────────────────┘
```

---

## Security & Rate Limiting

### Middleware Security (`src/middleware.ts`)

**Blocked User Agents**:
- sqlmap, nikto, nmap, masscan, zgrab

**Blocked Paths**:
- `/wp-admin`, `/wp-login`, `/phpmyadmin`
- `/.env`, `/.git`, `/config.php`
- `/shell`, `/cmd`

**Suspicious Pattern Detection**:
- SQL injection (UNION SELECT, etc.)
- XSS attempts (`<script>`, `javascript:`)
- Path traversal (`../`, `..\\`)
- Code execution attempts (`eval(`, `base64_decode`)

### Rate Limiting (`src/lib/security.ts`)

```typescript
RATE_LIMIT_WINDOW_MS = 60,000 (1 minute)
MAX_REQUESTS_PER_WINDOW = 20

// Returns:
{ allowed: boolean, remaining: number, resetIn: number }
```

**Storage**: In-memory Map (resets on server restart)

### Content Security

**Sanitization** (`sanitizeText`):
- Strip `<script>` tags
- Remove HTML tags
- Block `javascript:` protocol
- Remove event handlers (`on*=`)
- Block `eval()` and `expression()`

**Response Headers**:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## Database & Storage

### Supabase Integration

**Client Types**:
1. **Server Client** (`src/lib/supabase/server.ts`)
   - Uses Next.js cookies for session management
   - Server-side rendering support via `@supabase/ssr`

2. **Client-side** (`src/lib/supabase/client.ts`)
   - Browser-based operations

3. **Middleware** (`src/lib/supabase/middleware.ts`)
   - Session refresh and authentication

### Database Schema (Inferred)

**Tables**:
- `analyses` - Stored document analysis results
- `user_feedback` - Contributed data from users
- `patterns` (referenced in ingest scripts) - Legal clause patterns

**Setup Scripts**:
- `DEPLOYMENT_SETUP.sql`
- `production_setup.sql`
- `insert_patterns.sql`
- `insert_more_patterns.sql`

---

## Deployment

### Vercel Configuration

**File**: `vercel.json`

**Features**:
- Edge-optimized Next.js deployment
- Environment variables:
  - `GEMINI_API_KEY` (Google Generative AI)
  - `MISTRAL_API_KEY` (Mistral OCR)
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `STRIPE_SECRET_KEY` (if using payments)

### Build Configuration

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

**Next.js Config**: `next.config.mjs`
- TypeScript strict mode enabled
- Tailwind CSS 4 integration
- Image optimization enabled

---

## Key Design Patterns

### 1. **Hybrid AI + Rules-Based Architecture**
- **AI**: Classification and extraction (probabilistic)
- **Rules**: Risk evaluation (deterministic)
- **Benefit**: Combines flexibility with reliability

### 2. **Schema-Driven Processing**
- Document types are defined by schemas
- Easy to extend: add new schema → support new document type
- Validation and logic rules are co-located

### 3. **Multi-Stage Pipeline**
- Clear separation of concerns (Router → Extractor → Engine → Voice)
- Each stage can be tested independently
- Easy to swap out AI models or add new stages

### 4. **Security-First Design**
- Request validation at multiple layers (middleware, API routes)
- Rate limiting on all analysis endpoints
- Content sanitization before AI processing
- Origin validation for CORS

### 5. **Progressive Enhancement**
- Works with plain text extraction fallbacks
- Multiple PDF parsing strategies (Mistral OCR → pdf-parse → pdf2json)
- Graceful degradation when APIs fail

---

## Environment Variables Required

```bash
# AI Services
GEMINI_API_KEY=<google-generative-ai-key>
MISTRAL_API_KEY=<mistral-ai-key>

# Database
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>

# Payments (Optional)
STRIPE_SECRET_KEY=<stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<stripe-webhook-secret>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<stripe-public-key>
```

---

## Utility Scripts

### Data Ingestion
- `ingest_v2.mjs` - Primary data ingestion pipeline
- `ingest_indian_laws.mjs` - Import Indian legal references
- `ingest_patterns.mjs` - Import legal clause patterns
- `bulk_industry_ingest.mjs` - Bulk industry-specific data
- `auto_generate_1000.mjs` - Generate test data

### Model Management
- `fetch_models.js` - Retrieve available AI models
- `list_models.js` - List configured models
- `check-models.js` - Validate model availability

### Testing
- `test_gemini.js` - Test Gemini AI integration
- `test-api.js` - API endpoint testing
- `test-calc.js` - Logic engine testing
- `test_indian_law.json` - Indian law test cases

---

## Future Architecture Considerations

### Scalability
- **Current**: In-memory rate limiting (single instance)
- **Future**: Redis for distributed rate limiting
- **Current**: Synchronous analysis pipeline
- **Future**: Queue-based processing (Bull/BullMQ) for long documents

### Multi-Tenancy
- **Current**: Single schema for all users
- **Future**: Organization-level custom rules and schemas

### Caching
- **Current**: No caching layer
- **Future**:
  - Redis cache for frequently analyzed documents
  - CDN caching for static analysis results
  - Gemini API response caching

### Monitoring
- **Current**: Basic console logging
- **Future**:
  - Structured logging (Winston/Pino)
  - APM integration (Sentry/DataDog)
  - AI model performance tracking

---

## Contributing Guidelines

### Adding a New Document Type

1. **Create Schema** (`src/lib/configs/new_type.ts`):
   ```typescript
   export const newTypeSchema: ExtractionSchema = {
     docType: "NEW_TYPE",
     fields: [...],
     logicRules: [...]
   };
   ```

2. **Register in Orchestrator** (`src/lib/orchestrator.ts`):
   ```typescript
   const SCHEMAS: Record<string, ExtractionSchema> = {
     "NEW_TYPE": newTypeSchema,
     // ... existing schemas
   };
   ```

3. **Update Router** (`src/lib/router.ts`):
   - Add "NEW_TYPE" to classification prompt

4. **Create API Endpoint** (optional):
   - `src/app/api/analyze-newtype/route.ts`

### Testing Checklist
- [ ] Test with real documents
- [ ] Verify field extraction accuracy
- [ ] Validate logic rules fire correctly
- [ ] Check voice synthesis quality
- [ ] Test with malformed/edge case documents

---

## License & Legal

**Disclaimer**: All analysis results include:
> "This is not legal advice - think of it as a helpful friend pointing out things you might want to look at. For important contracts, always have a real lawyer review them."

**Privacy**: Document text is sent to third-party AI APIs (Google Gemini, Mistral). Ensure user consent and compliance with data protection regulations (GDPR, CCPA, etc.).

---

## Contact & Support

For architecture questions or contributions:
- Check `/src/lib/types/` for TypeScript interfaces
- Review `/src/lib/configs/` for document schemas
- See test files (`test-*.js`) for usage examples

---

*Last Updated: January 2026*
*Version: 0.1.0*
