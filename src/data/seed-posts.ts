export interface SeedPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    author: string;
    created_at: string;
    published: boolean;
    content: string;
    keywords: string[];
}

export const SEED_POSTS: SeedPost[] = [
    {
        id: "seed-1",
        slug: "room-rent-trap-health-insurance-india",
        title: "The Room Rent Trap in Health Insurance: How a Single Clause Cuts Your Claim by 40%",
        excerpt: "Most health insurance policies have a room rent limit that seems minor — until you claim. This single clause can reduce a ₹1 lakh bill to ₹62,500 in reimbursement. Here's exactly how it works, with real calculations, and three ways to protect yourself.",
        author: "REXI Legal Team",
        created_at: "2026-02-24T00:00:00Z",
        published: true,
        keywords: ["room rent trap health insurance", "proportionate deduction", "health insurance india", "room rent limit"],
        content: `## What is the Room Rent Trap?

The room rent trap occurs when your health insurance policy has a per-day room rent limit — and you exceed it. Most people expect the insurer to deduct only the excess room cost (e.g., if your limit is ₹5,000 and you choose a ₹7,000 room, you expect to pay ₹2,000 extra per day).

**What actually happens is far worse:** the insurer applies a **proportionate deduction** to your entire hospital bill, including surgeon fees, anaesthesia, medicines, and diagnostics. 

This clause is legal, standard in thousands of Indian policies, and responsible for some of the most shocking claim shortfalls policyholders experience. A ₹1 lakh bill becomes ₹62,000. A ₹5 lakh bill becomes ₹3 lakh. Not because the treatment wasn't covered — but because of the room you chose.

> **Key Fact:** Most common room rent limit is 1% of sum insured per day. On a ₹5 lakh policy, that is ₹5,000/day. A single non-AC room at Apollo or Fortis in most Indian cities costs ₹6,000–₹10,000/day.

## How Proportionate Deduction Works (The Math)

Under IRDAI guidelines (and as specified in most policy wordings), when the room rent you choose exceeds your policy limit, insurers calculate an "eligible ratio" and apply it to every line item on your hospital bill. This is based on the logic that "better rooms attract higher doctor fees and service charges."

**The Formula:**
- Eligible Ratio = Policy Room Rent Limit ÷ Actual Room Rent Chosen
- Your Reimbursement = Total Bill × Eligible Ratio

### A Real Calculation Scenario
Suppose you have a ₹5 lakh policy (1% limit = ₹5,000/day). You are hospitalized for 5 days and choose a room costing ₹8,000/day.

| Detail | Amount |
|---|---|
| Policy Sum Insured | ₹5,00,000 |
| Room Rent Limit | ₹5,000 per day |
| Actual Room Chosen | ₹8,000 per day |
| **Eligible Ratio** | 5,000 ÷ 8,000 = **62.5%** |

**How the Insurer Processes the Bill:**

| Hospital Bill Item | Actual Cost | What Insurer Pays (62.5%) | Your Loss |
|---|---|---|---|
| Room Rent (5 nights) | ₹40,000 | ₹25,000 | ₹15,000 |
| Surgeon Fees | ₹30,000 | ₹18,750 | ₹11,250 |
| Anaesthesia | ₹10,000 | ₹6,250 | ₹3,750 |
| Medicines | ₹15,000 | ₹9,375 | ₹5,625 |
| Diagnostics | ₹5,000 | ₹3,125 | ₹1,875 |
| **Total** | **₹1,00,000** | **₹62,500** | **₹37,500** |

You end up paying **₹37,500** out of pocket. If you had chosen a ₹5,000 room, the entire ₹1,00,000 would have been covered. This is the "trap."

## Which Expenses are EXEMPT from this Trap?
Luckily, IRDAI has mandated that certain items cannot be proportionately deducted even if you exceed the room rent limit:
- **Cost of Pharmacy/Medicines:** (Note: In practice, many insurers still try to deduct these. Check your specific policy wording).
- **Consumables:** Implants, stents, and medical devices.
- **Diagnostics:** MRI, CT Scans, etc. (Note: Only if these charges are NOT room-category dependent in the hospital's tariff).

## Critical Exceptions and ICU Rules
1. **ICU Admissions:** Most policies have a higher limit for ICU stays (typically 2% of SI or "No Limit"). If you move from a suite (above limit) to an ICU (no limit), the trap only applies to the days you were in the suite.
2. **"No Limit" Clauses:** Some premium policies explicitly state "No room rent restriction." If you have this, you can choose a Deluxe or Luxury suite without penalty.

## How to Find This Clause in Your Policy
1. Open your full policy wording PDF.
2. Use Ctrl+F to search for "Associated Medical Expenses" or "Proportionate Deduction."
3. Look for the phrase: *"If the Insured occupies a room with a rent higher than the entitled limit... the company will pay only a pro-rata proportion of the total associated medical expenses."*

## How to Shield Yourself
1. **At Purchase:** Opt for a sum insured that makes the 1% limit viable (minimum ₹10L for metros) OR buy a "Room Rent Waiver" rider.
2. **At Admission:** Always ask the hospital's insurance desk: *"What is the standard single private room rent for my insurer (TPA)?"*
3. **Emergency:** If admitted in emergency to an upgraded room because no lower room was available, get a certificate from the hospital stating this. It can help you contest the deduction with the Ombudsman.

---

## Conclusion
The Room Rent Trap is the #1 reason for "short-payouts" Globallyn health insurance. Before your next renewal, check your limit. If it's ₹3,000 or 1% of a small sum insured, you are almost certainly underinsured for private hospital care Globally.`
    },
    {
        id: "seed-2",
        slug: "idv-car-insurance-check-if-underinsured",
        title: "IDV in Car Insurance: What It Means and How to Check If You're Underinsured",
        excerpt: "IDV (Insured Declared Value) is all your insurer will pay if your car is stolen or totalled. Most Indians are underinsured by 20–30% because of how IDV is calculated and manipulated. Here's the formula, the IRDAI depreciation schedule, and how to check yours.",
        author: "REXI Legal Team",
        created_at: "2026-02-24T00:00:00Z",
        published: true,
        keywords: ["idv car insurance india", "insured declared value", "car insurance underinsured", "motor insurance idv"],
        content: `## What is IDV?
IDV (Insured Declared Value) is the maximum amount your insurer will pay you if your car is declared a total loss — either stolen and not recovered, or damaged beyond economic repair (typically when repair costs exceed 75% of IDV).

It is **NOT** the market value of your car. It is the **depreciated ex-showroom value**.

> **The Red Alert:** If your car's IDV is set at ₹6 lakh but the actual replacement cost is ₹8 lakh, you lose ₹2 lakh the moment your car is stolen. This is your "Uninsured Loss."

## The Official IRDAI Depreciation Schedule
Insurers are legally required to calculate IDV based on this schedule for cars up to 5 years old:

| Car Age | Depreciation Applied |
|---|---|
| Up to 6 months | 5% |
| 6 months to 1 year | 15% |
| 1 year to 2 years | 20% |
| 2 years to 3 years | 30% |
| 3 years to 4 years | 40% |
| 4 years to 5 years | 50% |
| Beyond 5 years | Mutually agreed (typically market value) |

## The IDV Calculation Formula
**IDV = (Manufacturer's Listed Selling Price − Depreciation) + (Accessories − Depreciation)**

Note: Registration costs and insurance premiums are **NOT** included in IDV. This is why even a brand new car's IDV is 5% lower than its ex-showroom price on day one.

## Why Your IDV Might Be "Rigged"
When you compare car insurance online, the portal usually asks you to choose an IDV. Some insurers pre-select a lower IDV to show you a cheaper premium. 

**The Agent Strategy:** An agent might show you a "savings" of ₹2,000 on your premium by reducing your IDV from ₹7 lakh to ₹6 lakh. You "save" ₹2,000 but you "lose" ₹1,00,000 in coverage.

## How to Check if You are Underinsured
1. Get your car's original ex-showroom price (check old bills or brand websites).
2. Apply the depreciation percentage from the table above based on your car's age.
3. If the number on your Policy Schedule is lower than your result, you are underinsured.

### Example: The 3-Year Old Swift
- Original Ex-Showroom: ₹9,00,000
- Age: 3 years (Depreciation: 40%)
- Correct IDV: ₹5,40,000
- If your policy shows ₹4,80,000 — you are losing ₹60,000 in coverage to save maybe ₹800 in premium.

## Does IDV Matter for Normal Repairs?
For "Partial Loss" (scratches, dents, engine repair), IDV does not matter. The insurer pays the repair cost. IDV only matters for:
1. **Total Theft**
2. **Total Loss/Constructive Total Loss (CTL):** When repair cost > 75% of IDV.

## Pro Tip: IDV for Cars Older than 5 Years
For older cars, IDV is "mutually agreed." Insurers often try to set it very low (e.g., ₹1 lakh for a 7-year old Honda City). You can and should negotiate this. Check used car prices on platforms like Spinny or Cars24 and insist on an IDV that matches the market price.

---

## Conclusion
Check your policy today. Look for "Insured Declared Value." If it feels too low, call your insurer and ask for an endorsement to increase it. The extra premium is usually less than the cost of a single tank of petrol.`
    },
    {
        id: "seed-3",
        slug: "ctc-vs-take-home-salary-india-2026",
        title: "CTC vs Take-Home Salary Globally: The Exact Calculation Explained (2026)",
        excerpt: "That ₹12 LPA offer letter may give you ₹78,000 per month in hand — or ₹68,000. The difference depends on your salary structure, PF setup, and tax regime. Here is the exact formula with a worked example so you know before you sign.",
        author: "REXI Legal Team",
        created_at: "2026-02-24T00:00:00Z",
        published: true,
        keywords: ["ctc vs take home salary india", "salary breakup india", "in hand salary calculation india", "offer letter salary 2026"],
        content: `## The CTC Illusion
CTC (Cost to Company) is a marketing shell used by companies to hide what they are actually paying you. It is the total cost a company incurs on you, which includes money you never see in your bank account (like Gratuity or Insurance).

## The 4 Components of Salary
To understand your "In-Hand" salary, you must break down your CTC into four buckets:

### 1. Fixed Gross (Monthly)
This is what most people consider their "salary." It includes:
- **Basic Salary:** (Usually 40-50% of CTC).
- **HRA:** (House Rent Allowance).
- **Special Allowance:** (A taxable bucket for everything else).

### 2. Retirals (The "Future" Money)
- **Employer EPF:** 12% of Basic. (Note: Only ₹1,800 is mandatory for many, but many companies do full 12%).
- **Gratuity:** 4.81% of Basic. You only get this if you stay for 5 years!

### 3. Variables (The "Maybe" Money)
- **Performance Bonus:** Conditional on you and the company meeting targets.
- **Joining Bonus:** Often comes with a "clawback" (you must return it if you leave within 1 year).

### 4. Deductions (The "Government" Money)
- **Professional Tax:** ₹200/month.
- **Income Tax (TDS):** Depending on your tax regime.
- **Employee EPF:** Another 12% of Basic deducted from your monthly gross.

## The ₹12 LPA Calculation (2026 Tax Regime)
Let's look at a typical ₹12,00,000 CTC breakdown:

| Component | Yearly | Monthly |
|---|---|---|
| Basic Salary | ₹5,40,000 | ₹45,000 |
| HRA | ₹2,70,000 | ₹22,500 |
| Special Allowance | ₹2,32,000 | ₹19,333 |
| **Gross Salary** | **₹10,42,000** | **₹86,833** |
| Employer EPF | ₹64,800 | ₹5,400 |
| Gratuity | ₹26,000 | ₹2,166 |
| Variable (5%) | ₹60,000 | (N/A) |
| **CTC Total** | **₹12,00,000** | **₹1,00,000** |

### Calculating "In-Hand" from Gross:
Starting Monthly Gross: **₹86,833**
- Deduct Employee EPF: (₹5,400)
- Deduct Professional Tax: (₹200)
- Deduct TDS (Estimated): (₹4,500)
- **Final Monthly Take-Home: ≈ ₹76,733**

**Wait!** Your ₹12 LPA CTC actually yields only **₹76K per month**. That is only 76% of the promised amount.

## 3 Warning Signs in an Offer Letter
1. **Inflated Gratuity:** If a company includes Gratuity in your "Monthly Gross," they are essentially hiding 4.8% of your pay.
2. **Variable Pay > 20%:** If a large part of your salary is variable, your guaranteed income is much lower. Banks often don't consider variable pay for Home Loan eligibility.
3. **EPF Manipulation:** Some companies cap EPF at ₹1,800 to show a higher "Take-Home," but this reduces your long-term savings.

---

## Conclusion
When negotiating, focus on **Fixed Gross** and **Take-Home**, not CTC. If a recruiter says "We are offering 20 LPA," ask: *"What is the monthly fixed gross excluding retirals and variables?"* 

That's the number that pays your rent.`
    },
    {
        id: "seed-4",
        slug: "zero-depreciation-car-insurance-worth-it",
        title: "Zero Depreciation Car Insurance: An Honest Cost-Benefit Analysis",
        excerpt: "Zero Depreciation (or Nil Dep) can make the difference between getting ₹30,000 or ₹50,000 on a claim. But it adds 15–25% to your premium. Here is exactly when it makes financial sense — and when it does not.",
        author: "REXI Legal Team",
        created_at: "2026-02-24T00:00:00Z",
        published: true,
        keywords: ["zero depreciation car insurance india", "nil dep car insurance worth it", "bumper to bumper insurance india", "zero dep add-on"],
        content: `## What is Zero Dep?
In a standard insurance policy, if your car is repaired, the insurer deducts "Depreciation" on the parts replaced. 
- Plastics/Rubber? **50% deduction.**
- Metal? **10-50% deduction.** 

Zero Depreciation (Nil Dep) removes these deductions. The insurer pays for the parts in full.

## The Cost Trap: Plastic vs Metal
Modern cars are mostly plastic (bumpers, headlights, sensors). If you hit a gate and break your bumper, the repair bill might be ₹20,000.

- **Standard Policy:** Insurer says bumper is plastic, so 50% depreciation. They pay ₹10,000. You pay ₹10,000 + deductible.
- **Zero Dep Policy:** Insurer pays ₹20,000. You pay only the deductible (usually ₹1,000).

## When is it Worth It?
| Car Age | Recommendation | Why? |
|---|---|---|
| 0-3 Years | **Mandatory** | Most accidents happen in the early years; parts are expensive. |
| 3-5 Years | **Recommended** | Premium for Zero Dep is lower now, but protection is high. |
| 5-7 Years | **Optional** | Only if parts for your car are hard to find or very expensive. |
| 7+ Years | **Not Worth It** | Most insurers won't even offer it; its cost outweighs the benefit. |

## 3 Hidden Limits of Zero Dep
1. **Claim Count:** Most policies only allow 2 Zero Dep claims per year. The 3rd claim will be processed with normal depreciation.
2. **Compulsory Deductible:** You still have to pay ₹1,000 - ₹2,000 for every claim. Zero Dep is not "free" insurance.
3. **Consumables:** Zero dep covers the parts, but not the nuts, bolts, engine oil, or coolant used. You need a separate "Consumables Cover" for that.

---

## Conclusion
If your car is under 5 years old, Zero Dep is a no-brainer. It costs maybe ₹2,000 extra but saves you ₹20,000 in a single accident.`
    },
    {
        id: "seed-5",
        slug: "pre-existing-disease-waiting-period-health-insurance-india",
        title: "Pre-Existing Disease Waiting Period: What Changed in 2024 and What IRDAI Actually Requires",
        excerpt: "IRDAI reduced the maximum PED waiting period from 48 to 36 months in 2024. But initial waiting periods, specific disease waiting periods, and maternity exclusions still apply. Here is the complete picture — what you must know before you claim.",
        author: "REXI Legal Team",
        created_at: "2026-02-24T00:00:00Z",
        published: true,
        keywords: ["ped waiting period health insurance india", "pre existing disease waiting period irdai", "health insurance waiting period 2024", "waiting period health insurance"],
        content: `## What is a PED?
Any illness documented or treated in the **36 months** before you bought your policy is a Pre-Existing Disease (PED). 

## The 2024 Rule Change
Before 2024, insurers could make you wait up to 4 years (48 months) before covering your PEDs (like Diabetes, BP, or Thyroid). **IRDAI has now capped this at 3 years (36 months).**

### 3 Types of Waiting Periods
1. **Initial Waiting Period (30 Days):** No coverage for ANY illness (except accidents) in the first month.
2. **Specific Disease Waiting Period (24 Months):** Even if not "pre-existing," specific items like Cataract, Hernia, or Joint Replacement usually have a 2-year wait.
3. **PED Waiting Period (12-36 Months):** For conditions you already have.

## The "Disclosure" Death-Trap
If you have Diabetes and you don't tell the insurer, they can reject your claim for a Heart Attack 3 years later, saying it was linked to the undisclosed diabetes.

**The Golden Rule:** Always disclose. A 3-year waiting period is better than a rejected claim for 10 lakhs.

---

## Conclusion
Check your policy for "PED Waiting Period." If it's 4 years, you can now "Port" your policy to a new insurer and force it down to 3 years under the new 2024 rules.`
    },
    {
        id: "seed-6",
        slug: "rent-agreement-11-month-rule-india",
        title: "The 11-Month Rent Agreement: Why It's the Standard and When It Fails You",
        excerpt: "Ever wondered why almost every rent agreement Globally is for exactly 11 months? It wasn't a choice — it's a legal loophole to avoid registration. But this shortcut can leave you vulnerable in court. Here is the legal breakdown.",
        author: "REXI Legal Team",
        created_at: "2026-02-24T00:00:00Z",
        published: true,
        keywords: ["11 month rent agreement india", "rent agreement registration", "leave and license agreement", "rental laws india"],
        content: `## The Registration Secret
Globally, the **Registration Act of 1908** states that any lease of immovable property for more than 12 months must be registered. 

Registration is expensive:
- It requires paying Stamp Duty (usually 1% of total rent).
- It requires a Registration Fee (around ₹1,000+).
- It requires a trip to the Sub-Registrar's office.

By making the agreement for **11 months**, landlords and tenants bypass this law. It is technically a "Leave and License" agreement, not a "Lease."

## The Risk: 11-Month Agreements in Court
If you have a dispute (security deposit not returned or illegal eviction), and you take your 11-month agreement to a judge, there is a catch: 

**Unregistered documents are NOT admissible as primary evidence in court.**

You might still win, but you'll have to pay a "penalty" (often 10x the missing stamp duty) to make the document valid in the eyes of the law during the trial.

## 3 Clauses You Must Check
1. **Maintenance vs Rent:** If your "Rent" is ₹20,000 but the landlord calls ₹5,000 of it "Maintenance," your security deposit should still be calculated on the full ₹20,000. 
2. **Notice Period:** Ensure it is mutual. If the landlord can ask you to leave in 1 month, you should be able to leave in 1 month too.
3. **Lock-in Period:** If you have a 6-month lock-in, you cannot leave even if you lose your job, without paying for the remaining months. 

---

## Conclusion
Use an 11-month agreement for convenience, but for expensive properties or long-term stays, **Insist on Registration**. It is the only way to have the law fully on your side.`
    },
    // FREELANCER BLOG POSTS - Global Audience
    {
        id: "seed-7",
        slug: "freelance-contract-red-flags",
        title: "5 Freelance Contract Clauses That Will Cost You Money (And How to Fix Them)",
        excerpt: "Most freelancers sign contracts without reading them fully. Then they work 3 months, get partially paid, lose portfolio rights, and can't compete in their industry. These 5 clauses are responsible for most of those disasters.",
        author: "REXI Legal Team",
        created_at: "2026-03-04T00:00:00Z",
        published: true,
        keywords: ["freelance contract red flags", "freelance contract clauses", "freelancer contract advice", "client contract review"],
        content: `## Why Most Freelancers Get Burned

Before you read this, ask yourself: when did you last actually read a client contract line by line?

If you're like most freelancers, you scanned it, confirmed the rate and deadline, and signed. That's exactly what clients — and their lawyers — count on.

Here are the 5 clauses that show up most often in freelance contracts and most commonly result in lost money, lost rights, or lost work opportunities.

## 1. Unlimited IP Assignment

**What it sounds like:**
> "All work product, inventions, discoveries, and developments created by Contractor, including those made outside of normal working hours, are the exclusive property of the Company."

**What it actually means:** Everything you create — whether for this client or not — potentially belongs to them. This includes side projects, personal tools, open-source contributions. Courts rarely enforce the "outside working hours" part against freelancers, but you'll spend money proving that.

**How to fix it:** Narrow the clause specifically to the deliverables listed in the contract:
> "IP assignment applies solely to the specific deliverables defined in Schedule A of this agreement and only upon full payment."

## 2. Termination Without Compensation

**What it sounds like:**
> "Client may terminate this agreement at any time, for any reason, with immediate effect."

**What it actually means:** They can fire you after 90 days of work, after you've delivered 10 out of 12 milestones, and owe you nothing for the incomplete project — unless you have milestone payment clauses.

**How to fix it:** Always define what happens on termination:
> "Upon termination, Client shall compensate Freelancer for all work completed to the termination date, calculated on a pro-rata basis of the project fee, payable within 14 days."

## 3. Unlimited Revisions

**What it sounds like:**
> "Freelancer shall revise the deliverables until the Client is satisfied."

**What it actually means:** 'Satisfied' is subjective and undefined. This clause has no end condition. You can be asked to revise indefinitely with no right to refuse or charge extra.

**How to fix it:** Define rounds and escalation:
> "This contract includes 2 rounds of revisions per deliverable. Additional revision rounds are billed at [rate] per hour, invoiced separately."

## 4. No Portfolio Rights

**What it sounds like:**
> "Freelancer shall not disclose, display, or publish any work created under this agreement without prior written approval."

**What it actually means:** You built something great. You cannot show any future client — ever. Your best work is buried.

**How to fix it:** Negotiate explicit portfolio rights:
> "Freelancer may reference this engagement in their professional portfolio as a general description. No confidential client data or unreleased product content shall be disclosed."

## 5. One-Way Late Payment Penalty

**What it sounds like:**
> "Freelancer agrees to complete deliverables by [date]. Late delivery shall incur a penalty of 5% of the project fee per week."

**What it actually means:** You're penalized for being late but there's no equivalent clause making them pay you on time. They can delay payment for 90 days with no consequence.

**How to fix it:** Make it symmetrical:
> "If Client fails to make payment within 14 days of invoice date, a late fee of 1.5% per month applies to the outstanding balance."

---

## The Fastest Way to Check Your Contract

Upload any contract to [REXI's Free Freelance Contract Analyzer](/freelancers) — our AI surfaces all of these clauses instantly and tells you exactly what's risky and what to negotiate.`
    },
    {
        id: "seed-8",
        slug: "what-is-ip-assignment-clause-freelancer",
        title: "IP Assignment Clauses in Freelance Contracts: What You're Actually Signing Away",
        excerpt: "An IP assignment clause can transfer ownership of your code, designs, or writing to a client — including work you created on your own time. Here is exactly what to look for and what to insist on changing.",
        author: "REXI Legal Team",
        created_at: "2026-03-04T00:00:00Z",
        published: true,
        keywords: ["ip assignment clause freelancer", "intellectual property freelance contract", "work for hire freelancer", "ip ownership freelancer"],
        content: `## What is Intellectual Property (IP)?

As a freelancer, your IP is your business. It includes:
- **Code** you write (functions, libraries, entire applications)
- **Designs** you create (logos, UI, illustrations)
- **Writing** you produce (copy, articles, documentation)
- **Inventions and methods** you develop (algorithms, processes)

When you create something for a client, the contract determines who **owns** it. By default in most countries (US, UK, EU), the creator owns the IP unless they have signed it away.

## The Three Types of IP Clauses

### 1. Work-for-Hire (Assignment of All Rights)
The most extreme form. Once created and paid for, the IP belongs entirely to the client. You cannot reuse the work, reference it publicly, or build on it.

> **Typical wording:** "All deliverables shall constitute 'work made for hire' as defined under applicable copyright law, and all rights therein are assigned to Client."

### 2. Exclusive License (Client Has Full Use, You Retain Ownership)
You technically own the IP, but the client has the exclusive right to use it — meaning nobody else can use it, including you in other projects.

> **Typical wording:** "Client is granted an exclusive, worldwide, royalty-free license to use the deliverables."

### 3. Non-Exclusive License (Best for Freelancers)
You retain full ownership. The client can use the work but so can you — reuse components, build similar work for other clients, show it in your portfolio.

> **Ideal wording:** "Freelancer grants Client a perpetual, non-exclusive license to use the deliverables for Client's internal and commercial purposes."

## The Pre-Existing IP Trap

Many freelancers unknowingly sign away code libraries or templates they've developed over years.

**High-risk contract language:** "IP assignment includes all work used or incorporated into the deliverables, whether created before or after this contract."

**What to add:**
> "IP assignment expressly excludes any pre-existing materials, open-source components, or tools owned by Freelancer prior to this engagement. Client is granted a license to use pre-existing IP solely as incorporated in the final deliverables."

## Quick Checklist Before Signing

- [ ] Does IP assignment specifically list only deliverables in this contract?
- [ ] Are your pre-existing tools and libraries excluded?
- [ ] Is the assignment contingent on full payment?
- [ ] Do you have portfolio rights preserved?

Upload your contract to [REXI's Free Freelance Contract Analyzer](/freelancers) to check all of these automatically in 30 seconds.`
    },
    {
        id: "seed-9",
        slug: "non-compete-clause-freelancer-guide",
        title: "Non-Compete Clauses for Freelancers: What's Enforceable and What Isn't",
        excerpt: "A non-compete clause in a freelance contract can lock you out of an entire industry for years. The good news: most are unenforceable. The bad news: defending yourself costs money anyway. Here's the complete guide.",
        author: "REXI Legal Team",
        created_at: "2026-03-04T00:00:00Z",
        published: true,
        keywords: ["non-compete clause freelancer", "non-compete freelance contract", "non-solicitation freelancer", "freelance contract restrictions"],
        content: `## What is a Non-Compete Clause?

A non-compete clause restricts what work you can do after your engagement ends. They come in these forms:

| Type | What it restricts | Typical Enforcement |
|---|---|---|
| Non-Compete | Working in the same industry | Rarely enforced for freelancers |
| Non-Solicitation | Approaching client's customers | Often enforceable if reasonable |
| Non-Poaching | Hiring client's employees | Usually enforceable |
| Exclusivity | Working for competitors during the contract | Can be enforceable |

## Are Non-Competes Legal? (By Country)

- **United States:** State-by-state. California, Minnesota, and North Dakota essentially ban them. Other states enforce them only if "reasonable."
- **United Kingdom:** Enforceable but courts apply strict tests — must protect a legitimate interest and go no further than necessary.
- **European Union:** Generally restrictive for self-employed individuals. Germany and France often require compensation during the non-compete period.
- **India:** Section 27 of the Indian Contract Act makes post-employment restraints largely void. Clauses operative during the contract may be enforced.
- **Australia:** Similar to UK — enforceable only if reasonable in scope and duration.

**The practical problem:** Even an unenforceable clause can cost you significant legal fees to have declared unenforceable. Clients know this.

## The 4-Part Test Courts Apply

1. **Does it protect a legitimate interest?** (Customer relationships, trade secrets — yes. General competition — no.)
2. **Is the geographic scope reasonable?** (City — maybe. Entire globe — almost never.)
3. **Is the time period reasonable?** (6–12 months — possibly. 3 years — unlikely.)
4. **Is the industry scope reasonable?** ("Software development" is too broad. Specific niche — might be acceptable.)

## What to Replace It With

**Too broad (push back):**
> "Freelancer shall not engage in any work for any company in the technology sector for 24 months after contract termination."

**Reasonable alternative:**
> "Freelancer shall not directly solicit Client's identified customers listed in Schedule B for 6 months following contract end. This clause does not restrict Freelancer from working in any industry or for any client that approaches Freelancer independently."

This protects their genuine interest without blocking your career.`
    },
    {
        id: "seed-10",
        slug: "how-to-review-client-contract-freelancer",
        title: "How to Review a Client Contract in 10 Minutes (A Freelancer's Checklist)",
        excerpt: "You don't need a law degree to protect yourself from a bad contract. You need a systematic process. This checklist covers the 8 sections every freelance contract must have — and the 5 questions to ask before signing.",
        author: "REXI Legal Team",
        created_at: "2026-03-04T00:00:00Z",
        published: true,
        keywords: ["how to review freelance contract", "freelance contract checklist", "client contract review", "freelancer legal tips"],
        content: `## The 8 Sections Every Contract Must Have

A contract missing any of these is incomplete — and the gaps will be filled against you in a dispute.

### 1. Scope of Work
A specific, measurable list of deliverables. Not "design the website" — but "design 5 web pages as outlined in Appendix A."

**Red flag:** Vague descriptions that could expand ("and any other related tasks the Client may require").

### 2. Payment Terms
- Total project fee OR hourly rate
- Deposit amount (30–50% upfront is standard)
- Milestone payment schedule
- Due date for final payment
- Late payment penalty

**Red flag:** "Payment upon completion" with no defined completion criteria.

### 3. Timeline and Deadlines
Specific dates for deliverables AND client feedback windows. If you deliver on time but the client takes 3 weeks to give feedback, can they penalize you for "missing" a deadline?

**Add this:** "Client feedback required within [X] business days of delivery. Delay in feedback extends subsequent deadlines by an equal period."

### 4. Revision Policy
A fixed number of revision rounds. "Until satisfied" or "as needed" is open-ended and dangerous.

**Standard terms:** 2–3 rounds of revisions per deliverable. Additional rounds at your hourly rate.

### 5. IP and Ownership
Who owns the work? When does ownership transfer? Do you retain portfolio rights?

**Standard:** IP transfers to client upon full payment only.

### 6. Termination Clause
What happens if the client cancels? Are you paid for completed work? What's the notice period?

**Minimum standard:** Any work completed before termination is paid within 14 days, regardless of reason.

### 7. Confidentiality (NDA)
Is what's "confidential" clearly defined? Does it expire?

### 8. Governing Law and Dispute Resolution
Which country or state's law applies? You don't want to have to go to a foreign court to resolve a payment dispute.

---

## The 5 Questions to Ask Before Signing

1. **"Can I see it with the changes I've requested?"** — If they refuse to negotiate any terms, that's a red flag.
2. **"Who is the legal entity I'm contracting with?"** — Know who you can actually enforce against.
3. **"What counts as project completion?"** — Get a written definition.
4. **"What happens if payment is late?"** — If they have no process, take that as a warning.
5. **"What happens to the IP if the project is cancelled halfway?"** — Their answer reveals their values.

---

Upload your contract to [REXI's Free Freelance Contract Analyzer](/freelancers) for an instant automated review — free, 30 seconds, no account needed.`
    },
    {
        id: "seed-11",
        slug: "freelance-nda-guide-what-to-sign",
        title: "Freelance NDA Guide: What to Sign, What to Refuse, and What to Change",
        excerpt: "Non-disclosure agreements are almost universal in freelancing. Most are heavily client-favored. Here is exactly what a fair NDA looks like — and the 4 clauses you should always push back on.",
        author: "REXI Legal Team",
        created_at: "2026-03-04T00:00:00Z",
        published: true,
        keywords: ["freelance nda guide", "nda freelancer what to look for", "non-disclosure agreement freelancer", "freelance confidentiality agreement"],
        content: `## What is an NDA and Why Freelancers Sign Them

A Non-Disclosure Agreement (NDA) prevents you from sharing a client's confidential information with third parties. As a freelancer, you'll sign NDAs before: starting a new engagement, attending discovery calls, or receiving access to codebases, data, or unreleased products.

NDAs serve a legitimate function. But one-sided, overly broad NDAs can seriously limit your ability to work freely.

## The 3 Types of NDAs

| Type | Direction | Common in freelancing? |
|---|---|---|
| Unilateral (One-way) | Only you are bound | Very common |
| Mutual (Two-way) | Both parties are bound | Less common but fairer |
| Multilateral | Three or more parties | Rare |

## The 4 Clauses You Should Always Challenge

### 1. Undefined Scope of "Confidential"

**Risky wording:**
> "Confidential Information means all information disclosed by Client, whether oral or written, regardless of whether it is marked as 'Confidential'."

**The problem:** Under this definition, anything the client says to you — even a casual message — is legally confidential. You can't reference general project experience.

**Better:**
> "Confidential Information means specifically designated materials marked as 'CONFIDENTIAL' or identified as such in writing within 5 business days of disclosure."

### 2. Perpetual Duration

**Risky wording:**
> "Freelancer's obligations shall survive indefinitely."

**Better:**
> "This Agreement shall remain in effect for 2 years from the date of last disclosure of Confidential Information."

2–3 years is professionally reasonable and standard.

### 3. Restrictions on General Skill Development

**Risky wording:**
> "Freelancer shall not use any knowledge gained during this engagement for any other purpose."

**Better:**
> "The non-use obligation applies only to specific proprietary information identified as Confidential. This Agreement does not restrict Freelancer's use of general knowledge, skills, or expertise retained in unaided memory."

### 4. No Standard Carve-Outs

A properly drafted NDA must exclude:
- Information already publicly known
- Information you knew before the engagement
- Information you develop independently without using their confidential info
- Information received from a third party lawfully

If these carve-outs are absent, insist they be added.

## Red Line: The Pre-Signature NDA

Sometimes clients send an NDA before they'll even discuss the project — before you know the rate or scope.

This is acceptable if the NDA is narrow and time-limited. It is **not** acceptable if the NDA contains non-solicit or IP assignment clauses that activate before you've agreed to any commercial terms.

**Rule:** Never sign an NDA that contains anything other than confidentiality obligations. Payment, IP, and non-compete terms belong only in the main contract.

---

Upload your NDA to [REXI's Free Freelance Contract Analyzer](/freelancers) to flag undefined scope, missing carve-outs, and any IP language that shouldn't be in an NDA. Free and instant.`
    }
];

