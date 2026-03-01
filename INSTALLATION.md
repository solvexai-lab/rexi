# REXI - Installation Guide

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Installation](#detailed-installation)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Development Tools](#development-tools)
- [Troubleshooting](#troubleshooting)
- [Production Deployment](#production-deployment)

---

## Prerequisites

### Required Software

| Software | Minimum Version | Recommended | Purpose |
|----------|----------------|-------------|---------|
| **Node.js** | 18.17.0 | 20.x or later | Runtime environment |
| **pnpm** | 8.0.0 | Latest | Package manager |
| **Git** | 2.0+ | Latest | Version control |

### Optional Tools

- **VS Code** - Recommended IDE with TypeScript support
- **Postman/Thunder Client** - API testing
- **Supabase CLI** - Local database management

### System Requirements

- **OS**: Windows 10+, macOS 10.15+, or Linux
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 1GB for dependencies and build

---

## Quick Start

### For Experienced Developers

```bash
# 1. Clone the repository
git clone https://github.com/Bedaant/e--orchids-projects-orchids-lexi-contract-analysis.git
cd rexi

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# 4. Run development server
pnpm dev

# 5. Open browser
# Navigate to http://localhost:3000
```

---

## Detailed Installation

### Step 1: Clone the Repository

```bash
# Using HTTPS
git clone https://github.com/Bedaant/e--orchids-projects-orchids-lexi-contract-analysis.git

# OR using SSH (if configured)
git clone git@github.com:Bedaant/e--orchids-projects-orchids-lexi-contract-analysis.git

# Navigate to project directory
cd rexi
```

### Step 2: Install Node.js

#### Check if Node.js is installed
```bash
node --version
# Should output v18.17.0 or higher
```

#### Install Node.js (if not installed)

**macOS (using Homebrew)**
```bash
brew install node@20
```

**Windows**
- Download from [nodejs.org](https://nodejs.org/)
- Run the installer and follow prompts

**Linux (Ubuntu/Debian)**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 3: Install pnpm

```bash
# Using npm (comes with Node.js)
npm install -g pnpm

# Verify installation
pnpm --version
```

**Alternative Installation Methods:**

```bash
# Using Homebrew (macOS)
brew install pnpm

# Using PowerShell (Windows)
iwr https://get.pnpm.io/install.ps1 -useb | iex

# Using curl (Linux/macOS)
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### Step 4: Install Project Dependencies

```bash
# Install all dependencies from package.json
pnpm install

# This will install:
# - Next.js 15.5.7
# - React 19.2.0
# - TypeScript 5
# - Tailwind CSS 4
# - 50+ other packages
```

**Expected Output:**
```
Packages: +XXX
Progress: resolved XXX, reused XXX, downloaded XX
Done in Xs
```

### Step 5: Environment Configuration

#### Create Environment File

```bash
# Copy the example file
cp .env.example .env.local

# Open in your editor
nano .env.local
# OR
code .env.local
```

#### Configure Required Variables

Edit `.env.local` with your actual values:

```bash
# Environment
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# AI API Keys
GEMINI_API_KEY=your_gemini_api_key_here
MISTRAL_API_KEY=your_mistral_api_key_here

# Optional: Rate Limiting
RATE_LIMIT_REQUESTS_PER_MINUTE=20
RATE_LIMIT_ENABLED=true
```

---

## Database Setup

### Option 1: Using Supabase Cloud (Recommended)

#### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - **Name**: rexi-dev
   - **Database Password**: (choose a strong password)
   - **Region**: (closest to you)
5. Wait 2-3 minutes for project creation

#### 2. Get API Keys

1. Go to **Settings** → **API**
2. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

#### 3. Run Database Migrations

```bash
# Using Supabase SQL Editor
# Go to: SQL Editor in Supabase Dashboard
# Run the following files in order:

# 1. DEPLOYMENT_SETUP.sql
# 2. production_setup.sql
# 3. insert_patterns.sql
# 4. insert_more_patterns.sql
```

**Or use Supabase CLI:**

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

#### 4. Verify Tables Created

Run in SQL Editor:
```sql
-- Should show: patterns, indian_laws, analyses, user_feedback
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

### Option 2: Local Supabase (Advanced)

```bash
# Install Docker (required)
# macOS: Download Docker Desktop
# Linux: sudo apt-get install docker.io

# Start local Supabase
supabase start

# This will output local credentials
# Update .env.local with local URLs
```

---

## Environment Configuration

### Required API Keys

#### 1. Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy key → `GEMINI_API_KEY` in `.env.local`

**Free Tier:**
- 60 requests per minute
- Suitable for development

#### 2. Mistral AI API Key

1. Go to [Mistral AI Console](https://console.mistral.ai/)
2. Sign up or log in
3. Navigate to **API Keys**
4. Click "Create new key"
5. Copy key → `MISTRAL_API_KEY` in `.env.local`

**Free Tier:**
- Limited requests per month
- Sufficient for testing OCR functionality

### Optional Configuration

#### Stripe (Payment Processing)

If you want to test payment features:

```bash
# Add to .env.local
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

Get from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)

#### Analytics & Monitoring

```bash
# Feature flags
NEXT_PUBLIC_ENABLE_DEBUG_MODE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

---

## Running the Application

### Development Mode

```bash
# Start development server
pnpm dev

# Server will start on http://localhost:3000
# Hot reload enabled - changes reflect instantly
```

**Expected Output:**
```
▲ Next.js 15.5.7
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.3s
```

### Build for Production

```bash
# Create optimized production build
pnpm build

# This will:
# - Compile TypeScript
# - Bundle JavaScript
# - Optimize images
# - Generate static pages
```

### Start Production Server

```bash
# Run production build locally
pnpm start

# Server runs on http://localhost:3000
# No hot reload - requires rebuild for changes
```

### Other Commands

```bash
# Lint code (check for errors)
pnpm lint

# Type checking
npx tsc --noEmit

# Run specific test scripts
node test_gemini.js
node test-api.js
```

---

## Development Tools

### Recommended VS Code Extensions

Install these for better development experience:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "styled-components.vscode-styled-components",
    "yoavbls.pretty-ts-errors",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### Browser DevTools

Install these browser extensions:

- **React Developer Tools** - Inspect React component tree
- **Redux DevTools** - If using Redux (not currently)
- **Lighthouse** - Performance auditing

---

## Troubleshooting

### Common Issues

#### Issue: "Module not found" errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
pnpm install

# Clear Next.js cache
rm -rf .next
pnpm dev
```

#### Issue: "GEMINI_API_KEY is not set"

**Solution:**
```bash
# Ensure .env.local exists and has the key
cat .env.local | grep GEMINI_API_KEY

# Should output: GEMINI_API_KEY=your_key_here
# If not, add it to .env.local
```

#### Issue: Port 3000 already in use

**Solution:**
```bash
# Option 1: Kill process on port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Option 2: Use different port
PORT=3001 pnpm dev
```

#### Issue: TypeScript errors

**Solution:**
```bash
# Verify TypeScript installation
npx tsc --version

# Check for type errors
npx tsc --noEmit

# If errors persist, try:
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

#### Issue: Supabase connection failed

**Solution:**
```bash
# Test connection
curl https://your-project.supabase.co/rest/v1/

# Should return: {"message":"missing authorization header"}
# This means connection works (auth is separate issue)

# Verify API keys are correct
# Check: https://supabase.com/dashboard/project/your-project/settings/api
```

#### Issue: AI API rate limit exceeded

**Solution:**
```bash
# Wait 60 seconds and try again
# Or implement retry logic in development

# For Gemini: Check quota at
# https://makersuite.google.com/app/apikey

# For Mistral: Check usage at
# https://console.mistral.ai/usage
```

#### Issue: Build fails on Vercel

**Solutions:**
```bash
# Ensure all environment variables are set in Vercel dashboard
# Go to: Project Settings → Environment Variables

# Common missing vars:
# - GEMINI_API_KEY
# - MISTRAL_API_KEY
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY

# Check build logs for specific error
# Vercel Dashboard → Deployments → [Your Build] → Logs
```

---

## Testing the Installation

### 1. Basic Health Check

Open browser: `http://localhost:3000`

**Expected:** Landing page loads with REXI logo and navigation

### 2. Test Document Analysis

1. Go to `http://localhost:3000/analyze`
2. Create a test file: `test.txt`
3. Add content:
   ```
   EMPLOYMENT AGREEMENT

   Position: Software Engineer
   Salary: Rs. 5,00,000 per annum
   Notice Period: 90 days
   Probation: 6 months
   ```
4. Upload file
5. Wait 15-30 seconds

**Expected:** Analysis results with clauses and risk scores

### 3. Test API Endpoint

```bash
# Test analyze endpoint
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"This is a test contract with a 180-day notice period."}'

# Expected: JSON response with analysis results
```

### 4. Verify Database Connection

Check Supabase logs:
1. Go to Supabase Dashboard
2. Navigate to **Logs** → **Database Logs**
3. Should see connection attempts from your app

---

## Production Deployment

### Deploy to Vercel (Recommended)

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Login to Vercel

```bash
vercel login
```

#### 3. Deploy

```bash
# From project root
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: rexi
# - Directory: ./
# - Override settings? No

# First deployment will be to preview URL
```

#### 4. Add Environment Variables

```bash
# Via CLI
vercel env add GEMINI_API_KEY
vercel env add MISTRAL_API_KEY
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Or via Dashboard:
# https://vercel.com/your-account/rexi/settings/environment-variables
```

#### 5. Deploy to Production

```bash
vercel --prod
```

### Deploy to Other Platforms

#### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

#### Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables
5. Deploy automatically on push

#### Docker (Self-Hosted)

```dockerfile
# Create Dockerfile in project root
FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
```

```bash
# Build and run
docker build -t rexi .
docker run -p 3000:3000 --env-file .env.local rexi
```

---

## Performance Optimization

### Production Checklist

- [ ] Environment variables are set correctly
- [ ] `NEXT_PUBLIC_ENV` is set to `production`
- [ ] API keys are production keys (not test)
- [ ] Rate limiting is enabled
- [ ] Supabase Row Level Security (RLS) is configured
- [ ] Content Security Policy (CSP) headers are active
- [ ] Images are optimized (using next/image)
- [ ] Analytics are enabled (if desired)
- [ ] Error tracking is set up (Sentry, etc.)

### Build Optimization

```bash
# Analyze bundle size
ANALYZE=true pnpm build

# Check bundle analyzer report
# Opens browser with visual bundle breakdown
```

### Caching Strategy

```javascript
// next.config.mjs
export default {
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'no-store' }
      ]
    }
  ]
}
```

---

## Data Ingestion (Optional)

### Populate Legal Patterns Database

```bash
# Ingest sample patterns (requires Supabase setup)
node ingest_patterns.mjs

# Ingest Indian laws
node ingest_indian_laws.mjs

# Bulk industry data
node bulk_industry_ingest.mjs

# Generate test data
node auto_generate_1000.mjs
```

---

## Security Checklist

Before going live:

- [ ] Change all default passwords
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS only (handled by Vercel automatically)
- [ ] Configure CORS properly
- [ ] Set up rate limiting (already configured)
- [ ] Enable Supabase RLS policies
- [ ] Review and restrict API key permissions
- [ ] Set up logging and monitoring
- [ ] Configure backup strategy for database
- [ ] Review security headers in middleware

---

## Maintenance

### Regular Updates

```bash
# Update dependencies (monthly)
pnpm update

# Check for outdated packages
pnpm outdated

# Update specific package
pnpm update package-name@latest
```

### Monitoring

```bash
# Check application logs
vercel logs --follow

# Check database health
# Supabase Dashboard → Database → Health
```

### Backup Strategy

```bash
# Export Supabase database
supabase db dump --file backup.sql

# Restore from backup
supabase db reset --file backup.sql
```

---

## Getting Help

### Resources

- **Architecture**: See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Usage Guide**: See [USAGE.md](./USAGE.md)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)

### Community Support

- **GitHub Issues**: Report bugs and request features
- **Discussions**: Ask questions in GitHub Discussions
- **Email**: dev@rexi.pro

### Commercial Support

For enterprise installations or custom deployments:
- Email: enterprise@rexi.pro

---

## Development Workflow

### Branch Strategy

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: your feature description"

# Push to remote
git push origin feature/your-feature-name

# Create pull request on GitHub
```

### Commit Message Convention

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

---

## Appendix

### Minimum .env.local Template

```bash
# Essential variables to get started
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
MISTRAL_API_KEY=your_mistral_api_key
```

### Port Configuration

```bash
# Change default port
PORT=3001 pnpm dev

# Or in package.json
"scripts": {
  "dev": "next dev -p 3001"
}
```

### Database Schema Quick Reference

```sql
-- Main tables
patterns (id, name, description, severity, embedding)
indian_laws (id, law_name, law_type, key_provisions, embedding)
analyses (id, user_id, document_text, results, created_at)
user_feedback (id, analysis_id, rating, comments)
```

---

**Last Updated:** January 21, 2026
**Version:** 1.0.0
**Maintainer:** REXI Development Team

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│                    REXI QUICK START                     │
├─────────────────────────────────────────────────────────┤
│ Install:        pnpm install                            │
│ Configure:      cp .env.example .env.local              │
│ Run Dev:        pnpm dev                                │
│ Build:          pnpm build                              │
│ Production:     pnpm start                              │
│                                                          │
│ Test API:       curl localhost:3000/api/analyze         │
│ Docs:           http://localhost:3000                   │
│                                                          │
│ Required Keys:                                          │
│   • GEMINI_API_KEY                                      │
│   • MISTRAL_API_KEY                                     │
│   • NEXT_PUBLIC_SUPABASE_URL                            │
│   • NEXT_PUBLIC_SUPABASE_ANON_KEY                       │
└─────────────────────────────────────────────────────────┘
```

Happy coding! 🚀
