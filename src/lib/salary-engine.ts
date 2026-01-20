export type CityCluster = "A" | "B" | "C" | "D" | "E";
export type WorkMode = "Office 5-day" | "Hybrid 3-day" | "Hybrid 2-day" | "Full Remote";
export type LivabilityGrade = "Comfortable" | "Manageable" | "Tight" | "Challenging";
export type AnalysisMode = "Reality Check" | "Trade-Off" | "Comparison" | "Projection";
export type ClawbackRiskLevel = "low" | "medium" | "high";
export type RelocationType = "lump_sum" | "reimbursement" | "arranged" | "none";

export interface CityClusterData {
  name: string;
  cities: string[];
  baseMonthlyCost: number;
  inflationRate: number;
  rentShare: number;
  transportShare: number;
  foodShare: number;
}

export interface WorkModeModifier {
  rent: number;
  transport: number;
  food: number;
}

export interface RelocationCostRange {
  min: number;
  max: number;
}

export interface EsopGrant {
  value: number;
  vestingSchedule: string;
  cliffMonths: number;
}

export interface OneTimeBenefitsInput {
  joiningBonus?: number;
  joiningBonusClawbackMonths?: number;
  relocationAllowance?: number;
  relocationType?: RelocationType;
  noticeBuyout?: number;
  esopGrant?: EsopGrant;
}

export interface CityEconomicsResult {
  city: string;
  cluster: CityCluster;
  clusterName: string;
  baseMonthlyCost: number;
  adjustedMonthlyCost: number;
  inflationRate: number;
  familyMultiplier: number;
}

export interface ClawbackRiskResult {
  totalLiability: number;
  monthlyLiability: number;
  riskLevel: ClawbackRiskLevel;
  warningMessage: string;
  exitScenarios: { month: number; owed: number }[];
  freedomMonth: number;
}

export interface EconomicAnalysisResult {
  cityEconomics: CityEconomicsResult;
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
  clawbackRisk?: ClawbackRiskResult;
  netRelocationValue?: number;
  esopYear1Value: number;
}

export const CITY_CLUSTERS: Record<CityCluster, CityClusterData> = {
  A: {
    name: "Ultra Metro",
    cities: ["Mumbai", "Central Delhi", "South Delhi", "New Delhi"],
    baseMonthlyCost: 42000,
    inflationRate: 7.0,
    rentShare: 0.45,
    transportShare: 0.15,
    foodShare: 0.25,
  },
  B: {
    name: "High Cost Metro",
    cities: ["Bengaluru", "Bangalore", "Gurugram", "Gurgaon", "Noida", "Greater Noida"],
    baseMonthlyCost: 40000,
    inflationRate: 6.5,
    rentShare: 0.42,
    transportShare: 0.15,
    foodShare: 0.25,
  },
  C: {
    name: "Balanced Metro",
    cities: ["Pune", "Hyderabad", "Chennai", "Navi Mumbai", "Thane"],
    baseMonthlyCost: 32000,
    inflationRate: 6.0,
    rentShare: 0.40,
    transportShare: 0.12,
    foodShare: 0.25,
  },
  D: {
    name: "Stable Tier-2",
    cities: ["Jaipur", "Chandigarh", "Ahmedabad", "Kolkata", "Lucknow", "Vadodara", "Surat"],
    baseMonthlyCost: 26000,
    inflationRate: 5.5,
    rentShare: 0.35,
    transportShare: 0.12,
    foodShare: 0.28,
  },
  E: {
    name: "Emerging Tier-2/3",
    cities: ["Indore", "Kochi", "Coimbatore", "Nagpur", "Bhopal", "Trivandrum", "Mysore", "Vizag", "Mangalore"],
    baseMonthlyCost: 23000,
    inflationRate: 5.0,
    rentShare: 0.32,
    transportShare: 0.10,
    foodShare: 0.30,
  },
};

export const WORK_MODE_MODIFIERS: Record<WorkMode, WorkModeModifier> = {
  "Office 5-day": { rent: 1.0, transport: 1.0, food: 1.0 },
  "Hybrid 3-day": { rent: 1.0, transport: 0.6, food: 0.8 },
  "Hybrid 2-day": { rent: 0.9, transport: 0.4, food: 0.7 },
  "Full Remote": { rent: 0.7, transport: 0.1, food: 0.6 },
};

