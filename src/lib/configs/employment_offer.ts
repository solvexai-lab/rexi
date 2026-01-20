import { ExtractionSchema } from "../types/engine";

export const employmentOfferSchema: ExtractionSchema = {
  docType: "EMPLOYMENT_OFFER",
  fields: [
    {
      key: "base_salary",
      label: "Base Salary",
      description: "Annual base salary amount",
      type: "number",
      required: true
    },
    {
      key: "notice_period",
      label: "Notice Period",
      description: "Days of notice required for termination",
      type: "number",
      required: true
    },
    {
      key: "probation_period",
      label: "Probation Period",
      description: "Duration of probation in months",
      type: "number",
      required: false
    },
    {
      key: "non_compete",
      label: "Non-Compete Clause",
      description: "Existence of non-compete restrictions",
      type: "boolean",
      required: true
    },
    {
      key: "joining_bonus",
      label: "Joining Bonus",
      description: "One-time signing/joining bonus amount in INR",
      type: "number",
      required: false
    },
    {
      key: "joining_bonus_clawback_months",
      label: "Clawback Period",
      description: "Months before joining bonus is fully vested (typically 12-24)",
      type: "number",
      required: false
    },
    {
      key: "relocation_allowance",
      label: "Relocation Allowance",
      description: "One-time relocation support amount in INR",
      type: "number",
      required: false
    },
    {
      key: "relocation_type",
      label: "Relocation Type",
      description: "Type of relocation support: lump_sum, reimbursement, or arranged",
      type: "string",
      required: false
    },
    {
      key: "notice_buyout",
      label: "Notice Period Buyout",
      description: "Amount offered to buy out current notice period",
      type: "number",
      required: false
    },
    {
      key: "esop_grant_value",
      label: "ESOP/RSU Grant Value",
      description: "Total value of stock options or RSU grants",
      type: "number",
      required: false
    },
    {
      key: "esop_vesting_schedule",
      label: "ESOP Vesting Schedule",
      description: "Vesting schedule (e.g., '4 years with 1 year cliff')",
      type: "string",
      required: false
    },
    {
      key: "esop_cliff_months",
      label: "ESOP Cliff Period",
      description: "Cliff period in months before first vest",
      type: "number",
      required: false
    },
    {
      key: "retention_bonus",
      label: "Retention Bonus",
      description: "Retention bonus for experienced hires",
      type: "number",
      required: false
    },
    {
      key: "performance_bonus_guarantee",
      label: "Performance Bonus Guarantee",
      description: "Guaranteed first-year performance bonus",
      type: "number",
      required: false
    },
    {
      key: "job_city",
      label: "Job Location City",
      description: "City where the job is located (e.g., Bengaluru, Mumbai, Pune)",
      type: "string",
      required: false
    },
    {
      key: "work_mode",
      label: "Work Mode",
      description: "Work arrangement: Office 5-day, Hybrid 3-day, Hybrid 2-day, or Full Remote",
      type: "string",
      required: false
    }
  ],
  logicRules: [
    {
      id: "salary-check",
      fieldKeys: ["base_salary"],
      condition: "value < 300000",
      severity: "medium",
      message: "Base salary is below the typical threshold for this role type."
    },
    {
      id: "harsh-notice",
      fieldKeys: ["notice_period"],
      condition: "value > 90",
      severity: "high",
      message: "Notice period is unusually long (over 90 days)."
    },
    {
      id: "probation-check",
      fieldKeys: ["probation_period"],
      condition: "value > 6",
      severity: "medium",
      message: "Probation period exceeds the standard 6-month window."
    },
    {
      id: "high-clawback-risk",
      fieldKeys: ["joining_bonus", "joining_bonus_clawback_months"],
      condition: "joining_bonus > 0 && joining_bonus_clawback_months > 18",
      severity: "high",
      message: "Joining bonus has an extended clawback period (over 18 months). If you leave early, you may owe a significant amount."
    },
    {
      id: "long-esop-cliff",
      fieldKeys: ["esop_cliff_months"],
      condition: "value > 12",
      severity: "medium",
      message: "ESOP cliff period exceeds 1 year. You won't vest any equity until the cliff ends."
    }
  ]
};
