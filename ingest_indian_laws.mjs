import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://giprqbnkwhvpigwzhotv.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpcHJxYm5rd2h2cGlnd3pob3R2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODA0MjczOSwiZXhwIjoyMDgzNjE4NzM5fQ.GKLzfywgSE18UH0ln3uIKn3zbp6BYZt3PSfIp-7gId0';
const geminiKey = process.env.GEMINI_API_KEY || 'AIzaSyDKARQBSTtQjVtWk_FoSQZpC8uGYuQ-YTU';

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiKey);

const indianLaws = [
  // CENTRAL LAWS - Contract & Commercial
  {
    id: 'indian-contract-act-1872',
    law_name: 'Indian Contract Act, 1872',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'contract_commercial',
    year_enacted: 1872,
    description: 'The foundational law governing all contracts in India. Defines what constitutes a valid contract, essentials of a contract, void and voidable contracts, performance, breach, and remedies.',
    key_provisions: 'Section 2 (Definitions), Section 10 (Valid Contract Requirements), Section 11 (Capacity to Contract), Section 14 (Free Consent), Section 23 (Lawful Consideration), Section 27 (Restraint of Trade), Section 28 (Restraint of Legal Proceedings), Section 56 (Frustration), Section 73-74 (Damages and Penalties), Section 124-147 (Indemnity and Guarantee), Section 148-181 (Bailment and Pledge), Section 182-238 (Agency)',
    contract_relevance: 'Every contract must comply with this Act. Key areas: offer and acceptance must be clear, consideration must be lawful, parties must have capacity, consent must be free from coercion/undue influence/fraud/misrepresentation, object must be lawful.',
    common_violations: 'Contracts with minors, contracts under coercion or undue influence, contracts restraining trade unreasonably, contracts with unlawful consideration, penalty clauses exceeding reasonable damages',
    penalties: 'Contracts violating provisions are void or voidable. Damages as per Section 73-74. No criminal penalties but civil liability for breach.'
  },
  {
    id: 'sale-of-goods-act-1930',
    law_name: 'Sale of Goods Act, 1930',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'contract_commercial',
    year_enacted: 1930,
    description: 'Governs contracts for sale of goods. Defines sale, agreement to sell, conditions and warranties, transfer of property, rights of unpaid seller.',
    key_provisions: 'Section 4 (Sale and Agreement to Sell), Section 12-17 (Conditions and Warranties), Section 18-24 (Transfer of Property), Section 27 (Sale by Non-Owner), Section 45-54 (Rights of Unpaid Seller), Implied Conditions as to Title, Quality, Fitness',
    contract_relevance: 'All contracts involving sale of movable goods must comply. Implied warranties on quality, fitness for purpose, merchantability apply unless expressly excluded.',
    common_violations: 'Excluding implied warranties unfairly, selling goods without title, misrepresenting goods, unfair return/refund policies',
    penalties: 'Buyer can reject goods, claim damages, rescind contract. Seller can sue for price, damages, or exercise lien.'
  },
  {
    id: 'indian-partnership-act-1932',
    law_name: 'Indian Partnership Act, 1932',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'contract_commercial',
    year_enacted: 1932,
    description: 'Governs formation, operation, and dissolution of partnership firms. Defines partner duties, liabilities, and rights.',
    key_provisions: 'Section 4 (Partnership Definition), Section 9 (General Duties), Section 11-17 (Partner Relations), Section 18-22 (Relations with Third Parties), Section 25-30 (Incoming/Outgoing Partners), Section 40-55 (Dissolution)',
    contract_relevance: 'Partnership agreements must specify profit sharing, capital contribution, partner duties, retirement provisions, dispute resolution, non-compete clauses.',
    common_violations: 'Unlimited liability not disclosed, unregistered firms, improper profit distribution, lack of dissolution terms',
    penalties: 'Unregistered firms cannot sue. Partners have unlimited personal liability. Disputes resolved as per agreement or Act provisions.'
  },
  {
    id: 'llp-act-2008',
    law_name: 'Limited Liability Partnership Act, 2008',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'contract_commercial',
    year_enacted: 2008,
    description: 'Provides for formation and regulation of limited liability partnerships, combining flexibility of partnership with limited liability.',
    key_provisions: 'Section 3 (LLP as Body Corporate), Section 7 (Incorporation), Section 23 (Partner Rights and Duties), Section 27-28 (Liability of Partners), Section 34-38 (Winding Up)',
    contract_relevance: 'LLP agreements must be filed with Registrar, specify partner contributions, profit sharing, designated partners, amendments procedure.',
    common_violations: 'Not filing LLP agreement, inadequate designated partners, failure to maintain minimum compliance',
    penalties: 'Fines up to Rs 5 lakh for non-compliance. Striking off for dormant LLPs. Personal liability if acting fraudulently.'
  },

  // Consumer Protection
  {
    id: 'consumer-protection-act-2019',
    law_name: 'Consumer Protection Act, 2019',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'consumer_protection',
    year_enacted: 2019,
    description: 'Modern consumer protection law covering e-commerce, product liability, unfair contracts, misleading advertisements. Replaces 1986 Act.',
    key_provisions: 'Section 2(9) (Unfair Contract Definition), Section 47 (Product Liability), Section 84-87 (Central Consumer Protection Authority), Section 89 (Misleading Advertisements), Schedule I (Unfair Contract Terms)',
    contract_relevance: 'Consumer contracts cannot contain unfair terms like one-sided termination, unreasonable penalties, unilateral changes, limitation of liability for negligence, automatic renewal without consent.',
    common_violations: 'Unfair contract terms, misleading claims, defective products without remedy, hidden charges, one-sided arbitration clauses',
    penalties: 'Compensation up to Rs 50 lakh (District), Rs 10 crore (State), unlimited (National). Imprisonment up to 5 years for misleading ads.'
  },
  {
    id: 'competition-act-2002',
    law_name: 'Competition Act, 2002',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'consumer_protection',
    year_enacted: 2002,
    description: 'Prevents anti-competitive agreements, abuse of dominant position, regulates combinations. Competition Commission of India (CCI) enforcement.',
    key_provisions: 'Section 3 (Anti-Competitive Agreements), Section 4 (Abuse of Dominance), Section 5-6 (Combinations/Mergers), Section 27 (Penalties)',
    contract_relevance: 'Contracts cannot fix prices, limit production, share markets, rig bids, create tie-in arrangements. Exclusive dealing must not be anti-competitive.',
    common_violations: 'Price fixing, market allocation, resale price maintenance, exclusive supply arrangements, predatory pricing',
    penalties: 'Penalty up to 10% of average turnover for last 3 years. Individual penalties. Agreements void.'
  },

  // Employment & Labour
  {
    id: 'industrial-disputes-act-1947',
    law_name: 'Industrial Disputes Act, 1947',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'employment_labour',
    year_enacted: 1947,
    description: 'Governs investigation and settlement of industrial disputes. Covers layoffs, retrenchment, closure, strikes and lockouts.',
    key_provisions: 'Section 2A (Dismissal/Discharge as Industrial Dispute), Section 9A (Notice of Change), Section 25F (Retrenchment Conditions), Section 25N (Prior Permission for Retrenchment), Chapter VA (Layoff/Retrenchment)',
    contract_relevance: 'Employment contracts must provide proper termination procedures, notice periods, retrenchment compensation (15 days wages per year), standing orders compliance.',
    common_violations: 'Wrongful termination, inadequate notice, no retrenchment compensation, unfair labour practices, change in service conditions without notice',
    penalties: 'Reinstatement with back wages, compensation, criminal penalties for unfair labour practices.'
  },
  {
    id: 'payment-of-gratuity-act-1972',
    law_name: 'Payment of Gratuity Act, 1972',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'employment_labour',
    year_enacted: 1972,
    description: 'Provides for gratuity payment to employees on termination after 5 years of continuous service.',
    key_provisions: 'Section 4 (Gratuity Calculation - 15 days wages per year), Section 4(6) (Maximum Gratuity Rs 20 lakh), Section 7 (Forfeiture Conditions)',
    contract_relevance: 'Employment contracts cannot waive gratuity rights. Gratuity payable on resignation, retirement, death, disablement after 5 years service.',
    common_violations: 'Not paying gratuity, miscalculating service period, wrongful forfeiture, exceeding maximum limit deductions',
    penalties: 'Imprisonment up to 2 years and/or fine up to Rs 20,000 for non-payment.'
  },
  {
    id: 'epf-act-1952',
    law_name: 'Employees Provident Funds and Miscellaneous Provisions Act, 1952',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'employment_labour',
    year_enacted: 1952,
    description: 'Mandatory provident fund, pension scheme, and deposit-linked insurance for employees. Applies to establishments with 20+ employees.',
    key_provisions: 'Section 6 (Contribution - 12% basic wages), Section 7A (Determination of Dues), Section 14 (Penalties), EPF Scheme 1952, EPS Scheme 1995',
    contract_relevance: 'Employment contracts must comply with EPF deductions. Cannot contract out of EPF. Basic wages definition affects contribution.',
    common_violations: 'Non-registration, delayed contributions, incorrect basic wages, not providing UAN, deducting but not depositing',
    penalties: 'Imprisonment up to 3 years and fine up to Rs 10,000. Interest on delayed payments.'
  },
  {
    id: 'payment-of-bonus-act-1965',
    law_name: 'Payment of Bonus Act, 1965',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'employment_labour',
    year_enacted: 1965,
    description: 'Provides for payment of annual bonus to employees in establishments with 20+ employees. Minimum 8.33%, maximum 20% of wages.',
    key_provisions: 'Section 8 (Eligibility - Salary up to Rs 21,000/month), Section 10 (Minimum Bonus 8.33%), Section 11 (Maximum Bonus 20%), Section 12 (Calculation Basis)',
    contract_relevance: 'Employment contracts cannot exclude statutory bonus. Bonus calculation based on available surplus and allocable surplus formula.',
    common_violations: 'Not paying minimum bonus, excluding eligible employees, wrong calculation, delayed payment',
    penalties: 'Imprisonment up to 6 months and/or fine up to Rs 1,000.'
  },

  // Financial Services
  {
    id: 'rbi-act-1934',
    law_name: 'Reserve Bank of India Act, 1934',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'financial_services',
    year_enacted: 1934,
    description: 'Establishes RBI as central bank. Governs monetary policy, bank regulation, foreign exchange management.',
    key_provisions: 'Section 17 (RBI Functions), Section 21-22 (Banker to Government), Section 42 (CRR), Section 45 (Emergency Provisions)',
    contract_relevance: 'Financial contracts must comply with RBI circulars on lending rates, forex transactions, payment systems, KYC requirements.',
    common_violations: 'Unauthorized forex transactions, non-compliance with lending norms, KYC failures, unauthorized banking activities',
    penalties: 'Heavy fines, license cancellation, criminal prosecution for unauthorized banking.'
  },
  {
    id: 'banking-regulation-act-1949',
    law_name: 'Banking Regulation Act, 1949',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'financial_services',
    year_enacted: 1949,
    description: 'Regulates banking companies in India. Covers licensing, capital requirements, restrictions on business, reserve requirements.',
    key_provisions: 'Section 5 (Banking Definitions), Section 6 (Permissible Business), Section 21 (Interest Rates), Section 35A (RBI Directions), Section 36AE (Moratorium)',
    contract_relevance: 'Loan agreements must comply with RBI interest rate directives, disclosure requirements, fair lending practices.',
    common_violations: 'Excessive interest rates, hidden charges, unfair recovery practices, non-disclosure of terms',
    penalties: 'Fines, license cancellation, restrictions on business activities.'
  },
  {
    id: 'sarfaesi-act-2002',
    law_name: 'Securitisation and Reconstruction of Financial Assets and Enforcement of Security Interest Act, 2002 (SARFAESI)',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'financial_services',
    year_enacted: 2002,
    description: 'Enables banks and financial institutions to recover NPAs without court intervention. Asset reconstruction companies, security enforcement.',
    key_provisions: 'Section 13 (Enforcement of Security Interest), Section 13(2) (60-day Notice), Section 14 (Possession by CMM), Section 17 (Appeal to DRT)',
    contract_relevance: 'Loan and security agreements must specify SARFAESI applicability. Borrowers have right to object within 60 days of notice.',
    common_violations: 'Not serving proper notice, incorrect outstanding calculation, not considering objections, taking possession of exempt assets',
    penalties: 'Actions can be challenged before DRT. Compensation for wrongful possession.'
  },
  {
    id: 'nbfc-regulations',
    law_name: 'NBFC Regulations (RBI Master Directions)',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'financial_services',
    year_enacted: 2016,
    description: 'RBI regulations for Non-Banking Financial Companies covering registration, prudential norms, fair practices, digital lending.',
    key_provisions: 'Registration Requirements, Capital Adequacy (15% CRAR), Asset Classification, Fair Practices Code, Digital Lending Guidelines 2022, Interest Rate Disclosure',
    contract_relevance: 'NBFC loan agreements must disclose all-inclusive interest rate, processing fees, penal charges. Digital loans require cooling-off period.',
    common_violations: 'Excessive interest rates, hidden charges, unfair recovery practices, digital lending without physical consent forms',
    penalties: 'Registration cancellation, fines, criminal action for unauthorized NBFC activities.'
  },

  // Real Estate
  {
    id: 'rera-2016',
    law_name: 'Real Estate (Regulation and Development) Act, 2016 (RERA)',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'real_estate',
    year_enacted: 2016,
    description: 'Regulates real estate sector. Mandatory registration of projects, standardized agreements, escrow accounts, timely delivery.',
    key_provisions: 'Section 3 (Project Registration), Section 4 (Registration Details), Section 11 (Developer Obligations), Section 13 (Agreement for Sale), Section 14 (Adherence to Plans), Section 18 (Return with Interest), Section 19 (Buyer Rights)',
    contract_relevance: 'Real estate agreements must be as per RERA model. 70% funds in escrow. Carpet area basis pricing. 5-year structural warranty. Interest for delays.',
    common_violations: 'Unregistered projects, deviation from approved plans, delay without compensation, not maintaining escrow, unfair agreement terms',
    penalties: 'Up to 10% project cost penalty. Imprisonment up to 3 years. Registration cancellation.'
  },
  {
    id: 'transfer-of-property-act-1882',
    law_name: 'Transfer of Property Act, 1882',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'real_estate',
    year_enacted: 1882,
    description: 'Governs transfer of property between living persons. Covers sale, mortgage, lease, exchange, gift of immovable property.',
    key_provisions: 'Section 5 (Transfer Definition), Section 54 (Sale of Immovable Property), Section 58 (Mortgage Types), Section 105-117 (Leases), Section 122 (Gift)',
    contract_relevance: 'Property sale agreements must specify property description, price, payment terms, possession date, title warranties. Lease terms, rent, duration, renewal must be clear.',
    common_violations: 'Defective title transfer, unregistered sale deeds, unclear property description, missing encumbrance disclosure',
    penalties: 'Unregistered documents not admissible as evidence. Specific performance or damages for breach.'
  },
  {
    id: 'registration-act-1908',
    law_name: 'Registration Act, 1908',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'real_estate',
    year_enacted: 1908,
    description: 'Mandates registration of certain documents including property transfers above Rs 100, leases over 1 year.',
    key_provisions: 'Section 17 (Compulsory Registration), Section 18 (Optional Registration), Section 23 (Time for Registration - 4 months), Section 49 (Effect of Non-Registration)',
    contract_relevance: 'Property documents must be registered within 4 months of execution. Unregistered documents cannot be used as evidence of title.',
    common_violations: 'Not registering compulsory documents, delayed registration, incorrect stamp duty, false declarations',
    penalties: 'Unregistered documents inadmissible. Additional stamp duty and penalty for delayed registration.'
  },

  // Data Protection & Cyber
  {
    id: 'dpdp-act-2023',
    law_name: 'Digital Personal Data Protection Act, 2023 (DPDP)',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'data_protection_cyber',
    year_enacted: 2023,
    description: 'India comprehensive data protection law. Covers personal data processing, consent, data principal rights, cross-border transfers, penalties.',
    key_provisions: 'Section 4 (Lawful Processing Grounds), Section 5-6 (Notice and Consent), Section 8 (Data Fiduciary Duties), Section 11 (Data Principal Rights), Section 16 (Cross-Border Transfer), Section 33 (Penalties up to Rs 250 crore)',
    contract_relevance: 'Contracts involving personal data must specify purpose, consent mechanism, data retention, security measures, cross-border transfer safeguards, grievance redressal.',
    common_violations: 'Processing without consent, excessive data collection, inadequate security, not honoring deletion requests, unauthorized cross-border transfers',
    penalties: 'Up to Rs 250 crore for significant data fiduciaries. Up to Rs 200 crore for breach notification failure.'
  },
  {
    id: 'it-act-2000',
    law_name: 'Information Technology Act, 2000',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'data_protection_cyber',
    year_enacted: 2000,
    description: 'Legal recognition of electronic records and signatures, cyber crimes, intermediary liability, data protection (Section 43A).',
    key_provisions: 'Section 43 (Computer Damage Compensation), Section 43A (Data Protection - Sensitive Personal Data), Section 66 (Computer Related Offences), Section 72A (Disclosure of Information), Section 79 (Intermediary Liability)',
    contract_relevance: 'Electronic contracts valid. Reasonable security practices required for sensitive personal data. Intermediary safe harbor with due diligence.',
    common_violations: 'Inadequate data security, unauthorized access, disclosure of personal information, not following IT Rules 2011',
    penalties: 'Compensation under Section 43A. Criminal penalties for cyber crimes. Up to Rs 5 crore for data breaches.'
  },

  // Corporate & Securities
  {
    id: 'companies-act-2013',
    law_name: 'Companies Act, 2013',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'corporate_securities',
    year_enacted: 2013,
    description: 'Governs incorporation, management, and winding up of companies. Director duties, shareholder rights, related party transactions.',
    key_provisions: 'Section 166 (Director Duties), Section 185-186 (Loans to Directors/Inter-corporate), Section 188 (Related Party Transactions), Section 230-232 (Mergers), Section 447 (Fraud)',
    contract_relevance: 'Related party contracts need board/shareholder approval. Director conflict disclosure. Loans to directors prohibited. Proper authority to contract.',
    common_violations: 'Unauthorized related party transactions, director conflict of interest, improper delegation, fraud',
    penalties: 'Imprisonment up to 10 years for fraud. Fines, disqualification of directors.'
  },
  {
    id: 'sebi-act-1992',
    law_name: 'Securities and Exchange Board of India Act, 1992',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'corporate_securities',
    year_enacted: 1992,
    description: 'Establishes SEBI as securities market regulator. Investor protection, market regulation, prohibition of insider trading and fraudulent practices.',
    key_provisions: 'Section 11 (SEBI Functions), Section 11B (Directions), Section 12A (Prohibition of Manipulation), Section 15 (Penalties)',
    contract_relevance: 'Contracts involving securities must comply with SEBI regulations - LODR, Takeover Code, Insider Trading Regulations.',
    common_violations: 'Insider trading, market manipulation, non-disclosure, fraudulent inducement to invest',
    penalties: 'Penalty up to Rs 25 crore or 3x profit. Disgorgement. Criminal prosecution.'
  },

  // Intellectual Property
  {
    id: 'copyright-act-1957',
    law_name: 'Copyright Act, 1957',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'intellectual_property',
    year_enacted: 1957,
    description: 'Protects original literary, dramatic, musical, artistic works, cinematograph films, sound recordings. Work-for-hire provisions.',
    key_provisions: 'Section 14 (Copyright Rights), Section 17 (First Owner), Section 18-19 (Assignment), Section 30 (Licensing), Section 51 (Infringement), Section 63 (Criminal Penalties)',
    contract_relevance: 'IP assignment must be in writing. Work-for-hire clarification needed. License terms, territory, duration must be specified.',
    common_violations: 'Unclear IP ownership, invalid assignments, infringement, unauthorized reproduction',
    penalties: 'Imprisonment 6 months to 3 years. Fine Rs 50,000 to Rs 2 lakh. Damages and injunction.'
  },
  {
    id: 'trademarks-act-1999',
    law_name: 'Trade Marks Act, 1999',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'intellectual_property',
    year_enacted: 1999,
    description: 'Provides for registration and protection of trademarks. Infringement, passing off, assignment and licensing.',
    key_provisions: 'Section 28 (Rights Conferred), Section 29 (Infringement), Section 37-44 (Assignment and Transmission), Section 45-50 (Licensing)',
    contract_relevance: 'Trademark licenses must be recorded. Quality control provisions. Assignment with/without goodwill. Franchise agreements need trademark provisions.',
    common_violations: 'Unrecorded licenses, quality control failures, infringement, passing off, dilution',
    penalties: 'Imprisonment 6 months to 3 years. Fine Rs 50,000 to Rs 2 lakh. Injunction and damages.'
  },
  {
    id: 'patents-act-1970',
    law_name: 'Patents Act, 1970',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'intellectual_property',
    year_enacted: 1970,
    description: 'Provides for patent grant and protection. Novelty, inventive step, industrial application requirements. Compulsory licensing.',
    key_provisions: 'Section 48 (Patent Rights), Section 68-70 (Assignment and Licensing), Section 84-92 (Compulsory License), Section 104 (Infringement Suit)',
    contract_relevance: 'Patent assignments must be registered. License terms must specify field of use, territory, exclusivity. Employee invention clauses.',
    common_violations: 'Unregistered assignments, broad scope claims, infringement, inadequate employee invention provisions',
    penalties: 'Injunction, damages, account of profits for infringement. Compulsory license for non-working.'
  },

  // Dispute Resolution
  {
    id: 'arbitration-act-1996',
    law_name: 'Arbitration and Conciliation Act, 1996',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'dispute_resolution',
    year_enacted: 1996,
    description: 'Governs domestic and international arbitration. Arbitration agreement requirements, arbitrator appointment, award enforcement.',
    key_provisions: 'Section 7 (Arbitration Agreement), Section 11 (Arbitrator Appointment), Section 34 (Setting Aside Award), Section 36 (Enforcement), Part II (International Arbitration)',
    contract_relevance: 'Arbitration clauses must be clear on seat, governing law, arbitrator selection, institutional rules, language, costs allocation.',
    common_violations: 'Unclear arbitration clauses, unilateral appointment rights, waiver of appeal rights beyond permissible limits, unconscionable fee allocation',
    penalties: 'Invalid arbitration agreement leads to court litigation. Awards can be set aside for procedural irregularities.'
  },

  // Insurance
  {
    id: 'insurance-act-1938',
    law_name: 'Insurance Act, 1938',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'insurance',
    year_enacted: 1938,
    description: 'Regulates insurance business in India. Licensing, capital requirements, policy terms, claim settlement.',
    key_provisions: 'Section 41 (Rebating Prohibition), Section 45 (Claim Repudiation Limit - 3 years), Section 64VB (No Risk Without Premium)',
    contract_relevance: 'Insurance policies must comply with IRDAI regulations. Material disclosure requirements. 3-year contestability period for repudiation.',
    common_violations: 'Non-disclosure of material facts, unreasonable claim rejection, rebating, unfair policy terms',
    penalties: 'License cancellation, fines, criminal prosecution for fraud.'
  },

  // STATE LAWS - RERA
  {
    id: 'maharera',
    law_name: 'Maharashtra RERA (MahaRERA)',
    law_type: 'state',
    jurisdiction: 'maharashtra',
    category: 'real_estate',
    year_enacted: 2017,
    description: 'Maharashtra implementation of RERA. Additional provisions on carpet area calculation, project registration, complaint mechanism.',
    key_provisions: 'MahaRERA Rules 2017, Carpet Area Definition, Project Registration Portal, Complaint Filing, Conciliation Forum',
    contract_relevance: 'Maharashtra real estate agreements must be MahaRERA compliant. Use prescribed agreement format. Disclose all approvals and project details.',
    common_violations: 'Not using prescribed format, false carpet area claims, not updating project status, delay without compensation',
    penalties: 'As per RERA plus state-specific enforcement mechanisms.'
  },
  {
    id: 'karnataka-rera',
    law_name: 'Karnataka RERA (K-RERA)',
    law_type: 'state',
    jurisdiction: 'karnataka',
    category: 'real_estate',
    year_enacted: 2017,
    description: 'Karnataka implementation of RERA with state-specific rules for Bangalore and other cities.',
    key_provisions: 'Karnataka RERA Rules 2017, Project Registration, Escrow Account, Complaint Mechanism, Appellate Tribunal',
    contract_relevance: 'Karnataka real estate agreements must comply with K-RERA. Bangalore-specific requirements for project registration.',
    common_violations: 'Unregistered projects, deviation from plans, escrow non-compliance, unfair agreement terms',
    penalties: 'As per RERA with Karnataka-specific enforcement.'
  },
  {
    id: 'up-rera',
    law_name: 'Uttar Pradesh RERA (UP-RERA)',
    law_type: 'state',
    jurisdiction: 'uttar_pradesh',
    category: 'real_estate',
    year_enacted: 2017,
    description: 'UP implementation of RERA covering Noida, Greater Noida, Lucknow and other cities.',
    key_provisions: 'UP RERA Rules 2016, Noida-specific provisions, Project Registration, NCR provisions',
    contract_relevance: 'UP real estate agreements especially in Noida/Greater Noida must be UP-RERA compliant.',
    common_violations: 'Legacy project issues, delayed possession, unregistered projects',
    penalties: 'As per RERA with UP-specific enforcement.'
  },
  {
    id: 'delhi-rera',
    law_name: 'Delhi RERA',
    law_type: 'state',
    jurisdiction: 'delhi',
    category: 'real_estate',
    year_enacted: 2017,
    description: 'Delhi implementation of RERA for NCT of Delhi.',
    key_provisions: 'Delhi RERA Rules 2017, Project Registration, DDA coordination, Complaint Mechanism',
    contract_relevance: 'Delhi real estate agreements must be RERA compliant with DDA master plan alignment.',
    common_violations: 'Non-compliance with DDA norms, unregistered projects, delay compensation',
    penalties: 'As per RERA with Delhi-specific enforcement.'
  },
  {
    id: 'gujarat-rera',
    law_name: 'Gujarat RERA (GujRERA)',
    law_type: 'state',
    jurisdiction: 'gujarat',
    category: 'real_estate',
    year_enacted: 2017,
    description: 'Gujarat implementation of RERA covering Ahmedabad, Surat, Vadodara and other cities.',
    key_provisions: 'Gujarat RERA Rules 2017, Project Registration, Escrow Requirements, AUDA/SUDA coordination',
    contract_relevance: 'Gujarat real estate agreements must be GujRERA compliant.',
    common_violations: 'Unregistered projects, false claims, escrow non-compliance',
    penalties: 'As per RERA with Gujarat-specific enforcement.'
  },
  {
    id: 'tamil-nadu-rera',
    law_name: 'Tamil Nadu RERA (TNRERA)',
    law_type: 'state',
    jurisdiction: 'tamil_nadu',
    category: 'real_estate',
    year_enacted: 2017,
    description: 'Tamil Nadu implementation of RERA covering Chennai and other cities.',
    key_provisions: 'TN RERA Rules 2017, CMDA coordination, Project Registration, Complaint Mechanism',
    contract_relevance: 'Tamil Nadu real estate agreements must be TNRERA compliant.',
    common_violations: 'CMDA approval issues, unregistered projects, delay without compensation',
    penalties: 'As per RERA with Tamil Nadu-specific enforcement.'
  },
  {
    id: 'telangana-rera',
    law_name: 'Telangana RERA (TS-RERA)',
    law_type: 'state',
    jurisdiction: 'telangana',
    category: 'real_estate',
    year_enacted: 2017,
    description: 'Telangana implementation of RERA covering Hyderabad and other areas.',
    key_provisions: 'Telangana RERA Rules 2017, HMDA coordination, Project Registration',
    contract_relevance: 'Telangana real estate agreements must be TS-RERA compliant.',
    common_violations: 'Unregistered projects, HMDA approval issues, unfair terms',
    penalties: 'As per RERA with Telangana-specific enforcement.'
  },
  {
    id: 'haryana-rera',
    law_name: 'Haryana RERA (H-RERA)',
    law_type: 'state',
    jurisdiction: 'haryana',
    category: 'real_estate',
    year_enacted: 2017,
    description: 'Haryana implementation of RERA covering Gurugram, Faridabad and NCR areas.',
    key_provisions: 'Haryana RERA Rules 2017, Gurugram specific provisions, NCR coordination, Legacy Projects',
    contract_relevance: 'Haryana real estate agreements especially in Gurugram must be H-RERA compliant.',
    common_violations: 'Legacy project delays, unfair agreement terms, escrow non-compliance',
    penalties: 'As per RERA with Haryana-specific enforcement.'
  },
  {
    id: 'west-bengal-hira',
    law_name: 'West Bengal Housing Industry Regulation Act (HIRA)',
    law_type: 'state',
    jurisdiction: 'west_bengal',
    category: 'real_estate',
    year_enacted: 2017,
    description: 'West Bengal own real estate regulation act (not RERA). Different provisions from central RERA.',
    key_provisions: 'HIRA 2017, WBHIRA Authority, Project Registration, Different escrow requirements (50% vs 70%)',
    contract_relevance: 'West Bengal real estate agreements must comply with HIRA (not central RERA). Note different escrow requirements.',
    common_violations: 'Non-compliance with HIRA specific provisions, treating it as RERA',
    penalties: 'As per HIRA specific provisions.'
  },
  {
    id: 'rajasthan-rera',
    law_name: 'Rajasthan RERA',
    law_type: 'state',
    jurisdiction: 'rajasthan',
    category: 'real_estate',
    year_enacted: 2017,
    description: 'Rajasthan implementation of RERA covering Jaipur, Jodhpur and other cities.',
    key_provisions: 'Rajasthan RERA Rules 2017, JDA coordination, Project Registration',
    contract_relevance: 'Rajasthan real estate agreements must be RERA compliant.',
    common_violations: 'Unregistered projects, JDA approval issues',
    penalties: 'As per RERA with Rajasthan-specific enforcement.'
  },
  {
    id: 'mp-rera',
    law_name: 'Madhya Pradesh RERA (MP-RERA)',
    law_type: 'state',
    jurisdiction: 'madhya_pradesh',
    category: 'real_estate',
    year_enacted: 2017,
    description: 'Madhya Pradesh implementation of RERA covering Bhopal, Indore and other cities.',
    key_provisions: 'MP RERA Rules 2017, Project Registration, Escrow Requirements',
    contract_relevance: 'Madhya Pradesh real estate agreements must be MP-RERA compliant.',
    common_violations: 'Unregistered projects, escrow non-compliance',
    penalties: 'As per RERA with MP-specific enforcement.'
  },
  {
    id: 'kerala-rera',
    law_name: 'Kerala RERA (K-RERA)',
    law_type: 'state',
    jurisdiction: 'kerala',
    category: 'real_estate',
    year_enacted: 2018,
    description: 'Kerala implementation of RERA covering Kochi, Trivandrum and other cities.',
    key_provisions: 'Kerala RERA Rules 2018, Project Registration, Complaint Mechanism',
    contract_relevance: 'Kerala real estate agreements must be K-RERA compliant.',
    common_violations: 'Unregistered projects, delay without compensation',
    penalties: 'As per RERA with Kerala-specific enforcement.'
  },
  {
    id: 'punjab-rera',
    law_name: 'Punjab RERA',
    law_type: 'state',
    jurisdiction: 'punjab',
    category: 'real_estate',
    year_enacted: 2017,
    description: 'Punjab implementation of RERA covering Chandigarh region, Ludhiana and other cities.',
    key_provisions: 'Punjab RERA Rules 2017, Project Registration, GMADA coordination',
    contract_relevance: 'Punjab real estate agreements must be Punjab RERA compliant.',
    common_violations: 'Unregistered projects, delay without compensation',
    penalties: 'As per RERA with Punjab-specific enforcement.'
  },

  // STATE LAWS - Stamp Duty
  {
    id: 'maharashtra-stamp-act',
    law_name: 'Maharashtra Stamp Act, 1958',
    law_type: 'state',
    jurisdiction: 'maharashtra',
    category: 'stamp_duty',
    year_enacted: 1958,
    description: 'State stamp duty law for Maharashtra. Different rates for different instruments. E-stamping mandatory.',
    key_provisions: 'Schedule I (Stamp Duty Rates), Article 25 (Conveyance - 5-6%), Article 36 (Lease), Ready Reckoner Values',
    contract_relevance: 'All agreements in Maharashtra must be adequately stamped. Property agreements based on ready reckoner values. Different rates for different areas.',
    common_violations: 'Understamping, incorrect instrument classification, ready reckoner evasion',
    penalties: 'Penalty up to 10x deficient duty plus interest. Document may not be admissible.'
  },
  {
    id: 'karnataka-stamp-act',
    law_name: 'Karnataka Stamp Act, 1957',
    law_type: 'state',
    jurisdiction: 'karnataka',
    category: 'stamp_duty',
    year_enacted: 1957,
    description: 'State stamp duty law for Karnataka with Bangalore-specific provisions.',
    key_provisions: 'Stamp Duty Rates (Conveyance 5.6% in urban, 5% in rural), Guidance Values, E-stamping',
    contract_relevance: 'Karnataka agreements must comply with state stamp duty. Different rates for BBMP, rural, and other areas.',
    common_violations: 'Understamping, incorrect guidance value declaration',
    penalties: 'Penalty plus interest for deficient stamp duty.'
  },
  {
    id: 'delhi-stamp-act',
    law_name: 'Indian Stamp Act (Delhi Amendment)',
    law_type: 'state',
    jurisdiction: 'delhi',
    category: 'stamp_duty',
    year_enacted: 1899,
    description: 'Stamp duty provisions for NCT Delhi as per Delhi amendments to Indian Stamp Act.',
    key_provisions: 'Conveyance Duty (Male 6%, Female 4%), Circle Rates, E-stamping',
    contract_relevance: 'Delhi property agreements based on circle rates. Different rates for male/female buyers.',
    common_violations: 'Circle rate undervaluation, gender-based duty avoidance schemes',
    penalties: 'Penalty for deficient stamp duty, prosecution possible.'
  },

  // STATE LAWS - Shops and Establishments
  {
    id: 'maharashtra-shops-establishments',
    law_name: 'Maharashtra Shops and Establishments Act, 2017',
    law_type: 'state',
    jurisdiction: 'maharashtra',
    category: 'employment_labour',
    year_enacted: 2017,
    description: 'Regulates working conditions in Maharashtra shops and commercial establishments. Registration, working hours, leave, employment conditions.',
    key_provisions: 'Section 7 (Registration), Section 10 (Working Hours - 9 hours/day, 48 hours/week), Section 15 (Overtime 2x wages), Section 17-19 (Leave Provisions), Section 24 (Women Working Hours)',
    contract_relevance: 'Employment contracts in Maharashtra must comply with working hours, overtime, leave provisions. Registration mandatory.',
    common_violations: 'No registration, excessive working hours, no overtime pay, inadequate leave',
    penalties: 'Fine up to Rs 50,000 for first offence, Rs 1 lakh for subsequent.'
  },
  {
    id: 'karnataka-shops-establishments',
    law_name: 'Karnataka Shops and Commercial Establishments Act, 1961',
    law_type: 'state',
    jurisdiction: 'karnataka',
    category: 'employment_labour',
    year_enacted: 1961,
    description: 'Regulates shops and establishments in Karnataka including IT/ITES exemptions.',
    key_provisions: 'Registration Requirements, Working Hours (48 hours/week), Overtime, Leave Provisions, IT Sector Exemptions',
    contract_relevance: 'Karnataka employment contracts must comply. IT sector has different provisions for working hours.',
    common_violations: 'No registration, overtime violations, inadequate leave',
    penalties: 'Fines and potential prosecution.'
  },
  {
    id: 'delhi-shops-establishments',
    law_name: 'Delhi Shops and Establishments Act, 1954',
    law_type: 'state',
    jurisdiction: 'delhi',
    category: 'employment_labour',
    year_enacted: 1954,
    description: 'Regulates working conditions in Delhi shops and establishments.',
    key_provisions: 'Registration, Working Hours (9 hours/day), Weekly Holiday, Leave Provisions, Closure Hours',
    contract_relevance: 'Delhi employment contracts must ensure compliance with working hours and leave provisions.',
    common_violations: 'Operating beyond permitted hours, no weekly holiday, inadequate leave',
    penalties: 'Fines for non-compliance.'
  },

  // MUNICIPAL/LOCAL LAWS
  {
    id: 'pmc-dcr',
    law_name: 'Pune Municipal Corporation Development Control Rules',
    law_type: 'municipal',
    jurisdiction: 'pune',
    category: 'building_development',
    year_enacted: 2017,
    description: 'Development control regulations for Pune Municipal Corporation area. FSI, setbacks, parking, building permissions.',
    key_provisions: 'FSI Limits, Building Heights, Setback Requirements, Parking Norms, Premium FSI, Amenity Space',
    contract_relevance: 'Pune property agreements must verify PMC approval status, FSI compliance, parking provision, completion certificate.',
    common_violations: 'Unauthorized construction, FSI violations, inadequate parking, no OC',
    penalties: 'Demolition orders, fines, regularization with penalty.'
  },
  {
    id: 'bmc-dcr',
    law_name: 'Mumbai BMC Development Control Regulations',
    law_type: 'municipal',
    jurisdiction: 'mumbai',
    category: 'building_development',
    year_enacted: 2034,
    description: 'Development control regulations for Greater Mumbai. DP 2034 provisions, FSI, TDR, slum rehab.',
    key_provisions: 'DP 2034 FSI (Base 2.0-3.0), TDR, Slum Rehabilitation FSI, Coastal Regulation Zone, Heritage Regulations',
    contract_relevance: 'Mumbai property agreements must verify BMC approval, TDR utilization, slum rehab status, CRZ compliance.',
    common_violations: 'Unauthorized TDR use, CRZ violations, slum rehab irregularities',
    penalties: 'Demolition, heavy fines, criminal prosecution for CRZ violations.'
  },
  {
    id: 'dda-master-plan',
    law_name: 'Delhi Development Authority Master Plan',
    law_type: 'municipal',
    jurisdiction: 'delhi',
    category: 'building_development',
    year_enacted: 2021,
    description: 'Master Plan for Delhi 2041. Land use, FAR, building control, transit-oriented development.',
    key_provisions: 'FAR Norms, Land Use Zoning, TOD Policy, Heritage Zone Restrictions, Green Belt Provisions',
    contract_relevance: 'Delhi property agreements must verify DDA approval, land use conformity, FAR compliance.',
    common_violations: 'Land use violations, unauthorized colonies, FAR excess',
    penalties: 'Sealing, demolition, regularization schemes with penalties.'
  },
  {
    id: 'bda-regulations',
    law_name: 'Bangalore Development Authority Building Regulations',
    law_type: 'municipal',
    jurisdiction: 'bangalore',
    category: 'building_development',
    year_enacted: 2019,
    description: 'Building regulations for BDA areas in Bangalore. FAR, setbacks, parking, rainwater harvesting.',
    key_provisions: 'FAR (2.25-3.35), Setbacks, Parking Requirements (1 per 75 sqm), Rainwater Harvesting Mandatory',
    contract_relevance: 'Bangalore property agreements must verify BDA/BBMP approval, khata status, A/B khata implications.',
    common_violations: 'B-khata properties, unauthorized construction, setback violations',
    penalties: 'Regularization with penalty, demolition for serious violations.'
  },
  {
    id: 'kmc-building-rules',
    law_name: 'Kolkata Municipal Corporation Building Rules',
    law_type: 'municipal',
    jurisdiction: 'kolkata',
    category: 'building_development',
    year_enacted: 2009,
    description: 'Building rules for Kolkata Municipal Corporation area. FAR, building height, fire safety.',
    key_provisions: 'FAR Limits, Building Height Restrictions, Fire Safety Clearance, Heritage Zone Rules',
    contract_relevance: 'Kolkata property agreements must verify KMC approval, heritage restrictions if applicable.',
    common_violations: 'Heritage zone violations, fire safety non-compliance',
    penalties: 'Fines, demolition orders, heritage violations prosecuted strictly.'
  },
  {
    id: 'national-building-code',
    law_name: 'National Building Code of India 2016',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'building_development',
    year_enacted: 2016,
    description: 'Model code for building construction. Structural safety, fire safety, accessibility, sustainability.',
    key_provisions: 'Part 4 (Fire and Life Safety), Part 5 (Building Materials), Part 6 (Structural Design), Part 8 (Building Services), Part 11 (Accessibility)',
    contract_relevance: 'Construction contracts must reference NBC compliance. Fire safety, accessibility, structural safety standards.',
    common_violations: 'Fire safety non-compliance, accessibility violations, structural defects',
    penalties: 'Reference standard for state building codes. Non-compliance can void insurance, cause liability.'
  },
  {
    id: 'environment-protection-act',
    law_name: 'Environment Protection Act, 1986',
    law_type: 'central',
    jurisdiction: 'all_india',
    category: 'environment',
    year_enacted: 1986,
    description: 'Umbrella legislation for environmental protection. EIA requirements, pollution control, CRZ regulations.',
    key_provisions: 'Section 3 (Central Government Powers), EIA Notification 2006, CRZ Notification 2011, Eco-Sensitive Zones',
    contract_relevance: 'Large projects need environmental clearance. CRZ areas have construction restrictions. Industrial projects need consent to establish/operate.',
    common_violations: 'No environmental clearance, CRZ violations, exceeding pollution norms',
    penalties: 'Imprisonment up to 5 years and fine up to Rs 1 lakh. Project shutdown orders.'
  }
];

async function generateEmbedding(text) {
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

async function ingestLaw(law) {
  console.log(`Processing: ${law.law_name}`);
  
  const textForEmbedding = `${law.law_name} ${law.description} ${law.key_provisions} ${law.contract_relevance} ${law.common_violations || ''}`;
  
  try {
    const embedding = await generateEmbedding(textForEmbedding);
    
    const { error } = await supabase
      .from('indian_laws')
      .upsert({
        ...law,
        embedding
      });
    
    if (error) {
      console.error(`Error inserting ${law.law_name}:`, error);
      return false;
    }
    
    console.log(`✓ Inserted: ${law.law_name}`);
    return true;
  } catch (err) {
    console.error(`Error processing ${law.law_name}:`, err);
    return false;
  }
}

async function main() {
  console.log('Starting Indian Laws ingestion...');
  console.log(`Total laws to process: ${indianLaws.length}`);
  
  let success = 0;
  let failed = 0;
  
  for (const law of indianLaws) {
    const result = await ingestLaw(law);
    if (result) {
      success++;
    } else {
      failed++;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n=== Ingestion Complete ===');
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);
}

main().catch(console.error);