export const RELOCATION_COSTS: Record<string, RelocationCostRange> = {
  "same_city": { min: 15000, max: 30000 },
  "tier2_to_metro": { min: 40000, max: 80000 },
  "metro_to_metro": { min: 50000, max: 100000 },
  "family_addon": { min: 30000, max: 50000 },
};

export const LIVABILITY_THRESHOLDS = {
  comfortable: 2.5,
  manageable: 2.0,
  tight: 1.5,
};

const FAMILY_COST_MULTIPLIER = 1.3;

export function detectCityCluster(city: string): { cluster: CityCluster; clusterData: CityClusterData } | null {
  const normalizedCity = city.toLowerCase().trim();
  
  for (const [cluster, data] of Object.entries(CITY_CLUSTERS)) {
    for (const cityName of data.cities) {
      if (normalizedCity.includes(cityName.toLowerCase()) || cityName.toLowerCase().includes(normalizedCity)) {
        return { cluster: cluster as CityCluster, clusterData: data };
      }
    }
  }
  
  return null;
}

export function calculateAdjustedMonthlyCost(
  clusterData: CityClusterData,
  workMode: WorkMode,
  hasFamily: boolean = false
): number {
  const modifier = WORK_MODE_MODIFIERS[workMode];
  const baseCost = clusterData.baseMonthlyCost;
  
  const rentCost = baseCost * clusterData.rentShare * modifier.rent;
  const transportCost = baseCost * clusterData.transportShare * modifier.transport;
  const foodCost = baseCost * clusterData.foodShare * modifier.food;
  const otherCost = baseCost * (1 - clusterData.rentShare - clusterData.transportShare - clusterData.foodShare);
  
  let totalCost = rentCost + transportCost + foodCost + otherCost;
  
  if (hasFamily) {
    totalCost *= FAMILY_COST_MULTIPLIER;
  }
  
  return Math.round(totalCost);
}

export function calculateLivabilityIndex(monthlyInHand: number, monthlyCost: number): number {
  if (monthlyCost <= 0) return 0;
  return Math.round((monthlyInHand / monthlyCost) * 100) / 100;
}

export function getLivabilityGrade(index: number): LivabilityGrade {
  if (index >= LIVABILITY_THRESHOLDS.comfortable) return "Comfortable";
  if (index >= LIVABILITY_THRESHOLDS.manageable) return "Manageable";
  if (index >= LIVABILITY_THRESHOLDS.tight) return "Tight";
  return "Challenging";
}

export function getAnalysisMode(livabilityIndex: number): AnalysisMode {
  if (livabilityIndex < LIVABILITY_THRESHOLDS.tight) return "Reality Check";
  if (livabilityIndex < LIVABILITY_THRESHOLDS.manageable) return "Trade-Off";
  if (livabilityIndex < LIVABILITY_THRESHOLDS.comfortable) return "Comparison";
  return "Projection";
}

export function calculateClawbackRisk(
  joiningBonus: number,
  clawbackMonths: number,
  monthlyInHand: number
): ClawbackRiskResult | undefined {
  if (!joiningBonus || joiningBonus <= 0 || !clawbackMonths || clawbackMonths <= 0) {
    return undefined;
  }
  
  const monthlyLiability = joiningBonus / clawbackMonths;
  const monthsOfSalary = joiningBonus / monthlyInHand;
  
  let riskLevel: ClawbackRiskLevel = "low";
  if (monthsOfSalary > 3) {
    riskLevel = "high";
  } else if (monthsOfSalary > 1) {
    riskLevel = "medium";
  }
  
  const exitScenarios: { month: number; owed: number }[] = [];
  const checkpoints = [3, 6, 9, 12, 18, 24].filter(m => m <= clawbackMonths);
  
  for (const month of checkpoints) {
    const remainingMonths = clawbackMonths - month;
    const owed = Math.round((remainingMonths / clawbackMonths) * joiningBonus);
    if (owed > 0) {
      exitScenarios.push({ month, owed });
    }
  }
  
  let warningMessage = "";
  if (riskLevel === "high") {
    warningMessage = `High clawback risk: You'd owe more than 3 months salary (₹${Math.round(joiningBonus).toLocaleString()}) if you leave early.`;
  } else if (riskLevel === "medium") {
    warningMessage = `Moderate clawback: Leaving within ${clawbackMonths} months means returning part of ₹${Math.round(joiningBonus).toLocaleString()} bonus.`;
  } else {
    warningMessage = `Low clawback risk: Bonus is less than 1 month's salary.`;
  }
  
  return {
    totalLiability: joiningBonus,
    monthlyLiability: Math.round(monthlyLiability),
    riskLevel,
    warningMessage,
    exitScenarios,
    freedomMonth: clawbackMonths,
  };
}

