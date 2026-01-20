export interface ContractPattern {
  id: string;
  name: string;
  category: "liability" | "ip" | "termination" | "payment" | "scope" | "confidentiality" | "general" | "contradiction" | "vague" | "industry-specific";
  severity: "critical" | "high" | "medium" | "low";
  patterns: RegExp[];
  description: string;
  whyItMatters: string;
  plainEnglish: string;
  howItShouldBe: string;
  negotiationScript: string;
  suggestedAlternative: string;
  industry?: "tech" | "healthcare" | "finance" | "real-estate" | "construction";
}

export const contractPatterns: ContractPattern[] = [
  {
    id: "unlimited-liability",
    name: "Unlimited Liability",
    category: "liability",
    severity: "critical",
    patterns: [
      /unlimited\s+liability/gi,
      /liable\s+for\s+all\s+(damages|losses)/gi,
      /responsible\s+for\s+any\s+and\s+all\s+(damages|losses|claims|costs)/gi,
      /full\s+and\s+complete\s+liability/gi,
      /no\s+limit(ation)?\s+(on|to)\s+(the\s+)?(contractor'?s?|your)\s+liability/gi,
      /shall\s+be\s+(fully\s+)?liable\s+without\s+limit/gi,
      /accept\s+(full|complete|total)\s+liability/gi,
      /assume\s+all\s+(risk|liability)/gi,
      /unlimited\s+in\s+scope\s+and\s+amount/gi,
      /total\s+exposure\s+is\s+unlimited/gi,
      /not\s+capped\s+by\s+any\s+amount/gi,
      /liability\s+shall\s+be\s+absolute/gi,
      /no\s+provision\s+herein\s+shall\s+limit/gi,
      /shall\s+have\s+no\s+upper\s+limit/gi,
      /notwithstanding\s+anything\s+to\s+the\s+contrary,\s+liability\s+is\s+unlimited/gi,
    ],
    description: "The contract requires you to accept unlimited financial liability for any issues that arise.",
    whyItMatters: "Unlimited liability means you could be on the hook for damages far exceeding what you were paid. A single mistake could bankrupt you.",
    plainEnglish: "This means if anything goes wrong, you could owe them unlimited money - even millions of dollars. There's no cap on what you'd have to pay.",
    howItShouldBe: "Your responsibility should be limited to a fair amount, like the total you're being paid for the work. For example: 'Liability is limited to the amount paid under this contract.'",
    negotiationScript: "I'd be happy to accept reasonable liability terms. Could we cap liability at [the project fee / 2x the project fee]? This is standard practice and protects both parties fairly.",
    suggestedAlternative: "Liability shall be limited to the total fees paid under this agreement, or [specific amount].",
  },
  {
    id: "perpetual-ip-rights",
    name: "Perpetual IP Rights Transfer",
    category: "ip",
    severity: "critical",
    patterns: [
      /perpetual\s+(and\s+)?irrevocable\s+(license|rights?|ownership)/gi,
      /in\s+perpetuity/gi,
      /forever\s+(assign|transfer|grant)/gi,
      /all\s+intellectual\s+property\s+(rights?\s+)?(shall\s+)?belong\s+to/gi,
      /work\s+for\s+hire/gi,
      /assigns?\s+all\s+(right|title|interest)/gi,
      /exclusive\s+worldwide\s+license/gi,
      /irrevocable\s+transfer/gi,
    ],
    description: "You're being asked to permanently transfer all intellectual property rights, potentially including pre-existing work or tools.",
    whyItMatters: "This could mean you can't reuse your own code, designs, or methods on future projects. It may even affect tools you built before this contract.",
    plainEnglish: "They want to own everything you create forever - and maybe even stuff you made before this job. You couldn't reuse any of your own work ever again.",
    howItShouldBe: "They should only own what you make specifically for them, not your existing tools or methods. For example: 'Client owns the final deliverables. Contractor keeps their existing tools and methods.'",
    negotiationScript: "I'm happy to transfer IP for the deliverables specific to this project. However, I'd like to retain rights to my pre-existing tools and methodologies. Can we add a clause preserving my background IP?",
    suggestedAlternative: "Client receives ownership of project deliverables upon final payment. Contractor retains rights to pre-existing materials, tools, and general methodologies.",
  },
  {
    id: "unilateral-termination",
    name: "Unilateral Termination Rights",
    category: "termination",
    severity: "high",
    patterns: [
      /client\s+may\s+terminate\s+(this\s+)?(agreement\s+)?at\s+any\s+time/gi,
      /terminate\s+(immediately\s+)?without\s+(cause|reason|notice)/gi,
      /sole\s+discretion\s+to\s+terminate/gi,
      /right\s+to\s+cancel\s+at\s+any\s+time/gi,
      /terminate\s+for\s+(any|no)\s+reason/gi,
      /may\s+terminate\s+immediately/gi,
      /instant\s+termination/gi,
    ],
    description: "The client can end the contract at any time without reason, but you may not have the same right.",
    whyItMatters: "You could be left without income mid-project with no compensation for work already completed or opportunities you turned down.",
    plainEnglish: "They can fire you anytime they want, for no reason at all. But you might still be stuck with obligations to them.",
    howItShouldBe: "Both sides should have equal rights to end the contract, with proper notice. For example: 'Either side can end this with 14 days notice. Work done until then gets paid.'",
    negotiationScript: "I understand the need for flexibility. Could we add a mutual termination clause with [14/30] days notice? I'd also like to ensure payment for work completed up to termination.",
    suggestedAlternative: "Either party may terminate with 14 days written notice. Upon termination, Client shall pay for all work completed to date.",
  },
  {
    id: "no-kill-fee",
    name: "No Kill Fee or Cancellation Protection",
    category: "payment",
    severity: "high",
    patterns: [
      /no\s+(payment|compensation)\s+(is\s+)?(due|owed|required)\s+(upon|after)\s+(cancellation|termination)/gi,
      /forfeit\s+(all\s+)?(payment|compensation)/gi,
      /shall\s+not\s+be\s+(entitled|owed)\s+(to\s+)?(any\s+)?payment\s+if/gi,
      /waive\s+(all\s+)?claims?\s+(to|for)\s+(payment|compensation)/gi,
      /no\s+refund/gi,
      /non-?refundable/gi,
    ],
    description: "If the project is cancelled, you may not be entitled to any payment for work already completed.",
    whyItMatters: "You could invest weeks of work only to have the project cancelled and receive nothing in return.",
    plainEnglish: "If they cancel the project, you get nothing - even for work you've already done. All that time and effort would be free for them.",
    howItShouldBe: "You should always get paid for work you've completed. For example: 'If cancelled, you get paid for all completed work plus 25% of the remaining amount.'",
    negotiationScript: "To protect both of us, I'd like to add a kill fee clause. If the project is cancelled, I'd receive payment for work completed plus [25-50%] of the remaining project value. This is standard in the industry.",
    suggestedAlternative: "Upon cancellation, Contractor shall receive payment for all work completed plus 25% of remaining project fees as a kill fee.",
  },
  {
    id: "scope-creep-clause",
    name: "Unlimited Revisions or Scope",
    category: "scope",
    severity: "high",
    patterns: [
      /unlimited\s+revisions?/gi,
      /as\s+many\s+(changes?|revisions?)\s+as\s+(necessary|needed|required)/gi,
      /until\s+(client\s+is\s+)?satisfied/gi,
      /to\s+(client'?s?|your)\s+(complete\s+)?satisfaction/gi,
      /any\s+(and\s+all\s+)?additional\s+(work|tasks?|changes?)\s+as\s+(requested|required)/gi,
      /without\s+additional\s+(cost|charge|fee)/gi,
      /no\s+extra\s+charge\s+for\s+(revisions?|changes?)/gi,
    ],
    description: "The contract allows unlimited changes or additions without extra compensation.",
    whyItMatters: "Without clear scope boundaries, you could end up doing 3x the work for the same pay. 'Unlimited revisions' often leads to project hell.",
    plainEnglish: "They can ask for endless changes and you have to do them all for free. The project could go on forever with no extra pay.",
    howItShouldBe: "There should be a clear limit on changes included in the price. For example: '2 rounds of revisions included. Extra changes cost extra.'",
    negotiationScript: "I want to make sure we're both happy with the result. Could we specify [2-3] rounds of revisions included, with additional revisions at my hourly rate of [$X]? This keeps us focused and efficient.",
    suggestedAlternative: "Project includes [2] rounds of revisions. Additional revisions will be billed at $[X] per hour with client approval.",
  },
  {
    id: "non-compete-broad",
    name: "Overly Broad Non-Compete",
    category: "general",
    severity: "high",
    patterns: [
      /shall\s+not\s+(work|provide\s+services)\s+(for|to)\s+(any\s+)?competitor/gi,
      /non-?compete/gi,
      /refrain\s+from\s+(working|providing\s+services)\s+in\s+(the\s+)?(same|similar)\s+(industry|field)/gi,
      /exclusive\s+(services?|work)\s+(for|to)\s+client/gi,
      /not\s+engage\s+in\s+(any\s+)?(similar|competing)\s+(work|business)/gi,
      /restriction\s+on\s+competing/gi,
      /covenant\s+not\s+to\s+compete/gi,
    ],
    description: "You're restricted from working with competitors or in related fields, potentially for an extended period.",
    whyItMatters: "This could prevent you from taking other clients in your specialty, severely limiting your income potential.",
    plainEnglish: "You can't work for anyone else in this industry - maybe for months or years. This could stop you from earning a living.",
    howItShouldBe: "Non-compete should be limited and specific. For example: 'During the project only, don't work on the exact same product for their direct competitor.'",
    negotiationScript: "I understand the concern about competitors, but as a freelancer, I need to be able to work in my field. Could we limit this to [not working on directly competing products during the project] rather than a blanket restriction?",
    suggestedAlternative: "During the project term, Contractor agrees not to work on directly competing products for [specific named competitor]. This restriction ends upon project completion.",
  },
  {
    id: "payment-upon-satisfaction",
    name: "Subjective Payment Conditions",
    category: "payment",
    severity: "high",
    patterns: [
      /payment\s+(upon|after)\s+(client\s+)?satisfaction/gi,
      /when\s+(client\s+is\s+)?satisfied/gi,
      /payable\s+(only\s+)?if\s+(client\s+)?approves?/gi,
      /at\s+(client'?s?|sole)\s+discretion/gi,
      /contingent\s+(upon|on)\s+(client\s+)?approval/gi,
      /if\s+work\s+is\s+(deemed\s+)?acceptable/gi,
      /upon\s+acceptance\s+by\s+client/gi,
    ],
    description: "Payment depends on subjective client satisfaction rather than objective deliverables.",
    whyItMatters: "A client could claim dissatisfaction indefinitely to avoid paying, even if you delivered exactly what was specified.",
    plainEnglish: "You only get paid if they're 'happy' - which they can decide means never. Even if you do everything right, they could refuse to pay.",
    howItShouldBe: "Payment should be based on completing specific tasks, not feelings. For example: 'Payment due when you deliver X, Y, and Z as agreed.'",
    negotiationScript: "I want to ensure we're aligned on expectations. Could we tie payment to specific, objective milestones instead of subjective satisfaction? I'd suggest [milestone 1, milestone 2, etc.].",
    suggestedAlternative: "Payment is due upon delivery of specified milestones as outlined in the project scope, not contingent on subjective satisfaction.",
  },
  {
    id: "indemnification-broad",
    name: "Broad Indemnification Clause",
    category: "liability",
    severity: "critical",
    patterns: [
      /indemnify\s+(and\s+)?hold\s+harmless/gi,
      /defend,?\s+indemnify/gi,
      /indemnif(y|ication)\s+(client|company)\s+(for|against|from)\s+all/gi,
      /any\s+and\s+all\s+claims?,?\s+damages?,?\s+(and\s+)?liabilit(y|ies)/gi,
      /responsible\s+for\s+(all|any)\s+(third[- ]party\s+)?claims?/gi,
      /hold\s+harmless\s+from\s+all/gi,
      /indemnify\s+against\s+any\s+loss/gi,
    ],
    description: "You must cover all legal costs and damages, even for things outside your control.",
    whyItMatters: "You could be legally and financially responsible for claims arising from the client's use of your work, even if they used it improperly.",
    plainEnglish: "If anyone sues them for anything related to your work, you have to pay all their legal bills and damages - even if it wasn't your fault.",
    howItShouldBe: "You should only be responsible for problems you actually caused. For example: 'You only cover legal costs if you were clearly at fault or negligent.'",
    negotiationScript: "I'm happy to take responsibility for my own work, but the current indemnification is quite broad. Could we limit it to claims directly arising from my negligence or breach of contract?",
    suggestedAlternative: "Contractor shall indemnify Client only for claims directly resulting from Contractor's gross negligence or willful misconduct.",
  },
  {
    id: "auto-renewal",
    name: "Automatic Renewal Without Notice",
    category: "termination",
    severity: "medium",
    patterns: [
      /automatically\s+renew/gi,
      /auto[- ]?renewal/gi,
      /shall\s+renew\s+(automatically|without\s+notice)/gi,
      /unless\s+(written\s+)?notice\s+is\s+(given|provided)\s+\d+\s+days?\s+prior/gi,
      /continues?\s+indefinitely\s+unless/gi,
      /evergreen\s+contract/gi,
      /rolling\s+renewal/gi,
    ],
    description: "The contract automatically renews, potentially locking you in without explicit consent.",
    whyItMatters: "You could be committed to another term without realizing it, preventing you from renegotiating rates or taking other opportunities.",
    plainEnglish: "The contract keeps going forever unless you remember to cancel. You could be stuck for another year without agreeing to it.",
    howItShouldBe: "Both sides should agree to continue. For example: 'Contract ends on X date. To renew, both sides must agree in writing.'",
    negotiationScript: "I'd prefer contracts that require mutual agreement to renew. Could we change this to require written agreement from both parties before renewal?",
    suggestedAlternative: "This agreement expires on [date]. Renewal requires written agreement from both parties at least 30 days before expiration.",
  },
  {
    id: "confidentiality-perpetual",
    name: "Perpetual Confidentiality",
    category: "confidentiality",
    severity: "medium",
    patterns: [
      /confidential(ity)?\s+(obligations?\s+)?(shall\s+)?(survive|continue)\s+(in\s+)?perpetuity/gi,
      /forever\s+(remain\s+)?confidential/gi,
      /indefinite(ly)?\s+confidential/gi,
      /no\s+(time\s+)?limit\s+(on\s+)?confidentiality/gi,
      /confidential\s+(for|in)\s+perpetuity/gi,
      /confidentiality\s+shall\s+never\s+expire/gi,
      /obligation\s+to\s+keep\s+confidential\s+shall\s+not\s+expire/gi,
      /without\s+limitation\s+as\s+to\s+time/gi,
    ],
    description: "Confidentiality obligations never expire, binding you indefinitely.",
    whyItMatters: "Information that's confidential today may become public knowledge. Perpetual confidentiality could create legal exposure for discussing publicly known information.",
    plainEnglish: "You can never talk about anything from this job - forever. Even stuff that becomes public knowledge later could get you in trouble.",
    howItShouldBe: "Confidentiality should have a reasonable time limit. For example: 'Keep things confidential for 3 years after the project ends.'",
    negotiationScript: "I take confidentiality seriously and will protect your information. However, perpetual obligations are unusual. Could we set this to [2-5] years, which is industry standard?",
    suggestedAlternative: "Confidentiality obligations shall survive for a period of 3 years following termination of this agreement.",
  },
  {
    id: "tech-source-code-escrow",
    name: "Source Code Escrow Requirement",
    category: "industry-specific",
    industry: "tech",
    severity: "medium",
    patterns: [
      /source\s+code\s+escrow/gi,
      /deposit\s+(the\s+)?source\s+code\s+with\s+(an\s+)?escrow\s+agent/gi,
      /release\s+of\s+source\s+code\s+from\s+escrow/gi,
    ],
    description: "The contract requires you to deposit your source code with a third party for the client's potential future use.",
    whyItMatters: "This can be costly and technically burdensome. It also creates a risk of unauthorized source code release if the escrow terms are too broad.",
    plainEnglish: "They want you to give a copy of your secret 'recipe' to a third party. If you go out of business, they get to see it.",
    howItShouldBe: "Escrow should only be triggered by specific, narrow events like insolvency. The client should pay for the escrow service.",
    negotiationScript: "I understand your need for business continuity. However, source code escrow adds complexity. Could we instead agree to a robust transition plan, or at least have the client cover all escrow-related fees?",
    suggestedAlternative: "Contractor shall deposit source code into escrow, with release and fees governed by a separate Escrow Agreement. Client shall be responsible for all escrow fees.",
  },
  {
    id: "healthcare-hipaa-compliance",
    name: "HIPAA Compliance Obligations",
    category: "industry-specific",
    industry: "healthcare",
    severity: "high",
    patterns: [
      /HIPAA\s+compliant/gi,
      /health\s+insurance\s+portability\s+and\s+accountability\s+act/gi,
      /protected\s+health\s+information/gi,
      /business\s+associate\s+agreement/gi,
      /BAA\s+(shall\s+)?be\s+executed/gi,
    ],
    description: "The contract mandates strict adherence to US health data privacy laws (HIPAA).",
    whyItMatters: "Violating HIPAA can lead to massive federal fines and criminal liability. This is a high-stakes obligation requiring robust technical and administrative safeguards.",
    plainEnglish: "You have to follow very strict rules about protecting patient information. If you leak any data, the government could fine you millions.",
    howItShouldBe: "Ensure a formal Business Associate Agreement (BAA) is in place that clearly defines your responsibilities and limits your liability for the client's own failures.",
    negotiationScript: "I'm prepared to meet HIPAA standards. I've reviewed the BAA requirements and would like to ensure our liability is capped at a reasonable level for any accidental breaches.",
    suggestedAlternative: "Both parties shall execute a Business Associate Agreement (BAA) and comply with all applicable HIPAA regulations regarding Protected Health Information (PHI).",
  },
  {
    id: "finance-anti-money-laundering",
    name: "Anti-Money Laundering (AML) Requirements",
    category: "industry-specific",
    industry: "finance",
    severity: "high",
    patterns: [
      /anti-money\s+laundering/gi,
      /AML\s+compliance/gi,
      /know\s+your\s+customer/gi,
      /KYC\s+procedures/gi,
      /office\s+of\s+foreign\s+assets\s+control/gi,
      /OFAC\s+sanctions/gi,
    ],
    description: "The contract requires compliance with financial regulations aimed at preventing money laundering and terrorism financing.",
    whyItMatters: "Failure to comply can lead to severe regulatory penalties and exclusion from the financial system.",
    plainEnglish: "You have to help them make sure the money isn't coming from criminals or terrorists. This involves a lot of paperwork and checking IDs.",
    howItShouldBe: "Responsibilities should be clearly defined, and you should be entitled to rely on the client's own compliance checks where appropriate.",
    negotiationScript: "I'm committed to AML compliance. Could we clarify which specific KYC documents you'll need from my end to streamline the process?",
    suggestedAlternative: "Contractor shall comply with all applicable AML and KYC laws and regulations, and provide necessary documentation upon reasonable request from Client.",
  },
  {
    id: "real-estate-environmental-liability",
    name: "Environmental Liability Indemnity",
    category: "industry-specific",
    industry: "real-estate",
    severity: "critical",
    patterns: [
      /environmental\s+hazard/gi,
      /hazardous\s+materials?/gi,
      /toxic\s+substances?/gi,
      /environmental\s+indemnity/gi,
      /remediation\s+of\s+contamination/gi,
    ],
    description: "The contract makes you responsible for cleanup costs related to environmental contamination on the property.",
    whyItMatters: "Environmental cleanups can cost millions and take decades. This is a massive risk, especially for older properties.",
    plainEnglish: "If there's toxic waste or pollution on the property, you have to pay to clean it all up - even if you didn't put it there.",
    howItShouldBe: "You should only be responsible for contamination YOU caused during your occupancy. Previous contamination should be the owner's responsibility.",
    negotiationScript: "I can't accept responsibility for pre-existing environmental issues. Can we limit this indemnity to only those hazardous materials introduced to the property by us?",
    suggestedAlternative: "Contractor's liability for environmental issues shall be limited to contamination directly caused by Contractor's activities on the premises.",
  },
  {
    id: "construction-liquidated-damages-delay",
    name: "Liquidated Damages for Delay",
    category: "industry-specific",
    industry: "construction",
    severity: "high",
    patterns: [
      /liquidated\s+damages\s+for\s+delay/gi,
      /per\s+day\s+delay\s+penalty/gi,
      /failure\s+to\s+meet\s+substantial\s+completion\s+date/gi,
    ],
    description: "The contract sets a fixed daily penalty if the project is not finished by a certain date.",
    whyItMatters: "Delays in construction are common and often outside your control (weather, supplies). These penalties can quickly wipe out your profit.",
    plainEnglish: "For every day you're late finishing the job, you owe them a set amount of money. This can get very expensive very fast.",
    howItShouldBe: "The amount should be a reasonable estimate of actual losses. There should be a 'grace period' and exceptions for force majeure events.",
    negotiationScript: "The daily penalty seems high given the potential for supply chain delays. Could we lower the daily rate and add a 10-day grace period before liquidated damages apply?",
    suggestedAlternative: "Liquidated damages for delay shall be $[X] per day, starting 14 days after the scheduled Substantial Completion date, excluding delays caused by Force Majeure.",
  },
  {
    id: "tech-reverse-engineering-prohibition",
    name: "Bilateral Reverse Engineering Prohibition",
    category: "industry-specific",
    industry: "tech",
    severity: "medium",
    patterns: [
      /prohibit(ion)?\s+on\s+reverse\s+engineering/gi,
      /shall\s+not\s+(reverse\s+engineer|decompile|disassemble)/gi,
      /no\s+derivation\s+of\s+source\s+code/gi,
    ],
    description: "Strict prohibition against taking apart software or hardware to see how it works.",
    whyItMatters: "While standard, ensure it's mutual if you're also sharing proprietary code/tools. It protects your core trade secrets.",
    plainEnglish: "You're not allowed to peek 'under the hood' of their software to copy how it's built.",
    howItShouldBe: "Make it mutual if both sides are sharing technical secrets. Ensure there are exceptions for legally required interoperability.",
    negotiationScript: "Since we're both sharing proprietary technical information, I'd like this reverse engineering prohibition to be mutual.",
    suggestedAlternative: "Neither party shall reverse engineer, decompile, or disassemble any software or hardware provided by the other party.",
  },
  {
    id: "nda-non-solicitation-hidden",
    name: "Hidden Non-Solicitation in NDA",
    category: "confidentiality",
    severity: "high",
    patterns: [
      /non-?solicitation\s+(of\s+)?employees/gi,
      /shall\s+not\s+(hire|recruit|solicit|induce)\s+(any\s+)?(employees?|staff|personnel)/gi,
      /refrain\s+from\s+hiring\s+away/gi,
    ],
    description: "A clause in a non-disclosure agreement that prevents you from hiring the other party's employees.",
    whyItMatters: "This is a significant business restriction hidden in what's supposed to be just a confidentiality agreement. It can limit your growth and hiring options.",
    plainEnglish: "Hidden in the 'secret-keeping' contract is a rule saying you can't hire their workers. This has nothing to do with keeping secrets!",
    howItShouldBe: "Non-solicitation should be in a separate agreement or clearly labeled. It should be limited in time and scope (e.g., only those you worked with).",
    negotiationScript: "I noticed a non-solicitation clause in this NDA. I'd prefer to keep this document strictly focused on confidentiality. Can we remove the non-solicitation provision?",
    suggestedAlternative: "Remove the non-solicitation clause, or limit it to: 'Party A shall not knowingly solicit Party B's employees involved in this specific project for 6 months.'",
  },
  {
    id: "nda-purpose-limited",
    name: "Broad Permitted Use of Info",
    category: "confidentiality",
    severity: "medium",
    patterns: [
      /permitted\s+use\s+(of\s+)?(confidential\s+)?information/gi,
      /use\s+for\s+(any|all)\s+business\s+purposes/gi,
      /use\s+in\s+connection\s+with\s+(the\s+)?business/gi,
    ],
    description: "The NDA allows the recipient to use your secrets for broad, undefined business purposes.",
    whyItMatters: "The information should only be used for the 'Purpose' of discussing a potential partnership or project. Broad use clauses can allow them to use your ideas to compete with you.",
    plainEnglish: "This part says they can use your secrets for almost anything. It should say they can ONLY use them to decide if they want to work with you.",
    howItShouldBe: "Specify a narrow 'Purpose' (e.g., 'evaluating a potential business transaction') and restrict use of info strictly to that purpose.",
    negotiationScript: "The 'Permitted Use' clause is a bit broad. Could we define a specific 'Purpose' for this disclosure and limit use of the information to only that Purpose?",
    suggestedAlternative: "Confidential Information shall be used by the Receiving Party solely for the purpose of [evaluating a potential business relationship] and for no other purpose.",
  },
    {
      id: "nda-perpetual-confidentiality",
      name: "Perpetual NDA Confidentiality",
      category: "confidentiality",
      severity: "medium",
      patterns: [
        /confidentiality\s+(obligations?\s+)?(shall\s+)?(survive|continue)\s+(in\s+)?perpetuity/gi,
        /forever\s+(remain\s+)?confidential/gi,
        /no\s+(time\s+)?limit\s+(on\s+)?confidentiality/gi,
      ],
      description: "Confidentiality obligations in the NDA never expire.",
      whyItMatters: "Standard NDAs should have a 2-5 year term. Perpetual obligations create indefinite legal risk.",
      plainEnglish: "You have to keep these secrets forever, which is usually not necessary or fair.",
      howItShouldBe: "A term of 2 or 3 years is usually sufficient.",
      negotiationScript: "I'm happy to protect your information, but can we limit the confidentiality period to 3 years?",
      suggestedAlternative: "The obligations of confidentiality shall survive for 3 years after disclosure.",
    },
    {
      id: "offer-letter-at-will-nuance",
      name: "Harsh At-Will Termination",
      category: "termination",
      severity: "medium",
      patterns: [
        /at[- ]will\s+employment/gi,
        /terminate\s+at\s+any\s+time\s+for\s+any\s+reason/gi,
        /without\s+notice\s+or\s+cause/gi,
      ],
      description: "The offer letter emphasizes immediate termination for any reason.",
      whyItMatters: "While standard in some regions, it lack security. Ensure some notice period is provided if possible.",
      plainEnglish: "They can fire you today for no reason at all.",
      howItShouldBe: "A notice period of 2-4 weeks is more typical for professional roles.",
      negotiationScript: "I understand the at-will nature, but can we agree on a 2-week notice period for both sides?",
      suggestedAlternative: "Either party may terminate this employment with 2 weeks' notice.",
    },
    {
      id: "creative-moral-rights-waiver",
      name: "Moral Rights Waiver",
      category: "ip",
      severity: "high",
      patterns: [
        /waive\s+(all\s+)?moral\s+rights/gi,
        /droit\s+moral/gi,
        /right\s+of\s+attribution/gi,
      ],
      description: "You are being asked to waive your moral rights (the right to be credited for your work).",
      whyItMatters: "This allows the client to use your work without giving you credit or even modifying it in ways you disagree with.",
      plainEnglish: "You're giving up the right to say 'I made this' and the right to stop them from changing your work.",
      howItShouldBe: "You should retain the right of attribution.",
      negotiationScript: "I'd like to retain my moral rights of attribution. Can we remove the waiver?",
      suggestedAlternative: "Client shall provide attribution to Contractor where feasible.",
    },
    {
      id: "nda-residuals-clause",
      name: "Dangerous Residuals Clause",
      category: "confidentiality",
      severity: "high",
      patterns: [
        /residuals?\s+clause/gi,
        /unaided\s+memory/gi,
        /right\s+to\s+use\s+ideas\s+retained\s+in\s+memory/gi,
        /not\s+be\s+precluded\s+from\s+using\s+information/gi,
      ],
      description: "Allows the recipient to use any ideas they 'remember' from your confidential info without it being a breach.",
      whyItMatters: "This is a backdoor that lets companies steal your ideas or trade secrets as long as they claim they just 'remembered' them.",
      plainEnglish: "They can use your secrets if they can remember them without looking at notes. This makes the whole NDA almost useless.",
      howItShouldBe: "Residuals clauses should be removed entirely for sensitive trade secrets.",
      negotiationScript: "I noticed a 'residuals' clause. This could potentially allow my proprietary techniques to be used without permission. Can we remove this section?",
      suggestedAlternative: "Remove all references to 'residuals' or 'unaided memory' use.",
    },
    {
      id: "termination-immediate-without-cure",
      name: "Immediate Termination Without Cure Period",
      category: "termination",
      severity: "high",
      patterns: [
        /terminate\s+immediately\s+(upon|for)\s+any\s+breach/gi,
        /without\s+(any\s+)?opportunity\s+to\s+cure/gi,
        /no\s+right\s+to\s+remedy/gi,
      ],
      description: "The contract can be canceled immediately for any small mistake without giving you a chance to fix it.",
      whyItMatters: "Minor administrative errors shouldn't result in immediate termination. You should have a chance to correct mistakes.",
      plainEnglish: "If you make one tiny mistake, they can fire you on the spot without letting you fix it first.",
      howItShouldBe: "A 'cure period' of 5-10 days should be provided for most breaches.",
      negotiationScript: "Can we add a standard 10-day cure period? This gives both of us a fair chance to resolve any minor issues before ending the relationship.",
      suggestedAlternative: "If a party breaches this agreement, the other party shall provide written notice and 10 days to cure the breach before terminating.",
    },
      {
        id: "ip-broad-work-for-hire",
        name: "Overbroad 'Work for Hire'",
        category: "ip",
        severity: "high",
        patterns: [
          /all\s+work\s+performed\s+is\s+a\s+work\s+made\s+for\s+hire/gi,
          /contractor\s+waives\s+all\s+rights\s+in\s+and\s+to/gi,
          /including\s+all\s+pre-existing\s+materials/gi,
        ],
        description: "Claims that everything you do, even unrelated to the project, belongs to the client.",
        whyItMatters: "You might accidentally give them ownership of tools or code you developed elsewhere or before the project.",
        plainEnglish: "They want to own everything you do while working with them, even stuff you made on your own time or before you met them.",
        howItShouldBe: "Ownership should be limited to the specific deliverables created for the project.",
        negotiationScript: "I want to ensure my background tools remains mine. Can we specify that 'Work for Hire' only applies to the specific deliverables listed in the SOW?",
        suggestedAlternative: "Only the final deliverables specifically created for the Client under this SOW shall be considered Work Made for Hire.",
      },
      {
        id: "offer-letter-probationary-period",
        name: "Indefinite Probationary Period",
        category: "general",
        severity: "medium",
        patterns: [
          /probationary\s+period\s+may\s+be\s+extended/gi,
          /at\s+the\s+sole\s+discretion\s+of\s+the\s+employer/gi,
          /subject\s+to\s+satisfactory\s+completion\s+of\s+probation/gi,
        ],
        description: "Your probation period can be extended indefinitely at the employer's whim.",
        whyItMatters: "Probation often means fewer benefits and easier termination. Indefinite probation keeps you in a vulnerable state.",
        plainEnglish: "They can keep you 'on trial' for as long as they want, which might mean you don't get full benefits or job security.",
        howItShouldBe: "Probation should have a fixed end date (e.g., 3 or 6 months).",
        negotiationScript: "Could we specify a maximum length for the probationary period, such as 90 days?",
        suggestedAlternative: "The probationary period shall be 90 days and may only be extended once for an additional 30 days upon written notice.",
      },
      {
        id: "nda-non-compete-hidden",
        name: "Non-Compete Hidden in NDA",
        category: "general",
        severity: "critical",
        patterns: [
          /shall\s+not\s+(engage\s+in|perform\s+services\s+for)\s+(any|a)\s+competing\s+business/gi,
          /restricted\s+from\s+working\s+with\s+competitors/gi,
        ],
        description: "A non-disclosure agreement that also restricts you from working for competitors.",
        whyItMatters: "NDAs should only protect information. Hidden non-competes can unexpectedly block your entire career.",
        plainEnglish: "This 'secrecy' contract actually stops you from working for other companies in this industry.",
        howItShouldBe: "Remove non-compete language from NDAs.",
        negotiationScript: "I noticed a non-compete clause in this NDA. Can we remove it and keep this focused on confidentiality?",
        suggestedAlternative: "Remove the non-compete clause entirely.",
      },
      {
        id: "universal-sole-discretion",
        name: "One-Sided 'Sole Discretion'",
        category: "general",
        severity: "medium",
        patterns: [
          /at\s+(the\s+)?(company's|client's|sole)\s+discretion/gi,
          /as\s+determined\s+by\s+(the\s+)?(company|client)\s+alone/gi,
          /without\s+the\s+need\s+for\s+any\s+further\s+consent/gi,
        ],
        description: "The other party can make decisions that affect you without your input or consent.",
        whyItMatters: "This allows them to change terms, approve work, or extend deadlines unilaterally.",
        plainEnglish: "They get to decide things on their own without asking you, even if it affects your pay or work.",
        howItShouldBe: "Decisions should be made by mutual agreement.",
        negotiationScript: "Can we change 'sole discretion' to 'mutual agreement' to ensure we're both aligned on key decisions?",
      suggestedAlternative: "By mutual written agreement of both parties.",
    },
    {
      id: "arbitration-mandatory",
      name: "Mandatory Arbitration",
      category: "general",
      severity: "high",
      patterns: [
        /mandatory\s+arbitration/gi,
        /binding\s+arbitration/gi,
        /shall\s+be\s+settled\s+by\s+arbitration/gi,
        /waive\s+right\s+to\s+jury\s+trial/gi,
        /american\s+arbitration\s+association/gi,
        /jams\s+rules/gi,
      ],
      description: "You are giving up your right to sue in court and must use a private arbitrator instead.",
      whyItMatters: "Arbitration can be expensive and often favors corporations over individuals. You also waive your right to a trial by jury.",
      plainEnglish: "If you have a problem, you can't go to normal court. You have to go to a private judge (arbitrator) which can be very expensive and harder to win.",
      howItShouldBe: "Arbitration should be optional, or the company should pay for it.",
      negotiationScript: "I'd prefer to keep my options open for legal resolution. Can we make arbitration optional or at least have the company cover all arbitration fees?",
      suggestedAlternative: "Any dispute may be resolved through mediation or court proceedings in [Your State].",
    },
    {
      id: "class-action-waiver",
      name: "Class Action Waiver",
      category: "general",
      severity: "high",
      patterns: [
        /waive\s+any\s+right\s+to\s+participate\s+in\s+a\s+class\s+action/gi,
        /no\s+class\s+action/gi,
        /prohibited\s+from\s+bringing\s+claims\s+as\s+a\s+class/gi,
        /individual\s+basis\s+only/gi,
      ],
      description: "You cannot join with others to sue the company together.",
      whyItMatters: "Individual claims are often too small to be worth suing over, but class actions allow many small claims to be grouped together for justice.",
      plainEnglish: "You can't team up with other workers to sue the company for the same problem. You're on your own.",
      howItShouldBe: "This clause should be removed to preserve your rights.",
      negotiationScript: "This class action waiver seems unnecessary for our relationship. Can we remove it?",
      suggestedAlternative: "Remove the class action waiver clause.",
    },
    {
      id: "broad-audit-rights",
      name: "Overbroad Audit Rights",
      category: "general",
      severity: "medium",
      patterns: [
        /right\s+to\s+audit\s+(your|contractor'?s?)\s+books/gi,
        /access\s+to\s+(all\s+)?records/gi,
        /inspect\s+(your|contractor'?s?)\s+premises/gi,
        /at\s+any\s+time\s+without\s+notice/gi,
      ],
      description: "The company can look through all your personal or business records anytime.",
      whyItMatters: "This is a privacy invasion and can be used to harvest your business secrets or verify unrelated income.",
      plainEnglish: "They want to be able to look at all your business and personal records whenever they want. It's an invasion of privacy.",
      howItShouldBe: "Audit rights should be limited to once a year, with notice, and only for records related to the project.",
      negotiationScript: "I'm happy to provide records related to this project, but broad audit rights aren't standard for this type of work. Can we limit audits to once per year with 10 days notice?",
      suggestedAlternative: "Client may audit records directly related to this agreement once annually with 10 days' notice.",
    },
    {
      id: "net-90-payment",
      name: "Extremely Late Payment Terms",
      category: "payment",
      severity: "medium",
      patterns: [
        /net\s+90/gi,
        /net\s+120/gi,
        /payment\s+within\s+90\s+days/gi,
        /payment\s+within\s+120\s+days/gi,
      ],
      description: "You won't get paid for three or four months after you finish your work.",
      whyItMatters: "Waiting 90-120 days for payment can kill your cash flow and make it hard to pay your own bills.",
      plainEnglish: "You'll have to wait 3 or 4 months to get paid after you do the work. That's a huge delay.",
      howItShouldBe: "Standard payment terms are Net 15 or Net 30.",
      negotiationScript: "Waiting 90 days for payment is difficult for my business cash flow. Can we move to Net 30?",
      suggestedAlternative: "Payment shall be made within 30 days of invoice receipt.",
    },
    {
      id: "pay-when-paid",
      name: "Pay-When-Paid Clause",
      category: "payment",
      severity: "high",
      patterns: [
        /payment\s+contingent\s+on\s+receipt\s+of\s+funds\s+from\s+client/gi,
        /pay\s+when\s+paid/gi,
        /only\s+after\s+payment\s+received\s+from\s+end-?customer/gi,
      ],
      description: "You only get paid if the company's client pays them first.",
      whyItMatters: "You shouldn't take on the risk of their clients not paying. You did the work for THEM, and they should pay you regardless.",
      plainEnglish: "If their client doesn't pay them, they won't pay you. You're taking on their risk for free.",
      howItShouldBe: "You should be paid regardless of their client's actions.",
      negotiationScript: "I can't accept the risk of your customer not paying. My contract is with you, and I'd like to be paid on my standard term regardless of your customer's status.",
      suggestedAlternative: "Payment is due to Contractor within 30 days, regardless of Client's receipt of funds from third parties.",
    },
    {
      id: "offer-letter-bonus-clawback",
      name: "Sign-on Bonus Clawback",
      category: "payment",
      severity: "high",
      patterns: [
        /repay\s+(sign-?on\s+)?bonus/gi,
        /clawback/gi,
        /pro-?rata\s+repayment/gi,
        /reimburse\s+the\s+company\s+for\s+bonus/gi,
      ],
      description: "If you leave early, you have to pay back your sign-on bonus.",
      whyItMatters: "This acts as a 'golden handcuff' and can make it very expensive to leave a toxic work environment.",
      plainEnglish: "If you quit within the first year (or two), you have to give them the bonus money back. It makes you 'trapped' at the job.",
      howItShouldBe: "Clawbacks should be limited to the first 6 months or 1 year, and should be pro-rated.",
      negotiationScript: "I understand the need for stability, but the clawback period is a bit long. Can we make it pro-rated so it decreases every month I'm with the company?",
      suggestedAlternative: "If Employee leaves within 12 months, the sign-on bonus shall be repaid on a pro-rata basis.",
    },
    {
      id: "nda-survival-period",
      name: "Survival of NDA obligations",
      category: "confidentiality",
      severity: "medium",
      patterns: [
        /obligations\s+shall\s+survive\s+termination/gi,
        /continue\s+after\s+the\s+expiration/gi,
        /no\s+time\s+limit\s+on\s+survival/gi,
      ],
      description: "Your obligation to keep secrets continues even after you stop working for them.",
      whyItMatters: "This is normal, but it should have a time limit (e.g., 2 years) rather than being forever.",
      plainEnglish: "Even after you finish the job, you still have to keep their secrets. This part says how long that lasts.",
      howItShouldBe: "A period of 2-5 years is reasonable. Forever is not.",
      negotiationScript: "Can we limit the survival of confidentiality to 2 years after the project ends?",
      suggestedAlternative: "Survival of confidentiality obligations shall be limited to 2 years after termination.",
    },
    {
      id: "non-disparagement",
      name: "One-Sided Non-Disparagement",
      category: "general",
      severity: "medium",
      patterns: [
        /shall\s+not\s+(make\s+any\s+)?disparaging\s+remarks/gi,
        /refrain\s+from\s+negative\s+comments/gi,
        /non-?disparagement/gi,
      ],
      description: "You aren't allowed to say anything negative about the company, but they can say whatever they want about you.",
      whyItMatters: "This can prevent you from speaking out about bad experiences or warns others about a toxic company.",
      plainEnglish: "You're not allowed to say anything bad about them, even if it's true. But they might still be able to bad-mouth you.",
      howItShouldBe: "This should be mutual.",
      negotiationScript: "I'm happy to agree to a non-disparagement clause if it's mutual. Can we make it apply to both parties?",
      suggestedAlternative: "Both parties agree not to make any disparaging or negative comments about the other.",
    },
    {
      id: "assignment-without-consent",
      name: "Assignment Without Consent",
      category: "general",
      severity: "medium",
      patterns: [
        /company\s+may\s+assign\s+this\s+agreement\s+without\s+consent/gi,
        /freely\s+assignable\s+by\s+company/gi,
        /transfer\s+to\s+any\s+successor/gi,
      ],
      description: "The company can sell your contract to anyone else without asking you.",
      whyItMatters: "You might end up working for a company you don't like or that has a bad reputation.",
      plainEnglish: "They can 'sell' your contract to another company without asking you. You might end up working for someone you don't want to.",
      howItShouldBe: "Assignment should require consent, except for mergers and acquisitions.",
      negotiationScript: "I'd prefer that neither of us can assign the contract without the other's consent. Can we update this?",
      suggestedAlternative: "Neither party may assign this agreement without the prior written consent of the other party.",
    },
    {
      id: "governing-law-far-away",
      name: "Inconvenient Governing Law",
      category: "general",
      severity: "medium",
      patterns: [
        /governed\s+by\s+the\s+laws\s+of\s+(delaware|new\s+york|england|california)/gi,
        /jurisdiction\s+in\s+the\s+courts\s+of/gi,
        /exclusive\s+venue\s+in/gi,
      ],
      description: "Legal disputes will be handled in a state or country far from where you live.",
      whyItMatters: "If you have to sue them for payment, you might have to fly across the country and hire a lawyer in a different state, which is very expensive.",
      plainEnglish: "If there's a problem, you have to go to court in a different state (like Delaware or New York). It will be very expensive and hard for you.",
      howItShouldBe: "Governing law should be in your home state, or where the work is performed.",
      negotiationScript: "Since I'm located in [Your State], could we change the governing law and venue to [Your State] to make it easier for both of us if a dispute arises?",
      suggestedAlternative: "This agreement shall be governed by the laws of [Your State], and any disputes shall be heard in the courts of [Your County], [Your State].",
    },
    {
      id: "force-majeure-one-sided",
      name: "One-Sided Force Majeure",
      category: "general",
      severity: "low",
      patterns: [
        /company\s+is\s+not\s+liable\s+for\s+delays\s+caused\s+by\s+force\s+majeure/gi,
        /acts\s+of\s+god/gi,
        /unforeseeable\s+events/gi,
      ],
      description: "The company is protected from 'acts of God' but you are not.",
      whyItMatters: "If a hurricane or pandemic stops you from working, you might still be in breach of contract while they are protected.",
      plainEnglish: "If something crazy happens (like a flood or pandemic) they don't have to follow the rules, but you still do.",
      howItShouldBe: "Force Majeure should be mutual.",
      negotiationScript: "Can we make the Force Majeure clause mutual so both of us are protected if something completely unexpected happens?",
      suggestedAlternative: "Neither party shall be liable for any delay or failure in performance due to events beyond its reasonable control.",
    },
    {
      id: "nda-return-destruction",
      name: "Immediate Return/Destruction of Info",
      category: "confidentiality",
      severity: "high",
      patterns: [
        /within\s+\d+\s+days\s+of\s+(termination|request),\s+return\s+or\s+destroy/gi,
        /certify\s+in\s+writing\s+the\s+destruction/gi,
        /all\s+copies\s+must\s+be\s+(returned|destroyed)/gi,
      ],
      description: "You must return or destroy all confidential info instantly, which can be hard with digital backups.",
      whyItMatters: "Standard IT backup systems make 'complete destruction' almost impossible. You need an exception for backups.",
      plainEnglish: "They want you to delete everything perfectly within a few days. But computers keep backups, so this is almost impossible to do 100%.",
      howItShouldBe: "Add an exception for automatic system backups and archival copies required by law.",
      negotiationScript: "I'll certainly return or destroy your active files, but my automated backup system retains data for [30] days. Can we add an exception for standard system backups and archival records?",
      suggestedAlternative: "Contractor shall return or destroy active files, except for automated system backups and copies required for legal compliance.",
    },
    {
      id: "nda-non-solicit-clients",
      name: "Non-Solicitation of Clients",
      category: "general",
      severity: "high",
      patterns: [
        /shall\s+not\s+(solicit|provide\s+services\s+to)\s+(any\s+)?clients?/gi,
        /refrain\s+from\s+contacting\s+customers/gi,
        /non-?solicitation\s+of\s+customers/gi,
      ],
      description: "You aren't allowed to work with any of their clients, potentially even ones you knew before.",
      whyItMatters: "This can effectively block you from working in your niche if your client has a large market share.",
      plainEnglish: "You can't work with any of their customers. If they have a lot of customers, you might run out of people to work for!",
      howItShouldBe: "Limit this to only 'Targeted Clients' you actually worked with during the project.",
      negotiationScript: "I'm happy not to poach clients I've worked with here. Can we limit this to only those clients I was directly introduced to or worked with during this project?",
      suggestedAlternative: "Contractor shall not solicit any Client customers with whom Contractor had direct contact during the performance of the Services.",
    },
    {
      id: "tech-oss-prohibition",
      name: "Open Source Software Prohibition",
      category: "ip",
      industry: "tech",
      severity: "medium",
      patterns: [
        /no\s+(open\s+source|oss|free\s+software)\s+shall\s+be\s+used/gi,
        /strictly\s+prohibited\s+from\s+using\s+gpl/gi,
        /license\s+that\s+requires\s+disclosure\s+of\s+source\s+code/gi,
      ],
      description: "You are forbidden from using any open source code in the project.",
      whyItMatters: "Almost all modern software uses open source. A total ban is unrealistic and will slow you down significantly.",
      plainEnglish: "They say you can't use any 'free' code. This is like saying you have to build a car but you're not allowed to use any pre-made bolts or screws. It's impossible.",
      howItShouldBe: "Allow at least permissively licensed OSS (like MIT or Apache).",
      negotiationScript: "A total ban on open source is difficult for modern development. Can we allow at least permissively licensed libraries (MIT, Apache) and just restrict 'copyleft' licenses like GPL?",
      suggestedAlternative: "Contractor may use open source software with permissive licenses (e.g., MIT, Apache). Use of 'copyleft' licenses (e.g., GPL) requires prior approval.",
    },
    {
      id: "offer-letter-background-check",
      name: "Vague Background Check Contingency",
      category: "general",
      severity: "low",
      patterns: [
        /contingent\s+upon\s+satisfactory\s+background\s+check/gi,
        /subject\s+to\s+investigative\s+consumer\s+report/gi,
        /at\s+the\s+sole\s+discretion\s+of\s+the\s+company/gi,
      ],
      description: "Your job offer can be pulled for any reason found in a background check, which is 'satisfactory' only to them.",
      whyItMatters: "It's a vague standard that gives them a legal 'out' to rescind the offer for minor or irrelevant issues.",
      plainEnglish: "They can take the job back if they find something they don't like in your past, even if it has nothing to do with the job.",
      howItShouldBe: "The check should be limited to job-related requirements.",
      negotiationScript: "I'm happy to undergo a background check. Can we clarify that the check will be limited to things directly relevant to this specific role?",
      suggestedAlternative: "Offer is contingent upon a background check relevant to the requirements of the position.",
    },
    {
      id: "nda-broad-definition",
      name: "Overbroad Confidential Info Definition",
      category: "confidentiality",
      severity: "medium",
      patterns: [
        /all\s+information\s+(disclosed|provided|furnished)/gi,
        /whether\s+or\s+not\s+marked\s+(as\s+)?confidential/gi,
        /any\s+and\s+all\s+material/gi,
      ],
      description: "Everything you hear or see is considered a secret, which is a legal minefield.",
      whyItMatters: "If every single conversation is 'confidential', you could accidentally breach the contract just by mentioning the project exists.",
      plainEnglish: "They say EVERYTHING they tell you is a secret, even if it's common knowledge or not marked as secret. It's too much.",
      howItShouldBe: "Confidential information should be clearly marked or identified as such.",
      negotiationScript: "Could we limit the definition of confidential information to only that which is marked as confidential or disclosed under circumstances where its confidentiality is obvious?",
      suggestedAlternative: "Confidential Information shall mean information marked as 'Confidential' or which a reasonable person would understand to be confidential.",
    },
    {
      id: "nda-no-carve-outs",
      name: "Missing NDA Standard Exceptions",
      category: "confidentiality",
      severity: "medium",
      patterns: [
        /no\s+exceptions\s+to\s+confidentiality/gi,
        /regardless\s+of\s+public\s+availability/gi,
      ],
      description: "The NDA doesn't exclude things that are already public or that you knew before.",
      whyItMatters: "Standard NDAs MUST exclude info that becomes public, info you already knew, or info you got from someone else legally.",
      plainEnglish: "Usually, if something becomes public knowledge, you don't have to keep it secret anymore. This contract is missing that common-sense rule.",
      howItShouldBe: "Add standard carve-outs for public domain, prior knowledge, and independent development.",
      negotiationScript: "I'd like to include the standard exceptions for information that is public, already known to me, or independently developed.",
      suggestedAlternative: "Confidentiality obligations do not apply to information that is public, known to Recipient prior to disclosure, or independently developed.",
    },
    {
      id: "offer-letter-restrictive-covenants",
      name: "Long Restrictive Covenants",
      category: "general",
      severity: "high",
      patterns: [
        /for\s+a\s+period\s+of\s+\d+\s+(months?|years?)\s+following\s+termination/gi,
        /after\s+the\s+cessation\s+of\s+employment/gi,
      ],
      description: "You are restricted from certain activities for a long time after leaving the job.",
      whyItMatters: "Post-employment restrictions of more than 6-12 months are often considered unreasonable and can block you from your next role.",
      plainEnglish: "Even after you quit, they still want to control where you work or who you talk to for a long time.",
      howItShouldBe: "Restrictions should be limited to 6 months and specific activities.",
      negotiationScript: "The restrictive period after I leave seems a bit long. Can we reduce the post-employment restriction to 6 months?",
      suggestedAlternative: "These restrictions shall apply for a period of 6 months following termination of employment.",
    },
    {
      id: "healthcare-patient-data-rights",
      name: "Exclusive Rights to Patient Data",
      category: "ip",
      industry: "healthcare",
      severity: "high",
      patterns: [
        /exclusive\s+ownership\s+of\s+patient\s+data/gi,
        /sole\s+rights\s+to\s+research\s+findings/gi,
        /data\s+harvesting\s+without\s+consent/gi,
      ],
      description: "The company claims total ownership of all patient data collected.",
      whyItMatters: "Patient data often has strict legal protections (HIPAA, GDPR) and researchers typically retain some rights to their findings.",
      plainEnglish: "They want to own all the medical data you collect, which might violate patient privacy laws or stop you from using your own research.",
      howItShouldBe: "Data ownership should comply with privacy laws and allow for academic/research use.",
      negotiationScript: "Patient data ownership is a sensitive area under HIPAA. Can we ensure this clause complies with my professional ethics and allows for non-identifiable research use?",
      suggestedAlternative: "Client shall own the patient data, subject to all applicable privacy laws and Contractor's right to use de-identified data for research purposes.",
    },
    {
      id: "finance-fiduciary-waiver",
      name: "Broad Fiduciary Duty Waiver",
      category: "general",
      industry: "finance",
      severity: "critical",
      patterns: [
        /waives\s+all\s+fiduciary\s+duties/gi,
        /no\s+fiduciary\s+relationship/gi,
        /disclaimer\s+of\s+advisory\s+responsibility/gi,
      ],
      description: "The company is trying to say they don't have to act in your best interest.",
      whyItMatters: "In finance, fiduciary duty is key. Waiving it means they can have conflicts of interest that hurt you and you can't sue them for it.",
      plainEnglish: "They are basically saying they don't have to be honest or protect your money interest. This is a huge red flag in finance.",
      howItShouldBe: "Fiduciary duties should be maintained where appropriate.",
      negotiationScript: "Given the nature of our financial relationship, a total waiver of fiduciary duty seems unusual. Can we specify the bound of our professional responsibilities instead?",
      suggestedAlternative: "Parties shall act in good faith and in accordance with standard professional conduct in the finance industry.",
    },
  ];

export function analyzeContract(text: string): {
  matches: Array<{
    pattern: ContractPattern;
    matchedText: string;
    position: number;
  }>;
  riskScore: number;
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
} {
  const matches: Array<{
    pattern: ContractPattern;
    matchedText: string;
    position: number;
  }> = [];

  // Use the text as provided - let the caller normalize if needed
  const targetText = text;

  for (const pattern of contractPatterns) {
    for (const regex of pattern.patterns) {
      // Re-use regex but reset lastIndex for global searches
      regex.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = regex.exec(targetText)) !== null) {
        const currentMatch = match; // Capture for closure safety if needed, though not strictly needed here
        const existingMatch = matches.find(
          (m) => m.pattern.id === pattern.id && Math.abs(m.position - currentMatch.index) < 50
        );
        if (!existingMatch) {
          matches.push({
            pattern,
            matchedText: currentMatch[0],
            position: currentMatch.index,
          });
        }
        // Prevent infinite loops on zero-width matches
        if (currentMatch.index === regex.lastIndex) {
          regex.lastIndex++;
        }
      }
    }
  }

  const summary = {
    critical: matches.filter((m) => m.pattern.severity === "critical").length,
    high: matches.filter((m) => m.pattern.severity === "high").length,
    medium: matches.filter((m) => m.pattern.severity === "medium").length,
    low: matches.filter((m) => m.pattern.severity === "low").length,
  };

  const riskScore = Math.min(
    100,
    summary.critical * 30 + summary.high * 20 + summary.medium * 10 + summary.low * 5
  );

  return {
    matches: matches.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.pattern.severity] - severityOrder[b.pattern.severity];
    }),
    riskScore,
    summary,
  };
}

