import type {
  CityCluster,
  WorkMode,
  LivabilityGrade,
  AnalysisMode,
  ClawbackRiskLevel,
  RelocationType,
} from "@/lib/salary-engine";

export interface SalaryComponent {
  name: string;
  annual: number;
  monthly: number;
  type: "fixed" | "deduction" | "variable" | "benefit";
  isNegotiable: boolean;
  description?: string;
}

export interface EsopGrantData {
  value: number;
  vestingSchedule: string;
  cliffMonths: number;
}

export interface OneTimeBenefits {
  joiningBonus: number;
  joiningBonusClawbackMonths: number;
  relocationAllowance: number;
  relocationType: RelocationType;
  noticeBuyout: number;
  esopGrant?: EsopGrantData;
  retentionBonus?: number;
  performanceBonusGuarantee?: number;
}

export interface CityEconomics {
  city: string;
  cluster: CityCluster;
  clusterName: string;
  baseMonthlyCost: number;
  adjustedMonthlyCost: number;
  inflationRate: number;
  familyMultiplier: number;
}

export interface ClawbackRisk {
  totalLiability: number;
  monthlyLiability: number;
  riskLevel: ClawbackRiskLevel;
  warningMessage: string;
  exitScenarios: { month: number; owed: number }[];
  freedomMonth: number;
}

export interface EconomicAnalysis {
  cityEconomics: CityEconomics;
  livabilityIndex: number;
  livabilityGrade: LivabilityGrade;
  analysisMode: AnalysisMode;
  year1EffectiveCTC: number;
  year1MonthlyEffective: number;
  year2SteadyCTC: number;
  year2MonthlyEffective: number;
  monthlySavingsYear1: number;
  monthlySavingsYear2: number;
  savingsRateYear1: number;
  savingsRateYear2: number;
  clawbackRisk?: ClawbackRisk;
  netRelocationValue?: number;
  esopYear1Value: number;
}

export interface SalaryBreakdown {
  components: SalaryComponent[];
  totalCTC: number;
  monthlyTakeHome: number;
  annualTakeHome: number;
  taxDeductions: number;
  complianceInfo: {
    pfEnabled: boolean;
    gratuityEnabled: boolean;
    professionalTax: number;
    esiEnabled: boolean;
  };
}

export interface LeavePolicy {
  totalAnnualLeave: number;
  casualLeave?: number;
  sickLeave?: number;
  earnedLeave?: number;
  privilegedLeave?: number;
  maternityLeave?: string;
  paternityLeave?: string;
  bereavementLeave?: string;
  marriageLeave?: string;
  compOff?: string;
  wfhDays?: number;
  carryForwardLimit?: number;
  carryForwardPolicy?: string;
  encashmentAllowed?: boolean;
  encashmentCondition?: string;
  probationLeaveRestriction?: string;
  publicHolidays?: number;
  floaterHolidays?: number;
  sabbatical?: string;
  unlimitedPTO?: boolean;
}

export interface OfferLetterData {
  id: string;
  fileName: string;
  company: string;
  role: string;
  baseSalary: number;
  currency: string;
  bonus?: number;
  bonusPercentage?: number;
  bonusType?: string;
  bonusIsVariable?: boolean;
  bonusCondition?: string;
  equity?: {
    type: string;
    amount: number;
    vestingSchedule: string;
    cliffPeriod: string;
    exerciseWindow?: string;
    buybackTerms?: string;
  };
  benefits: string[];
  pto: string;
  ptoCarryForward?: string;
  leavePolicy?: LeavePolicy;
  startDate?: string;
  location: string;
  workMode: string;
  noticePeriod?: string;
  noticeBuyoutAllowed?: boolean;
  nonCompete?: {
    duration: string;
    scope: string;
    concerns: string[];
    enforceability?: string;
  };
  signingBonus?: number;
  relocation?: string;
  probationPeriod?: string;
  probationNoticePeriod?: string;
  bondPeriod?: string;
  bondAmount?: number;
  rawText: string;
  salaryBreakdown?: SalaryBreakdown;
  oneTimeBenefits?: OneTimeBenefits;
  economicAnalysis?: EconomicAnalysis;
}

export interface OfferRisk {
  id: string;
  category: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  clause: string;
  suggestion: string;
  negotiationTip?: string;
}

export interface OfferAnalysisResponse {
  offer: OfferLetterData;
  risks: OfferRisk[];
  overallScore: number;
  summary: string;
  strengths: string[];
  concerns: string[];
  negotiationPoints: string[];
  marketComparison?: {
    salaryPercentile: string;
    benefitsRating: string;
    overallCompetitiveness: string;
    benchmarks?: MarketBenchmark;
  };
  metadata: {
    analysisDate: string;
    disclaimer: string;
  };
}

export interface MarketBenchmark {
  role: string;
  location: string;
  percentile25: number;
  percentile50: number;
  percentile75: number;
  confidence: "High" | "Medium" | "Low";
  reasoning: string;
  currency: string;
}

export interface OfferComparisonItem {
  offerId: string;
  company: string;
  role: string;
  totalCompensation: number;
  baseSalary: number;
  bonus: number;
  equityValue: number;
  benefitsScore: number;
  workLifeScore: number;
  riskScore: number;
  overallScore: number;
}

export interface OfferComparisonResponse {
  offers: OfferComparisonItem[];
  recommendation: {
    bestOverall: string;
    bestCompensation: string;
    bestWorkLife: string;
    lowestRisk: string;
  };
  comparisonMatrix: {
    category: string;
    values: { offerId: string; value: string; winner: boolean }[];
  }[];
  summary: string;
  detailedAnalysis: string;
  metadata: {
    analysisDate: string;
    disclaimer: string;
  };
}