export function estimateRelocationCost(
  fromCity: string | undefined,
  toCity: string,
  withFamily: boolean = false
): number {
  const toCluster = detectCityCluster(toCity);
  const fromCluster = fromCity ? detectCityCluster(fromCity) : null;
  
  let baseRange: RelocationCostRange;
  
  if (!fromCity || !fromCluster) {
    baseRange = RELOCATION_COSTS["tier2_to_metro"];
  } else if (fromCluster.cluster === toCluster?.cluster) {
    baseRange = RELOCATION_COSTS["same_city"];
  } else if (["A", "B"].includes(toCluster?.cluster || "") && !["A", "B"].includes(fromCluster.cluster)) {
    baseRange = RELOCATION_COSTS["tier2_to_metro"];
  } else {
    baseRange = RELOCATION_COSTS["metro_to_metro"];
  }
  
  let cost = (baseRange.min + baseRange.max) / 2;
  
  if (withFamily) {
    const familyAddon = RELOCATION_COSTS["family_addon"];
    cost += (familyAddon.min + familyAddon.max) / 2;
  }
  
  return Math.round(cost);
}

export function calculateEconomicAnalysis(
  annualCTC: number,
  monthlyInHand: number,
  city: string,
  workMode: WorkMode = "Office 5-day",
  hasFamily: boolean = false,
  oneTimeBenefits?: OneTimeBenefitsInput,
  fromCity?: string
): EconomicAnalysisResult {
  const cityClusterResult = detectCityCluster(city);
  
  const defaultClusterData: CityClusterData = {
    name: "Unknown",
    cities: [city],
    baseMonthlyCost: 30000,
    inflationRate: 6.0,
    rentShare: 0.40,
    transportShare: 0.12,
    foodShare: 0.25,
  };
  
  const cluster = cityClusterResult?.cluster || "C";
  const clusterData = cityClusterResult?.clusterData || defaultClusterData;
  
  const adjustedMonthlyCost = calculateAdjustedMonthlyCost(clusterData, workMode, hasFamily);
  
  const cityEconomics: CityEconomicsResult = {
    city,
    cluster,
    clusterName: clusterData.name,
    baseMonthlyCost: clusterData.baseMonthlyCost,
    adjustedMonthlyCost,
    inflationRate: clusterData.inflationRate,
    familyMultiplier: hasFamily ? FAMILY_COST_MULTIPLIER : 1.0,
  };
  
  const joiningBonus = oneTimeBenefits?.joiningBonus || 0;
  const relocationAllowance = oneTimeBenefits?.relocationAllowance || 0;
  const noticeBuyout = oneTimeBenefits?.noticeBuyout || 0;
  const clawbackMonths = oneTimeBenefits?.joiningBonusClawbackMonths || 12;
  
  const esopYear1Value = 0;
  
  const year1EffectiveCTC = annualCTC + joiningBonus + relocationAllowance + noticeBuyout;
  const year1MonthlyEffective = year1EffectiveCTC / 12;
  
  const year2SteadyCTC = annualCTC;
  const year2MonthlyEffective = monthlyInHand;
  
  const year1Livability = calculateLivabilityIndex(year1MonthlyEffective, adjustedMonthlyCost);
  const year2Livability = calculateLivabilityIndex(year2MonthlyEffective, adjustedMonthlyCost);
  
  const livabilityIndex = year2Livability;
  const livabilityGrade = getLivabilityGrade(livabilityIndex);
  const analysisMode = getAnalysisMode(livabilityIndex);
  
  const monthlySavingsYear1 = Math.max(0, year1MonthlyEffective - adjustedMonthlyCost);
  const monthlySavingsYear2 = Math.max(0, year2MonthlyEffective - adjustedMonthlyCost);
  
  const savingsRateYear1 = year1MonthlyEffective > 0 ? Math.round((monthlySavingsYear1 / year1MonthlyEffective) * 100) : 0;
  const savingsRateYear2 = year2MonthlyEffective > 0 ? Math.round((monthlySavingsYear2 / year2MonthlyEffective) * 100) : 0;
  
  const clawbackRisk = calculateClawbackRisk(joiningBonus, clawbackMonths, monthlyInHand);
  
  let netRelocationValue: number | undefined;
  if (relocationAllowance > 0) {
    const estimatedCost = estimateRelocationCost(fromCity, city, hasFamily);
    netRelocationValue = relocationAllowance - estimatedCost;
  }
  
  return {
    cityEconomics,
    livabilityIndex,
    livabilityGrade,
    analysisMode,
    year1EffectiveCTC,
    year1MonthlyEffective: Math.round(year1MonthlyEffective),
    year2SteadyCTC,
    year2MonthlyEffective: Math.round(year2MonthlyEffective),
    monthlySavingsYear1: Math.round(monthlySavingsYear1),
    monthlySavingsYear2: Math.round(monthlySavingsYear2),
    savingsRateYear1,
    savingsRateYear2,
    clawbackRisk,
    netRelocationValue,
    esopYear1Value,
  };
}

