import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

const patterns = [
  {
    "name": "Automatic Renewal with Price Escalation",
    "category": "termination",
    "severity": "high",
    "description": "Agreement automatically renews for successive terms (often annual) unless written notice is provided 60-90 days prior to renewal date, with provisions allowing price increases of up to 15-25% upon renewal at provider's sole discretion.",
    "why_it_matters": "Locks you into long-term commitments with unpredictable cost increases. Missing the narrow cancellation window commits you to another full term at potentially higher rates. Common in insurance policies, SaaS agreements, and service contracts.",
    "plain_english": "Your contract keeps renewing automatically every year unless you cancel within a specific window (usually 60-90 days before it ends). The other party can raise prices each time it renews, and you might not notice until you're locked in for another year.",
    "how_it_should_be": "Contract should renew on an opt-in basis requiring affirmative consent, with price increases capped at a specific percentage (e.g., 5% annually) or tied to an index like CPI, and allowing termination with 30 days notice.",
    "negotiation_script": "We'd like to modify the renewal terms to require mutual written agreement for each renewal period, with any price increases limited to [X%] annually and tied to documented cost changes. We also need the flexibility to terminate with 30 days notice rather than being locked into the narrow cancellation window.",
    "suggested_alternative": "This Agreement shall renew only upon written consent of both parties. Either party may terminate this Agreement with thirty (30) days written notice. Any price increases upon renewal shall not exceed the lesser of (i) five percent (5%) or (ii) the percentage increase in the Consumer Price Index for the preceding twelve months, and must be communicated in writing at least sixty (60) days prior to the renewal date."
  },
  {
    "name": "Unilateral Contract Modification Rights",
    "category": "other",
    "severity": "high",
    "description": "Provider reserves the right to modify, amend, or change the terms and conditions of the agreement at any time, at its sole discretion, with changes becoming effective immediately upon posting to website or with minimal notice (e.g., 10-15 days).",
    "why_it_matters": "Allows the other party to fundamentally change the deal after you've signed, including pricing, service levels, liability caps, and dispute resolution terms. You have no recourse except to terminate, often forfeiting deposits or facing penalties. Extremely common in insurance policies, financial services, and software licensing.",
    "plain_english": "They can change any part of the contract whenever they want, and you're automatically bound by the new terms unless you cancel (which might cost you money or leave you scrambling for alternatives).",
    "how_it_should_be": "Material changes to terms should require your written consent or provide a reasonable termination right without penalty. Non-material changes should require 60 days notice with clear disclosure of what changed.",
    "negotiation_script": "We need protection against unilateral changes to material terms like pricing, service levels, and liability provisions. Can we add language that requires our written consent for material changes, or at minimum, allows us to terminate without penalty within 60 days of any such change?",
    "suggested_alternative": "Provider may not modify material terms of this Agreement (including pricing, service levels, liability limitations, or dispute resolution) without Client's prior written consent. For non-material modifications, Provider shall provide Client with sixty (60) days advance written notice. Client may terminate this Agreement without penalty within thirty (30) days of receiving notice of any modification by providing written notice to Provider."
  },
  {
    "name": "Mandatory Binding Arbitration with Class Action Waiver",
    "category": "other",
    "severity": "critical",
    "description": "All disputes must be resolved through binding individual arbitration, with an explicit waiver of the right to participate in class action lawsuits, often specifying a particular arbitration forum and requiring each party to bear their own costs regardless of outcome.",
    "why_it_matters": "Eliminates your right to sue in court and prevents joining with other affected parties in class actions. In disputes involving small amounts, the cost of arbitration may exceed your claim, effectively denying you any remedy. Arbitration decisions are final with very limited appeal rights. Prevalent in financial services, insurance, healthcare, and consumer contracts.",
    "plain_english": "If there's a dispute, you can't go to court or join with other customers to sue together. You have to use a private arbitration process that's expensive, final, and heavily favors companies with experience in that system. For small claims, the cost makes it impossible to pursue.",
    "how_it_should_be": "Preserve the right to court litigation for disputes exceeding a certain threshold (e.g., $50,000), allow class actions for systemic issues, and ensure the company pays all arbitration costs if they exceed small claims court filing fees.",
    "negotiation_script": "The arbitration clause as written eliminates practical remedies for many disputes. We'd like to preserve the right to court litigation for claims over $50,000, maintain the ability to participate in class actions for systemic issues, and ensure your company covers arbitration costs that exceed normal court filing fees.",
    "suggested_alternative": "For disputes not exceeding $50,000, parties agree to binding arbitration under [neutral rules]. For disputes exceeding $50,000, either party may elect litigation in courts of competent jurisdiction. This arbitration provision does not preclude participation in class action proceedings for claims involving systemic breaches affecting multiple parties. Provider shall pay all arbitration costs exceeding the filing fees that would be paid in small claims court."
  },
  {
    "name": "Unlimited Indemnification Obligation",
    "category": "indemnity",
    "severity": "critical",
    "description": "Client agrees to indemnify, defend, and hold harmless Provider, its affiliates, officers, directors, and employees from any and all claims, damages, losses, liabilities, and expenses (including attorneys' fees) arising from or related to Client's use of services, breach of agreement, or violation of any law, with no cap on liability.",
    "why_it_matters": "Creates unlimited financial exposure for actions that may be partially or wholly the provider's fault. You could be responsible for defending the provider in lawsuits and paying their legal fees even when they're negligent. Common in service agreements, software licenses, and vendor contracts.",
    "plain_english": "You're promising to pay for any lawsuits or claims against them that are even remotely related to your use of their service, even if they caused the problem. There's no limit to how much you might have to pay, including their lawyer fees.",
    "how_it_should_be": "Indemnification should be mutual, capped at a reasonable amount (e.g., total fees paid or policy limits), and exclude claims arising from the provider's negligence, breach, or defective services.",
    "negotiation_script": "The current indemnification provision creates unlimited liability for our company, even in situations where your negligence may be a contributing factor. We need mutual indemnification obligations, a cap tied to the agreement value or our insurance limits, and clear exclusions for claims arising from your breach or negligence.",
    "suggested_alternative": "Each party shall indemnify the other from claims arising solely from the indemnifying party's (i) breach of this Agreement, (ii) negligence or willful misconduct, or (iii) violation of applicable law. Client's indemnification obligation shall not exceed the total fees paid under this Agreement in the twelve months preceding the claim. This indemnification does not apply to claims arising from Provider's negligent provision of services or defective products."
  },
  {
    "name": "Broad IP Assignment and Moral Rights Waiver",
    "category": "ip",
    "severity": "critical",
    "description": "Client assigns to Provider all intellectual property rights, including patents, copyrights, trademarks, and trade secrets, in any materials, feedback, modifications, or derivative works created in connection with the services, including pre-existing IP and with full waiver of moral rights in perpetuity.",
    "why_it_matters": "Transfers ownership of your IP, improvements you make, and potentially your pre-existing proprietary assets to the provider permanently. Even feedback or suggestions you provide become their property. You lose control over innovations in your own business. Critical issue in technology, manufacturing, R&D, and consulting agreements.",
    "plain_english": "Anything you create, improve, or even suggest while using their service becomes their property forever - including your existing business assets and ideas. You can't even claim you created it or object if they modify it.",
    "how_it_should_be": "Should be limited to specific work product created by the provider, exclude pre-existing IP and general business methods, and preserve your rights to derivative works and improvements to your own systems.",
    "negotiation_script": "The IP assignment clause is too broad and would transfer ownership of our proprietary business assets. We need to limit this to work product specifically created by your team for us, clearly exclude our pre-existing IP and business methods, and ensure we retain rights to improvements we make to our own systems.",
    "suggested_alternative": "Provider retains ownership of pre-existing IP and work product created solely by Provider. Client retains ownership of Client's pre-existing IP, business methods, and confidential information. Any jointly developed IP shall be jointly owned with each party retaining rights to use and license. Client grants Provider a limited, non-exclusive license to Client's materials solely to perform services under this Agreement. This assignment excludes feedback, suggestions, and derivative works created by Client."
  },
  {
    "name": "Exclusion of Consequential Damages",
    "category": "liability",
    "severity": "high",
    "description": "Provider shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to lost profits, lost revenue, lost business opportunities, loss of data, or business interruption, regardless of the cause of action and even if advised of the possibility of such damages.",
    "why_it_matters": "Eliminates recovery for the actual business harm caused by breaches, defects, or negligence. If their product failure causes your business to lose $1M in revenue, they may only owe you the $1,000 service fee. Particularly dangerous in critical service agreements, insurance policies, and enterprise software.",
    "plain_english": "If their failure causes your business to lose money, customers, or opportunities, they don't have to pay for any of that - only the direct cost of their service. Your $100,000 in lost sales because their system failed? Not covered.",
    "how_it_should_be": "Should allow recovery of reasonably foreseeable consequential damages up to a cap (e.g., 3-5x fees paid), especially for gross negligence, willful misconduct, or breach of confidentiality.",
    "negotiation_script": "Excluding all consequential damages leaves us without remedy for the real business harm your service failures could cause. We need to recover foreseeable consequential damages up to a reasonable cap, particularly for gross negligence, data breaches, or willful misconduct.",
    "suggested_alternative": "Except for breaches of confidentiality, gross negligence, or willful misconduct, neither party shall be liable for indirect or consequential damages. However, for critical system failures caused by Provider's negligence that result in Client's business interruption or data loss, Provider's liability for reasonably foreseeable consequential damages shall not exceed three (3) times the fees paid in the twelve months preceding the claim."
  },
  {
    "name": "Payment for Services Not Rendered",
    "category": "payment",
    "severity": "high",
    "description": "Client shall pay all fees for the full contract term regardless of actual usage, service availability, or performance issues. No refunds or credits provided for unused services, service outages, or failure to meet service levels. Payment obligations survive termination for the full term.",
    "why_it_matters": "You must pay even if they don't deliver, services fail, or you don't use them. If you cancel due to their poor performance, you still owe the full remaining contract value. Common in insurance policies, long-term service contracts, and subscription agreements.",
    "plain_english": "You have to pay for the entire contract period even if their service doesn't work, you can't use it, or you need to cancel because of their failures. It's like paying rent on an apartment even after the building burns down.",
    "how_it_should_be": "Payment should be tied to service delivery and performance. Allow pro-rated refunds for early termination and credits for service level failures. Suspension of payment during outages exceeding reasonable thresholds.",
    "negotiation_script": "The payment terms require us to pay regardless of service delivery or performance. We need payment obligations tied to actual service availability, pro-rated refunds if we terminate due to your breach, and service credits when you fail to meet agreed service levels.",
    "suggested_alternative": "Client shall pay fees for services actually rendered. If Provider fails to meet Service Level Agreements for any month, Client shall receive pro-rated credits. Client may suspend payment during service outages exceeding [X] hours. If Client terminates due to Provider's material breach, Client shall receive a pro-rated refund of prepaid fees for the remainder of the term."
  },
  {
    "name": "Asymmetric Termination Rights",
    "category": "termination",
    "severity": "medium",
    "description": "Provider may terminate the agreement immediately for any reason or no reason upon written notice, while Client may only terminate for cause after providing 60-90 days written notice and opportunity to cure, and must pay early termination fees equal to 50-100% of remaining contract value.",
    "why_it_matters": "Creates significant imbalance. They can walk away anytime, but you're locked in with substantial penalties. They can also terminate strategically right before renewal to force renegotiation at higher rates. Common in insurance, vendor agreements, and real estate leases.",
    "plain_english": "They can cancel anytime for any reason, but you're stuck for the entire contract period. If you need to leave early, even if they're performing poorly, you have to pay a huge penalty - sometimes the full remaining contract value.",
    "how_it_should_be": "Termination rights should be mutual with the same notice periods and conditions. Early termination fees should be reasonable (e.g., 1-2 months fees) and waived if terminating due to provider's breach.",
    "negotiation_script": "The termination provisions are one-sided and create significant risk for our business. We need mutual termination rights with equal notice periods, reasonable early termination fees capped at [X months], and no penalty if we're terminating due to your material breach or service failures.",
    "suggested_alternative": "Either party may terminate this Agreement for convenience with ninety (90) days written notice. Either party may terminate immediately for the other party's material breach following thirty (30) days notice and opportunity to cure. If Client terminates for convenience, Client shall pay an early termination fee equal to two (2) months of fees. No early termination fee applies if Client terminates due to Provider's uncured material breach."
  },
  {
    "name": "Unlimited Warranty Disclaimer",
    "category": "warranties",
    "severity": "high",
    "description": "Services provided 'AS IS' and 'AS AVAILABLE' without any warranties, express or implied, including but not limited to warranties of merchantability, fitness for particular purpose, title, non-infringement, or that services will be uninterrupted, secure, or error-free. Provider disclaims all representations regarding accuracy, reliability, or completeness.",
    "why_it_matters": "Eliminates legal recourse if services are defective, unsuitable for their stated purpose, or completely fail. You bear all risks. Particularly dangerous for critical business services, healthcare systems, financial platforms, and professional services where you rely on accuracy and reliability.",
    "plain_english": "They promise absolutely nothing about whether their service will work, be accurate, or even be suitable for what they're selling it for. If it's completely broken or wrong, that's your problem to deal with.",
    "how_it_should_be": "Should include basic warranties that services will conform to documentation, be performed in a workmanlike manner consistent with industry standards, and be suitable for their stated purpose.",
    "negotiation_script": "The warranty disclaimer eliminates all recourse if your services are defective or unsuitable. We need basic warranties that services will conform to your documentation, be performed competently, and be reasonably fit for the purposes you've represented they serve.",
    "suggested_alternative": "Provider warrants that (i) services will be performed in a professional and workmanlike manner consistent with industry standards; (ii) services will substantially conform to the documentation and specifications provided; (iii) Provider has the right to provide the services and they will not infringe third-party intellectual property rights; and (iv) for a period of [X] days, services will be free from material defects. If Provider breaches these warranties, Client's exclusive remedy shall be re-performance or, if re-performance fails, a refund of fees paid for the defective services."
  },
  {
    "name": "Third-Party Beneficiary and Assignment Rights",
    "category": "other",
    "severity": "medium",
    "description": "Agreement may be freely assigned by Provider to any third party, affiliate, or successor (including in merger or acquisition) without Client consent. Provider's contractors, subcontractors, and affiliates are third-party beneficiaries with direct enforcement rights. Client may not assign without prior written consent.",
    "why_it_matters": "You carefully selected this provider, but they can transfer the agreement to anyone - including competitors or companies you wouldn't do business with. Third parties you never contracted with can enforce terms against you. Meanwhile, you can't assign even if your business is acquired. Common in service agreements, insurance policies, and vendor contracts.",
    "plain_english": "They can hand your contract off to anyone (even a company you'd never work with), and those new parties plus all their subcontractors can enforce the contract against you. But if your business is sold or reorganized, you can't transfer the contract without their permission, which they might deny or use to renegotiate at higher rates.",
    "how_it_should_be": "Assignment rights should be mutual with consent required for transfers to unaffiliated third parties. Third-party beneficiary status should be limited to clearly identified parties. Allow assignment to acquirers of your business.",
    "negotiation_script": "The assignment provision allows you to transfer our agreement to any third party without our consent, while we can't assign even in a merger or acquisition. We need mutual assignment rights, your consent to only unaffiliated parties, and the ability to assign to an acquirer of our business.",
    "suggested_alternative": "Neither party may assign this Agreement without the other party's prior written consent (not to be unreasonably withheld), except that either party may assign to an affiliate or successor in connection with a merger, acquisition, or sale of substantially all assets with notice to the other party. This Agreement does not create any third-party beneficiary rights except for the parties' respective affiliates. Any attempted assignment in violation of this provision shall be void."
  }
];

