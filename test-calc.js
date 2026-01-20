const totalCTC = 800000;
const basicSalary = totalCTC * 0.4;
const pfBase = Math.min(basicSalary, 15000 * 12);
const pfEmployee = Math.round(pfBase * 0.12);
const pfEmployer = Math.round(pfBase * 0.12);
const professionalTax = 2400;
const taxableIncome = totalCTC - pfEmployee - professionalTax;

console.log('=== 8 LPA Calculation ===');
console.log('Basic Salary:', basicSalary);
console.log('PF Base:', pfBase);
console.log('PF Employee:', pfEmployee);
console.log('PF Employer:', pfEmployer);
console.log('Prof Tax:', professionalTax);
console.log('Taxable Income:', taxableIncome);

let incomeTax = 0;
if (taxableIncome > 300000) {
  if (taxableIncome <= 700000) {
    incomeTax = (taxableIncome - 300000) * 0.05;
  } else if (taxableIncome <= 1000000) {
    incomeTax = 20000 + (taxableIncome - 700000) * 0.10;
  } else if (taxableIncome <= 1200000) {
    incomeTax = 50000 + (taxableIncome - 1000000) * 0.15;
  } else if (taxableIncome <= 1500000) {
    incomeTax = 80000 + (taxableIncome - 1200000) * 0.20;
  } else {
    incomeTax = 140000 + (taxableIncome - 1500000) * 0.30;
  }
}
incomeTax = Math.round(incomeTax * 1.04);

console.log('Income Tax (with cess):', incomeTax);

const employeeDeductions = pfEmployee + professionalTax + incomeTax;
const annualTakeHome = totalCTC - employeeDeductions - pfEmployer;
const monthlyTakeHome = Math.round(annualTakeHome / 12);

console.log('');
console.log('=== Summary ===');
console.log('Employee Deductions (shown):', employeeDeductions, '| monthly:', Math.round(employeeDeductions/12));
console.log('  - PF Employee:', pfEmployee);
console.log('  - Prof Tax:', professionalTax);
console.log('  - Income Tax:', incomeTax);
console.log('PF Employer (goes to PF account):', pfEmployer);
console.log('');
console.log('Annual Take-Home:', annualTakeHome);
console.log('Monthly Take-Home:', monthlyTakeHome);
console.log('Monthly Gross:', Math.round(totalCTC/12));
