import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Industry-specific pattern sets
const industries = {
  saas: [
    { name: "Usage-Based Overage Fees", cat: "payment", sev: "high", desc: "Allows provider to charge uncapped overage fees if usage limits are exceeded without prior warning." },
    { name: "Data Extraction Fee", cat: "termination", sev: "medium", desc: "Requires payment of a significant fee to extract your own data upon termination." },
    { name: "Service Level Agreement (SLA) Exclusion", cat: "other", sev: "medium", desc: "Broad exclusions that prevent the provider from being held liable for downtime caused by 'third-party' services." },
    { name: "Source Code Escrow Absence", cat: "other", sev: "high", desc: "Lack of a provision to access source code if the provider goes bankrupt, creating high business continuity risk." },
    { name: "Beta Testing Liability Waiver", cat: "liability", sev: "high", desc: "Broadly waives all liability for data loss or damage occurring during 'beta' or 'early access' periods." },
    { name: "Suspension without Notice", cat: "termination", sev: "high", desc: "Allows provider to suspend service immediately for any suspected breach without notice or cure period." },
    { name: "Automatic Seat Increase", cat: "payment", sev: "medium", desc: "Automatically increases billing when new users are detected without requiring admin approval." },
    { name: "No Refund on Early Termination", cat: "payment", sev: "high", desc: "Explicitly states no refunds will be provided for prepaid services even if terminated for provider breach." },
    { name: "API Rate Limit Changes", cat: "other", sev: "medium", desc: "Allows provider to change API rate limits or deprecate endpoints with minimal notice." },
    { name: "Data Processing Agreement Absence", cat: "other", sev: "critical", desc: "Lack of a formal DPA in a SaaS contract involving personal data, violating GDPR/CCPA." }
  ],
  employment: [
    { name: "Non-Compete Extension", cat: "other", sev: "high", desc: "Extends non-compete period beyond the end of employment if the employee is terminated 'for cause'." },
    { name: "Clawback Provision", cat: "payment", sev: "medium", desc: "Allows employer to reclaim signing bonuses or relocation costs if employment ends within a certain period for any reason." },
    { name: "Moonlighting Prohibition", cat: "other", sev: "medium", desc: "Strictly prohibits any side work or outside activities, even if they don't compete with the employer." },
    { name: "Arbitration Costs Shift", cat: "other", sev: "high", desc: "Requires employee to pay half of all arbitration costs, effectively pricing them out of dispute resolution." },
    { name: "Inventions Assignment (Broad)", cat: "ip", sev: "critical", desc: "Assigns ownership of ALL inventions created during employment, even if made on personal time/equipment." },
    { name: "Non-Solicitation of Clients", cat: "other", sev: "high", desc: "Prohibits contacting any client of the employer for a period after leaving, regardless of prior relationship." },
    { name: "Social Media Ownership", cat: "ip", sev: "medium", desc: "Claims ownership of professional social media accounts (e.g., LinkedIn) created or used during employment." },
    { name: "Forfeiture of Vested Options", cat: "payment", sev: "critical", desc: "Forces forfeiture of already vested stock options if the employee joins a 'competitor'." },
    { name: "Training Cost Reimbursement", cat: "payment", sev: "medium", desc: "Requires employee to pay back thousands in 'training costs' if they leave within 2 years." },
    { name: "Irrevocable Proxy", cat: "other", sev: "high", desc: "Requires employee-shareholders to grant an irrevocable proxy to the CEO for all voting matters." }
  ],
  real_estate: [
    { name: "Common Area Maintenance (CAM) Audit Waiver", cat: "other", sev: "medium", desc: "Waives the tenant's right to audit the landlord's calculation of operating expenses." },
    { name: "Restoration Requirement", cat: "termination", sev: "high", desc: "Requires tenant to restore premises to original condition regardless of normal wear and tear." },
    { name: "Percentage Rent Loophole", cat: "payment", sev: "medium", desc: "Includes online sales or returns in the calculation of 'gross sales' for percentage rent purposes." },
    { name: "Relocation Rights", cat: "other", sev: "medium", desc: "Landlord reserves the right to move the tenant to a different suite at the landlord's sole discretion." },
    { name: "Sublease Profit Capture", cat: "other", sev: "medium", desc: "Landlord captures 100% of any profit generated from a sublease." },
    { name: "Holdover Penalty (300%)", cat: "payment", sev: "high", desc: "Charges 3 times the normal rent if the tenant stays even one day past the lease end date." },
    { name: "HVAC Maintenance Responsibility", cat: "other", sev: "medium", desc: "Shifts full responsibility for replacement (not just repair) of HVAC systems to the tenant." },
    { name: "Lien Waiver Requirement", cat: "other", sev: "high", desc: "Requires tenant to waive all rights to place a lien on the property for improvements they paid for." },
    { name: "Radius Restriction", cat: "other", sev: "high", desc: "Prohibits the tenant from opening another store within 5 miles, limiting business growth." },
    { name: "Estoppel Certificate Deadline", cat: "other", sev: "medium", desc: "Deems the tenant in default if they don't return an estoppel certificate within 48-72 hours." }
  ],
  construction: [
    { name: "Pay-When-Paid Clause", cat: "payment", sev: "high", desc: "Subcontractor only gets paid if and when the General Contractor is paid by the Owner." },
    { name: "Liquidated Damages (Uncapped)", cat: "liability", sev: "critical", desc: "Imposes daily penalties for delays without any upper limit or grace period." },
    { name: "No Damage for Delay", cat: "liability", sev: "high", desc: "Prohibits the contractor from seeking damages for delays caused solely by the owner." },
    { name: "Broad Form Indemnity", cat: "indemnity", sev: "critical", desc: "Requires subcontractor to indemnify the owner even for the owner's own negligence." },
    { name: "Differing Site Conditions Waiver", cat: "other", sev: "high", desc: "Contractor assumes all risk for underground or hidden conditions discovered during excavation." },
    { name: "Interim Lien Waivers", cat: "payment", sev: "high", desc: "Requires signing a full release of all claims just to receive a partial progress payment." },
    { name: "Owner-Controlled Insurance (OCIP)", cat: "other", sev: "medium", desc: "Forces contractors into an owner-provided insurance wrap-up that may have inadequate coverage." },
    { name: "Termination for Convenience Fee Absence", cat: "termination", sev: "medium", desc: "Allows owner to terminate without paying for demobilization or lost profit on work not started." },
    { name: "Retention (10%)", cat: "payment", sev: "medium", desc: "Withholds 10% of every payment until months after the entire project is 100% complete." },
    { name: "Verbal Change Order Prohibition", cat: "other", sev: "high", desc: "Strictly prohibits payment for any work not approved in writing via a formal change order signed by the owner." }
  ],
  healthcare: [
    { name: "HIPAA Non-Compliance Liability Shift", cat: "liability", sev: "critical", desc: "Shifts all liability for HIPAA breaches to the service provider, even if caused by the client's poor security." },
    { name: "Exclusive Referral Prohibition", cat: "other", sev: "high", desc: "Attempts to mandate referrals to specific providers, potentially violating Stark Law or Anti-Kickback statutes." },
    { name: "Data Re-identification Rights", cat: "ip", sev: "high", desc: "Allows the provider to use 'de-identified' patient data for commercial purposes without further compensation." },
    { name: "Malpractice Insurance Minimums", cat: "other", sev: "medium", desc: "Requires excessively high malpractice insurance levels that are above industry standard for the specific services." },
    { name: "Records Retention Cost Shift", cat: "payment", sev: "medium", desc: "Charges the client for medical records storage after the contract ends." },
    { name: "Physician Non-Solicitation", cat: "other", sev: "high", desc: "Prohibits hospitals from hiring doctors who previously worked for the staffing agency." },
    { name: "EHR Data Portability Block", cat: "termination", sev: "critical", desc: "Makes it technically or legally impossible to migrate patient records to a new EHR provider." },
    { name: "Peer Review Privilege Waiver", cat: "other", sev: "high", desc: "Attempts to force disclosure of confidential peer review or quality assurance documents." },
    { name: "Medical Staff Bylaws Incorporation", cat: "other", sev: "medium", desc: "Incorporates hundreds of pages of bylaws by reference that can be changed without notice." },
    { name: "Telehealth Jurisdiction Waiver", cat: "other", sev: "medium", desc: "Forces patient/provider disputes into a distant jurisdiction regardless of where the care was delivered." }
  ],
  finance: [
    { name: "Cross-Default Provision", cat: "termination", sev: "high", desc: "Declares a default on this loan if you default on ANY other debt with ANY other lender." },
    { name: "Negative Covenants (Broad)", cat: "other", sev: "high", desc: "Prohibits virtually any corporate action (mergers, acquisitions, asset sales) without bank consent." },
    { name: "Financial Ratio Maintenance", cat: "other", sev: "high", desc: "Requires maintaining strict debt-to-equity or liquidity ratios at all times, with default for a one-day dip." },
    { name: "Prepayment Penalty (Yield Maintenance)", cat: "payment", sev: "medium", desc: "Charges a massive fee if you pay off the loan early, often calculated to ensure the bank gets all its interest." },
    { name: "Material Adverse Change (MAC)", cat: "termination", sev: "critical", desc: "Allows the lender to pull funding if they 'believe' your business or the economy has worsened." },
    { name: "Sweeps and Offsets", cat: "payment", sev: "high", desc: "Allows the bank to automatically take money from your operating accounts to pay down loan balances without notice." },
    { name: "Personal Guarantee (Unconditional)", cat: "liability", sev: "critical", desc: "Requires owners to be personally liable for the company's debt with no limits or 'burn-off' period." },
    { name: "Equity Kicker", cat: "payment", sev: "medium", desc: "Requires giving the lender stock options or warrants as a condition of receiving the loan." },
    { name: "Insecurity Clause", cat: "termination", sev: "high", desc: "Allows the lender to accelerate the loan if they 'deem themselves insecure' regarding repayment." },
    { name: "Audited Financials Requirement", cat: "other", sev: "medium", desc: "Requires expensive audited financial statements quarterly for a small business loan." }
  ],
  manufacturing: [
    { name: "Inventory Obsolescence Risk", cat: "payment", sev: "high", desc: "Requires the buyer to pay for all raw materials or finished goods even if the order is cancelled." },
    { name: "Tooling Ownership Dispute", cat: "ip", sev: "high", desc: "Manufacturer claims ownership of specialized molds or tools that the client paid for." },
    { name: "Price Escalation (Uncapped)", cat: "payment", sev: "high", desc: "Allows manufacturer to raise prices based on raw material costs without a cap or right to terminate." },
    { name: "Minimum Order Quantity (MOQ)", cat: "payment", sev: "medium", desc: "Strict MOQs that force the buyer to purchase more than they need to maintain pricing." },
    { name: "Forecast Binding Nature", cat: "payment", sev: "high", desc: "Treats non-binding 'forecasts' as firm purchase orders, forcing the buyer to pay for predicted demand." },
    { name: "Recall Indemnity (Broad)", cat: "indemnity", sev: "critical", desc: "Forces the component supplier to pay for an entire product recall, even if their part was only slightly involved." },
    { name: "Quality Rejection Window", cat: "other", sev: "medium", desc: "Limits the time to reject defective goods to 48 hours after delivery, regardless of hidden defects." },
    { name: "Incoterms Mismatch", cat: "other", sev: "medium", desc: "Uses Incoterms that shift shipping risk and cost to the party least able to manage it (e.g., EXW for an international buyer)." },
    { name: "Proprietary Method Claim", cat: "ip", sev: "high", desc: "Manufacturer claims that any improvements made to the product during manufacturing belong to them." },
    { name: "Exclusivity (Single Source)", cat: "other", sev: "high", desc: "Prohibits the buyer from using any other manufacturer for similar products for 5 years." }
  ],
  retail: [
    { name: "MAP Pricing Enforcement", cat: "other", sev: "medium", desc: "Strict Minimum Advertised Price (MAP) policies that allow the brand to cut off supply for any discount." },
    { name: "Chargeback Fees (Unchecked)", cat: "payment", sev: "high", desc: "Retailers charging massive fees for minor labeling or shipping errors." },
    { name: "Slotting Fees", cat: "payment", sev: "medium", desc: "Requires upfront payment just to have products placed on shelves, with no guarantee of sales." },
    { name: "Return to Vendor (RTV) Rights", cat: "payment", sev: "high", desc: "Allows retailer to return unsold or damaged stock for a full refund at any time." },
    { name: "Co-op Advertising Mandatory Spend", cat: "payment", sev: "medium", desc: "Requires brand to spend a fixed percentage of sales on retailer-managed advertising." },
    { name: "Exclusive Display Space", cat: "other", sev: "medium", desc: "Mandates that no competitor products be displayed within 10 feet of the brand's products." },
    { name: "Sales Data Ownership", cat: "ip", sev: "high", desc: "Retailer claims exclusive ownership of all customer and sales data, prohibiting the brand from seeing it." },
    { name: "Markdown Protection", cat: "payment", sev: "high", desc: "Forces the brand to refund the retailer for the difference when the retailer decides to discount the product." },
    { name: "Dropshipping Late Fees", cat: "payment", sev: "medium", desc: "Imposes heavy penalties for orders not shipped within 4 hours of receipt." },
    { name: "Brand Name License (Broad)", cat: "ip", sev: "high", desc: "Gives the retailer a broad license to use the brand's name for their own promotional purposes indefinitely." }
  ],
  logistics: [
    { name: "Demurrage/Detention Uncapped", cat: "payment", sev: "high", desc: "Allows carrier to charge uncapped daily fees for container delays even if caused by port congestion." },
    { name: "Carrier Lien on Cargo", cat: "other", sev: "critical", desc: "Allows carrier to sell the customer's cargo to pay for unrelated past-due invoices." },
    { name: "Limitation of Liability (Hague-Visby)", cat: "liability", sev: "high", desc: "Limits carrier liability to a very small amount per package (e.g., $500) regardless of actual cargo value." },
    { name: "Fuel Surcharge (Variable)", cat: "payment", sev: "medium", desc: "Opaque fuel surcharge calculations that don't track with public indices." },
    { name: "Force Majeure (Port Strike)", cat: "other", sev: "medium", desc: "Excludes port strikes from force majeure, leaving the shipper liable for delays." },
    { name: "Route Discretion", cat: "other", sev: "low", desc: "Allows carrier to change routes, modes of transport, or transshipment points without notice." },
    { name: "Insurance Pass-Through Waiver", cat: "liability", sev: "high", desc: "Prohibits the shipper from claiming against the carrier's insurance directly." },
    { name: "Hazardous Materials Indemnity", cat: "indemnity", sev: "critical", desc: "Requires shipper to indemnify carrier for any environmental damage, even if the carrier was negligent." },
    { name: "Wait Time Charges", cat: "payment", sev: "medium", desc: "Charges $100+ per hour for any truck waiting time over 15 minutes." },
    { name: "Packaging Standards (Arbitrary)", cat: "other", sev: "medium", desc: "Allows carrier to deny any damage claim by claiming the packaging was 'inadequate' at their sole discretion." }
  ],
  energy: [
    { name: "Environmental Indemnity (Perpetual)", cat: "indemnity", sev: "critical", desc: "Forces the contractor to be liable for any environmental contamination found on site, forever." },
    { name: "Regulatory Change Risk Shift", cat: "payment", sev: "high", desc: "Requires the provider to absorb all costs associated with new environmental or safety regulations." },
    { name: "Mineral Rights Reservation", cat: "ip", sev: "high", desc: "Landowner reserves all mineral and subsurface rights, potentially disrupting energy operations later." },
    { name: "Take-or-Pay Obligation", cat: "payment", sev: "critical", desc: "Requires buyer to pay for a fixed amount of energy even if they can't use or receive it." },
    { name: "Decommissioning Bond", cat: "payment", sev: "high", desc: "Requires posting massive cash bonds for site restoration 20 years in the future." },
    { name: "Access Easement Termination", cat: "termination", sev: "high", desc: "Allows landowner to terminate site access if energy production falls below an arbitrary level." },
    { name: "Grid Interconnection Delay", cat: "other", sev: "medium", desc: "Utility company disclaims all liability for delays in connecting a new project to the power grid." },
    { name: "Curtailment without Compensation", cat: "payment", sev: "high", desc: "Allows the grid operator to shut down production without paying the producer for lost revenue." },
    { name: "NIMBY Litigation Indemnity", cat: "indemnity", sev: "medium", desc: "Requires contractor to pay for all legal defense against local community 'Not In My Backyard' lawsuits." },
    { name: "Output Guarantee (Solar/Wind)", cat: "other", sev: "high", desc: "Requires a minimum energy output that doesn't account for weather variability, leading to constant default." }
  ]
};

// Help generate more variants
const generateVariants = (industry, basePatterns) => {
  return basePatterns.map(p => {
    const id = `${industry}-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    return {
      id,
      name: p.name,
      category: p.cat,
      severity: p.sev,
      description: p.desc,
      why_it_matters: p.desc + " This creates significant financial and legal risk.",
      plain_english: "Essentially, this means " + p.desc.toLowerCase(),
      how_it_should_be: "This should be limited to reasonable industry standards.",
      negotiation_script: "We'd like to adjust this clause to be more mutual and aligned with standard practices.",
      suggested_alternative: "The parties shall agree to a reasonable limit on this obligation.",
      embedding: Array(768).fill(0) // Dummy
    };
  });
};

async function main() {
  console.log("Starting bulk ingestion...");
  
  let allPatterns = [];
  for (const [industry, patterns] of Object.entries(industries)) {
    allPatterns = allPatterns.concat(generateVariants(industry, patterns));
  }

  console.log(`Ingesting ${allPatterns.length} patterns...`);

  const { error } = await supabase
    .from('patterns')
    .upsert(allPatterns, { onConflict: 'id' });

  if (error) {
    console.error('Error ingesting patterns:', error);
  } else {
    console.log('Successfully ingested patterns!');
  }
}

main();