async function generateEmbeddings() {
  console.log(`Generating real embeddings for ${patterns.length} patterns...`);
  
  try {
    const results = [];
    
    for (const pattern of patterns) {
      const id = pattern.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      
      // Embed the description and name for vector search
      const textToEmbed = `${pattern.name}: ${pattern.description}`;
      const result = await model.embedContent(textToEmbed);
      const embedding = result.embedding.values;
      
      results.push({
        ...pattern,
        id,
        embedding
      });
      console.log(`Embedded: ${pattern.name}`);
    }

    const sqls = results.map((p) => {
      return `INSERT INTO patterns (id, name, category, severity, description, why_it_matters, plain_english, how_it_should_be, negotiation_script, suggested_alternative, embedding)
VALUES ('${p.id}', '${p.name.replace(/'/g, "''")}', '${p.category}', '${p.severity}', '${p.description.replace(/'/g, "''")}', '${p.why_it_matters.replace(/'/g, "''")}', '${p.plain_english.replace(/'/g, "''")}', '${p.how_it_should_be.replace(/'/g, "''")}', '${p.negotiation_script.replace(/'/g, "''")}', '${p.suggested_alternative.replace(/'/g, "''")}', '[${p.embedding.join(",")}]')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  severity = EXCLUDED.severity,
  description = EXCLUDED.description,
  why_it_matters = EXCLUDED.why_it_matters,
  plain_english = EXCLUDED.plain_english,
  how_it_should_be = EXCLUDED.how_it_should_be,
  negotiation_script = EXCLUDED.negotiation_script,
  suggested_alternative = EXCLUDED.suggested_alternative,
  embedding = EXCLUDED.embedding;`;
    });

    fs.writeFileSync("insert_patterns.sql", sqls.join("\n\n"));
    console.log("Success! SQL saved to insert_patterns.sql (with REAL embeddings)");
  } catch (error) {
    console.error("Error generating SQL:", error);
    process.exit(1);
  }
}

generateEmbeddings();