export function normalizeSalaryToCity(
  annualCTC: number,
  fromCity: string,
  toCity: string = "Pune"
): number {
  const fromCluster = detectCityCluster(fromCity);
  const toCluster = detectCityCluster(toCity);
  
  if (!fromCluster || !toCluster) return annualCTC;
  
  const fromCost = fromCluster.clusterData.baseMonthlyCost;
  const toCost = toCluster.clusterData.baseMonthlyCost;
  
  const ratio = toCost / fromCost;
  return Math.round(annualCTC * ratio);
}

export function formatINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function getLivabilityColor(grade: LivabilityGrade): string {
  switch (grade) {
    case "Comfortable": return "emerald";
    case "Manageable": return "amber";
    case "Tight": return "orange";
    case "Challenging": return "rose";
  }
}

export function getClawbackRiskColor(level: ClawbackRiskLevel): string {
  switch (level) {
    case "low": return "emerald";
    case "medium": return "amber";
    case "high": return "rose";
  }
}

export interface SalaryComponent {
  name: string;
  annual: number;
  monthly: number;
  type: "fixed" | "variable" | "deduction" | "benefit";
  isNegotiable: boolean;
  description?: string;
}

export interface SalaryBreakdownResult {
  components: SalaryComponent[];
  totalCTC: number;
  grossMonthly: number;
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

export function calculateTaxForRegime(income: number, regime: "old" | "new" = "new"): number {
  if (regime === "new") {
    // Standard Deduction of 75,000 for FY 2024-25 (July 2024 Update)
    const taxableIncome = Math.max(0, income - 75000);
    
    if (taxableIncome <= 700000) return 0; // Rebate 87A

    let tax = 0;
    if (taxableIncome <= 1000000) {
      tax = 20000 + (taxableIncome - 700000) * 0.10;
    } else if (taxableIncome <= 1200000) {
      tax = 50000 + (taxableIncome - 1000000) * 0.15;
    } else if (taxableIncome <= 1500000) {
      tax = 80000 + (taxableIncome - 1200000) * 0.20;
    } else {
      tax = 140000 + (taxableIncome - 1500000) * 0.30;
    }
    return Math.round(tax * 1.04);
  } else {
    // Old regime (Assuming 1.5L 80C + 50k standard deduction = 2L deduction)
    const taxable = Math.max(0, income - 200000);
    let tax = 0;
    if (taxable <= 250000) tax = 0;
    else if (taxable <= 500000) tax = (taxable - 250000) * 0.05;
    else if (taxable <= 1000000) tax = 12500 + (taxable - 500000) * 0.2;
    else tax = 112500 + (taxable - 1000000) * 0.3;
    
    if (taxable <= 500000) tax = 0; // Rebate 87A (Old regime threshold is 5L)
    
    return Math.round(tax * 1.04);
  }
}

export function calculateDeterministicSalaryBreakdown(
  aiComponents: SalaryComponent[],
  totalCTC: number,
  currency: string = "INR"
): SalaryBreakdownResult {
  if (currency !== "INR" || totalCTC <= 0) {
    const monthlyGross = totalCTC / 12;
    const estimatedTax = totalCTC * 0.25;
    const monthlyTakeHome = Math.round((totalCTC - estimatedTax) / 12);
    
    return {
      components: aiComponents.length > 0 ? aiComponents : [
        { name: "Base Salary", annual: totalCTC, monthly: Math.round(totalCTC / 12), type: "fixed", isNegotiable: false }
      ],
      totalCTC,
      grossMonthly: Math.round(monthlyGross),
      monthlyTakeHome,
      annualTakeHome: monthlyTakeHome * 12,
      taxDeductions: Math.round(estimatedTax),
      complianceInfo: {
        pfEnabled: false,
        gratuityEnabled: false,
        professionalTax: 0,
        esiEnabled: false,
      },
    };
  }

  let components: SalaryComponent[] = [];
  let pfEmployer = 0;
  let pfEmployee = 0;
  let basicSalary = 0;
  let variableComponents = 0;
  let fixedComponents = 0;

  if (aiComponents && aiComponents.length > 0) {
    components = aiComponents.map(comp => ({
      ...comp,
      annual: Math.round(comp.annual || 0),
      monthly: Math.round(comp.monthly || (comp.annual ? comp.annual / 12 : 0)),
    }));

    for (const comp of components) {
      const name = comp.name.toLowerCase();
      if (name.includes("basic")) {
        basicSalary = comp.annual;
      }
      if (name.includes("pf") && comp.type === "deduction") {
        if (name.includes("employer")) {
          pfEmployer = comp.annual;
        } else {
          pfEmployee = comp.annual;
        }
      }
      if (comp.type === "variable") {
        variableComponents += comp.annual;
      } else if (comp.type === "fixed") {
        fixedComponents += comp.annual;
      }
    }
  }

  if (basicSalary === 0) {
    basicSalary = Math.round(totalCTC * 0.4);
  }

  const pfBase = Math.min(basicSalary, 15000 * 12);
  const calculatedPfEmployee = Math.round(pfBase * 0.12);
  const calculatedPfEmployer = Math.round(pfBase * 0.12);
  
  if (pfEmployee === 0) pfEmployee = calculatedPfEmployee;
  if (pfEmployer === 0) pfEmployer = calculatedPfEmployer;

  const professionalTax = totalCTC > 300000 ? 2400 : (totalCTC > 180000 ? 1200 : 0);
  
  const esiEnabled = totalCTC <= 252000;
  const esiDeduction = esiEnabled ? Math.round(totalCTC * 0.0075) : 0;

  // New Regime (FY 2024-25) Logic
  // Gross Salary for tax = CTC - Employer PF
  const grossSalary = totalCTC - pfEmployer;
  
  // Use the unified tax calculation engine
  const incomeTax = calculateTaxForRegime(grossSalary, "new");


  const employeeDeductions = pfEmployee + professionalTax + esiDeduction + incomeTax;
  
  // Take home = Gross Salary - (PF Employee + PT + ESI + Tax)
  // Which is CTC - PF Employer - PF Employee - PT - ESI - Tax
  const annualTakeHome = grossSalary - (pfEmployee + professionalTax + esiDeduction + incomeTax);
  const monthlyTakeHome = Math.round(annualTakeHome / 12);
  const grossMonthly = Math.round(totalCTC / 12);
  
  // Total Deductions shown = PF Employer + PF Employee + PT + Tax (Everything that isn't take home)
  // Wait, if we want CTC - Deductions = TakeHome, then PF Employer MUST be included in deductions.
  const totalDeductions = totalCTC - annualTakeHome;

  return {
    components,
    totalCTC: Math.round(totalCTC),
    grossMonthly,
    monthlyTakeHome,
    annualTakeHome: Math.round(annualTakeHome),
    taxDeductions: Math.round(totalDeductions),
    complianceInfo: {
      pfEnabled: pfEmployee > 0,
      gratuityEnabled: totalCTC >= 1000000,
      professionalTax,
      esiEnabled,
    },
  };

}