export function generateContractSummary(text: string): {
  parties: string[];
  type: string;
  keyTerms: string[];
  duration: string | null;
  value: string | null;
  mainObligations: string[];
  industry: string | null;
  overallSummary: string;
} {
  // Use text as provided
  const targetText = text;
  const textLower = targetText.toLowerCase();
  
  const parties: string[] = [];
  const partyPatterns = [
    /between\s+([^(]+?)\s*\("?(?:Party|Client|Company|Contractor|Vendor|Provider|Customer|Seller|Buyer)/gi,
    /("?(?:Party|Client|Company|Contractor|Vendor|Provider|Customer|Seller|Buyer)"?[^,]*),?\s+(?:a\s+)?(?:company|corporation|individual|LLC)/gi,
    /this\s+agreement\s+is\s+(?:made\s+)?by\s+(?:and\s+)?between\s+([^,]+)/gi,
  ];
  
    for (const pattern of partyPatterns) {
      const matches = targetText.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && !parties.includes(match[1].trim())) {
          parties.push(match[1].trim().slice(0, 50));
        }
      }
    }
    
    let type = "General Contract";
    const typeKeywords: { [key: string]: string[] } = {
      "Employment Agreement": ["employment", "employee", "employer", "salary", "wages", "job title", "position"],
      "Service Agreement": ["services", "service provider", "deliverables", "statement of work", "SOW"],
      "Non-Disclosure Agreement (NDA)": ["confidential information", "non-disclosure", "NDA", "proprietary information", "non-disclosure agreement"],
      "Lease Agreement": ["lease", "tenant", "landlord", "rent", "premises", "property"],
      "Sales Agreement": ["purchase", "sale", "buyer", "seller", "goods", "merchandise"],
      "Consulting Agreement": ["consultant", "consulting services", "advisory", "engagement"],
      "Freelance/Independent Contractor Agreement": ["independent contractor", "freelancer", "1099", "self-employed"],
      "Partnership Agreement": ["partnership", "partners", "profit sharing", "joint venture"],
      "Software License Agreement": ["software license", "EULA", "end user", "license grant"],
      "Loan Agreement": ["loan", "lender", "borrower", "principal", "interest rate", "repayment"],
    };
    
    for (const [contractType, keywords] of Object.entries(typeKeywords)) {
      const matchCount = keywords.filter(k => textLower.includes(k.toLowerCase())).length;
      if (matchCount >= 2) {
        type = contractType;
        break;
      }
    }
  
    // Detect Industry
    let industry = null;
    const industryKeywords = {
      "Technology": ["software", "hardware", "source code", "saas", "tech", "digital", "internet", "coding"],
      "Healthcare": ["medical", "health", "patient", "hipaa", "clinical", "hospital", "pharma"],
      "Finance": ["financial", "bank", "lending", "investment", "shares", "stock", "aml", "kyc"],
      "Real Estate": ["property", "real estate", "premises", "landlord", "tenant", "lease", "occupancy"],
      "Construction": ["construction", "architect", "contractor", "building", "renovation", "materials", "subcontractor"],
    };
  
    for (const [ind, keywords] of Object.entries(industryKeywords)) {
      const matchCount = keywords.filter(k => textLower.includes(k.toLowerCase())).length;
      if (matchCount >= 2) {
        industry = ind;
        break;
      }
    }
    
    const keyTerms: string[] = [];
    const termPatterns = [
      { pattern: /payment\s+(?:of\s+)?\$[\d,]+/gi, label: "Payment terms" },
      { pattern: /term\s+(?:of|is)\s+(\d+\s+(?:days?|months?|years?))/gi, label: "Duration" },
      { pattern: /effective\s+(?:as\s+of\s+)?(\w+\s+\d+,?\s+\d+)/gi, label: "Effective date" },
      { pattern: /terminate\s+(?:with\s+)?(\d+)\s+days?\s+(?:written\s+)?notice/gi, label: "Termination notice" },
      { pattern: /liability\s+(?:is\s+)?(?:limited|capped)\s+(?:to|at)\s+\$[\d,]+/gi, label: "Liability cap" },
      { pattern: /non-?compete\s+(?:period|term)\s+(?:of\s+)?(\d+\s+(?:months?|years?))/gi, label: "Non-compete period" },
      { pattern: /confidentiality\s+(?:period|obligation)\s+(?:of\s+)?(\d+\s+(?:months?|years?))/gi, label: "Confidentiality period" },
    ];
    
    for (const { pattern, label } of termPatterns) {
      pattern.lastIndex = 0;
      const match = pattern.exec(targetText);
      if (match) {
        keyTerms.push(`${label}: ${match[0]}`);
      }
    }
    
    let duration: string | null = null;
    const durationPattern = /term\s+(?:of\s+)?(?:this\s+agreement\s+)?(?:is|shall\s+be)\s+(\d+\s+(?:days?|months?|years?))/gi;
    durationPattern.lastIndex = 0;
    const durationMatch = durationPattern.exec(targetText);
    if (durationMatch) {
      duration = durationMatch[1];
    }
    
    let value: string | null = null;
    const valuePatterns = [
      /total\s+(?:contract\s+)?(?:value|amount|fee|price)\s+(?:of\s+)?\$[\d,]+(?:\.\d{2})?/gi,
      /\$[\d,]+(?:\.\d{2})?\s+(?:total|fee|compensation)/gi,
      /compensation\s+(?:of\s+)?\$[\d,]+/gi,
    ];
    
    for (const pattern of valuePatterns) {
      pattern.lastIndex = 0;
      const match = pattern.exec(targetText);
      if (match) {
        value = match[0];
        break;
      }
    }
    
    const mainObligations: string[] = [];
    const obligationPatterns = [
      /(?:contractor|provider|vendor)\s+(?:shall|agrees?\s+to|will)\s+([^.]{1,200})\./gi,
      /(?:client|company|customer)\s+(?:shall|agrees?\s+to|will)\s+([^.]{1,200})\./gi,
      /(?:party|parties)\s+(?:shall|agrees?\s+to|will)\s+([^.]{1,200})\./gi,
    ];
    
    for (const pattern of obligationPatterns) {
      const matches = targetText.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && mainObligations.length < 5) {
          const obligation = match[1].trim().slice(0, 100);
          if (!mainObligations.includes(obligation)) {
            mainObligations.push(obligation);
          }
        }
      }
    }

  // Generate Overall Summary
  let overallSummary = `This is a ${type}${industry ? ` in the ${industry} industry` : ""}. `;
  if (parties.length >= 2) {
    overallSummary += `It is between ${parties[0]} and ${parties[1]}. `;
  } else if (parties.length === 1) {
    overallSummary += `One of the parties involved is ${parties[0]}. `;
  }

  if (value) {
    overallSummary += `The financial value of the contract is estimated at ${value.match(/\$[\d,]+(?:\.\d{2})?/)?.[0] || value}. `;
  }

  if (duration) {
    overallSummary += `The agreement has a term of ${duration}. `;
  }

  if (mainObligations.length > 0) {
    overallSummary += `Key obligations involve ${mainObligations[0].toLowerCase()}${mainObligations.length > 1 ? ` and ${mainObligations[1].toLowerCase()}` : ""}.`;
  }

  return {
    parties: parties.slice(0, 4),
    type,
    keyTerms: keyTerms.slice(0, 6),
    duration,
    value,
    mainObligations: mainObligations.slice(0, 5),
    industry,
    overallSummary,
  };
}

export function getSeverityColor(severity: ContractPattern["severity"]): string {
  switch (severity) {
    case "critical":
      return "text-red-600 bg-red-50 border-red-200";
    case "high":
      return "text-orange-600 bg-orange-50 border-orange-200";
    case "medium":
      return "text-amber-600 bg-amber-50 border-amber-200";
    case "low":
      return "text-blue-600 bg-blue-50 border-blue-200";
    default:
      return "text-slate-600 bg-slate-50 border-slate-200";
  }
}

export function getSeverityBadgeColor(severity: ContractPattern["severity"]): string {
  switch (severity) {
    case "critical":
      return "bg-red-500";
    case "high":
      return "bg-orange-500";
    case "medium":
      return "bg-amber-500";
    case "low":
      return "bg-blue-500";
    default:
      return "bg-slate-500";
  }
}
