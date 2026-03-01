import type { OfferAnalysisResponse } from "@/lib/types/offer-analysis";
import { formatCurrencyCompact } from "@/lib/utils/currency";

/**
 * Creates HTML content for the Offer Analysis PDF report
 */
function createOfferReportHTML(offer: OfferAnalysisResponse): string {
  const severityColors: Record<string, { bg: string; text: string; label: string }> = {
    critical: { bg: "#FEF2F2", text: "#DC2626", label: "Critical" },
    high: { bg: "#FFF7ED", text: "#EA580C", label: "High" },
    medium: { bg: "#FFFBEB", text: "#D97706", label: "Medium" },
    low: { bg: "#EFF6FF", text: "#2563EB", label: "Low" },
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return formatCurrencyCompact(amount, currency, undefined);
  };

  const risksHTML = offer.risks
    .map((risk) => {
      const severity = severityColors[risk.severity] || severityColors.medium;
      return `
        <div style="margin-bottom: 16px; padding: 16px; background: ${severity.bg}; border-radius: 12px; border-left: 4px solid ${severity.text};">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <h4 style="margin: 0; font-size: 14px; color: ${severity.text}; font-weight: 700;">${risk.title}</h4>
            <span style="padding: 4px 10px; background: white; color: ${severity.text}; border-radius: 9999px; font-size: 10px; font-weight: 600; text-transform: uppercase;">
              ${severity.label}
            </span>
          </div>
          <p style="margin: 0 0 8px; color: #374151; font-size: 13px;">${risk.description}</p>
          ${risk.suggestion ? `<p style="margin: 0; color: #4F46E5; font-size: 12px; font-weight: 500;">💡 ${risk.suggestion}</p>` : ""}
        </div>
      `;
    })
    .join("");

  const strengthsHTML = offer.strengths
    .map((s) => `<li style="margin-bottom: 6px; color: #059669;">✓ ${s}</li>`)
    .join("");

  const concernsHTML = offer.concerns
    .map((c: string) => `<li style="margin-bottom: 6px; color: #DC2626;">⚠ ${c}</li>`)
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>REXI Offer Analysis - ${offer.offer.company}</title>
      <style>
        * { box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.5;
          color: #111827;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 24px;
          background: #FAFAFA;
        }
        @media print {
          body { background: white; padding: 20px; }
          .no-print { display: none !important; }
          .page-break { page-break-before: always; }
        }
      </style>
    </head>
    <body>
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 2px solid #E5E7EB;">
        <div style="display: inline-flex; align-items: center; gap: 12px; margin-bottom: 16px;">
          <div style="width: 48px; height: 48px; background: #111827; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 20px;">⚖️</span>
          </div>
          <span style="font-size: 28px; font-weight: 700; color: #111827;">REXI</span>
        </div>
        <h1 style="margin: 0 0 8px; font-size: 24px; color: #111827;">Employment Offer Analysis Report</h1>
        <p style="margin: 0; color: #6B7280; font-size: 14px;">Generated on ${new Date().toLocaleDateString(undefined, { dateStyle: "full" })}</p>
      </div>

      <!-- Offer Summary -->
      <div style="background: linear-gradient(135deg, #111827 0%, #1F2937 100%); border-radius: 24px; padding: 32px; margin-bottom: 32px; color: white;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px;">
          <div>
            <h2 style="margin: 0 0 8px; font-size: 28px; font-weight: 700;">${offer.offer.company}</h2>
            <p style="margin: 0; font-size: 18px; opacity: 0.9;">${offer.offer.role}</p>
            <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.7;">${offer.offer.location || "Remote"}</p>
          </div>
          <div style="text-align: center; background: rgba(255,255,255,0.1); padding: 20px 32px; border-radius: 16px;">
            <p style="margin: 0; font-size: 48px; font-weight: 800;">${offer.overallScore}</p>
            <p style="margin: 4px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.7;">Overall Score</p>
          </div>
        </div>
      </div>

      <!-- Compensation Overview -->
      <div style="background: white; border: 1px solid #E5E7EB; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
        <h2 style="margin: 0 0 20px; font-size: 18px; color: #111827;">💰 Compensation Overview</h2>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
          <div style="padding: 16px; background: #F0FDF4; border-radius: 12px; border: 1px solid #BBF7D0;">
            <p style="margin: 0; font-size: 11px; color: #166534; text-transform: uppercase; font-weight: 600;">Base Salary</p>
            <p style="margin: 8px 0 0; font-size: 24px; font-weight: 700; color: #15803D;">${formatCurrency(offer.offer.baseSalary, offer.offer.currency)}</p>
            <p style="margin: 4px 0 0; font-size: 12px; color: #166534;">per annum</p>
          </div>
          <div style="padding: 16px; background: #EFF6FF; border-radius: 12px; border: 1px solid #BFDBFE;">
            <p style="margin: 0; font-size: 11px; color: #1E40AF; text-transform: uppercase; font-weight: 600;">Total CTC</p>
            <p style="margin: 8px 0 0; font-size: 24px; font-weight: 700; color: #1D4ED8;">${formatCurrency(offer.offer.salaryBreakdown?.totalCTC || offer.offer.baseSalary, offer.offer.currency)}</p>
            <p style="margin: 4px 0 0; font-size: 12px; color: #1E40AF;">per annum</p>
          </div>
          ${offer.offer.salaryBreakdown ? `
          <div style="padding: 16px; background: #F5F3FF; border-radius: 12px; border: 1px solid #DDD6FE;">
            <p style="margin: 0; font-size: 11px; color: #5B21B6; text-transform: uppercase; font-weight: 600;">Monthly Take-Home</p>
            <p style="margin: 8px 0 0; font-size: 24px; font-weight: 700; color: #6D28D9;">${formatCurrency(offer.offer.salaryBreakdown.monthlyTakeHome, offer.offer.currency)}</p>
            <p style="margin: 4px 0 0; font-size: 12px; color: #5B21B6;">after deductions</p>
          </div>
          ` : ""}
          ${offer.offer.bonus ? `
          <div style="padding: 16px; background: #FEF3C7; border-radius: 12px; border: 1px solid #FDE68A;">
            <p style="margin: 0; font-size: 11px; color: #92400E; text-transform: uppercase; font-weight: 600;">Bonus</p>
            <p style="margin: 8px 0 0; font-size: 24px; font-weight: 700; color: #B45309;">${formatCurrency(offer.offer.bonus, offer.offer.currency)}</p>
            <p style="margin: 4px 0 0; font-size: 12px; color: #92400E;">performance bonus</p>
          </div>
          ` : ""}
        </div>
      </div>

      <!-- One-Time Benefits -->
      ${offer.offer.oneTimeBenefits?.joiningBonus || offer.offer.oneTimeBenefits?.relocationAllowance ? `
      <div style="background: white; border: 1px solid #E5E7EB; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
        <h2 style="margin: 0 0 16px; font-size: 18px; color: #111827;">🎁 One-Time Benefits</h2>
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          ${offer.offer.oneTimeBenefits?.joiningBonus ? `
          <div style="padding: 12px 20px; background: #ECFDF5; border-radius: 10px;">
            <span style="font-weight: 600; color: #059669;">Joining Bonus: ${formatCurrency(offer.offer.oneTimeBenefits.joiningBonus, offer.offer.currency)}</span>
            ${offer.offer.oneTimeBenefits?.joiningBonusClawbackMonths ? `
            <span style="display: block; font-size: 11px; color: #047857; margin-top: 4px;">
              ⚠️ ${offer.offer.oneTimeBenefits.joiningBonusClawbackMonths} month clawback
            </span>
            ` : ""}
          </div>
          ` : ""}
          ${offer.offer.oneTimeBenefits?.relocationAllowance ? `
          <div style="padding: 12px 20px; background: #EFF6FF; border-radius: 10px;">
            <span style="font-weight: 600; color: #2563EB;">Relocation: ${formatCurrency(offer.offer.oneTimeBenefits.relocationAllowance, offer.offer.currency)}</span>
          </div>
          ` : ""}
        </div>
      </div>
      ` : ""}

      <!-- Summary -->
      <div style="background: white; border: 1px solid #E5E7EB; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
        <h2 style="margin: 0 0 12px; font-size: 18px; color: #111827;">📝 Summary</h2>
        <p style="margin: 0; color: #374151; line-height: 1.7; font-size: 14px;">${offer.summary}</p>
      </div>

      <!-- Strengths & Weaknesses -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 32px;">
        <div style="background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 16px; padding: 24px;">
          <h2 style="margin: 0 0 12px; font-size: 16px; color: #059669;">✅ Strengths</h2>
          <ul style="margin: 0; padding-left: 0; list-style: none;">
            ${strengthsHTML || "<li style='color: #6B7280;'>No specific strengths identified</li>"}
          </ul>
        </div>
        <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 16px; padding: 24px;">
          <h2 style="margin: 0 0 12px; font-size: 16px; color: #DC2626;">⚠️ Concerns</h2>
          <ul style="margin: 0; padding-left: 0; list-style: none;">
            ${concernsHTML || "<li style='color: #6B7280;'>No major concerns identified</li>"}
          </ul>
        </div>
      </div>

      <!-- Risks -->
      ${offer.risks.length > 0 ? `
      <div class="page-break" style="margin-bottom: 32px;">
        <h2 style="margin: 0 0 20px; font-size: 20px; color: #111827;">🚨 Risk Analysis (${offer.risks.length} Found)</h2>
        ${risksHTML}
      </div>
      ` : `
      <div style="background: #ECFDF5; border-radius: 16px; padding: 24px; margin-bottom: 32px; text-align: center;">
        <p style="margin: 0; font-size: 16px; color: #059669; font-weight: 600;">✅ No significant risks detected in this offer!</p>
      </div>
      `}

      <!-- Key Terms -->
      <div style="background: white; border: 1px solid #E5E7EB; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
        <h2 style="margin: 0 0 16px; font-size: 18px; color: #111827;">📋 Key Terms</h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
          <div style="padding: 12px; background: #F9FAFB; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 10px; color: #6B7280; text-transform: uppercase;">Notice Period</p>
            <p style="margin: 4px 0 0; font-weight: 700; color: #111827;">${offer.offer.noticePeriod || "Not specified"}</p>
          </div>
          <div style="padding: 12px; background: #F9FAFB; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 10px; color: #6B7280; text-transform: uppercase;">Probation</p>
            <p style="margin: 4px 0 0; font-weight: 700; color: #111827;">${offer.offer.probationPeriod || "Not specified"}</p>
          </div>
          <div style="padding: 12px; background: #F9FAFB; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 10px; color: #6B7280; text-transform: uppercase;">Work Mode</p>
            <p style="margin: 4px 0 0; font-weight: 700; color: #111827;">${offer.offer.workMode || "Not specified"}</p>
          </div>
        </div>
      </div>

      <!-- Disclaimer -->
      <div style="background: #F3F4F6; border-radius: 12px; padding: 20px; margin-top: 40px;">
        <p style="margin: 0; font-size: 12px; color: #6B7280; line-height: 1.6;">
          <strong>⚖️ Disclaimer:</strong> ${offer.metadata.disclaimer}
        </p>
        <p style="margin: 12px 0 0; font-size: 11px; color: #9CA3AF;">
          Analysis performed on ${offer.metadata.analysisDate}
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #E5E7EB;">
        <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
          Generated by REXI - Smart Legal Document Review | rexi.pro
        </p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Opens PDF in a new window for printing/saving
 */
export function openOfferPDFReport(offer: OfferAnalysisResponse): void {
  const reportHTML = createOfferReportHTML(offer);
  const printWindow = window.open("", "_blank");

  if (printWindow) {
    printWindow.document.write(reportHTML);
    printWindow.document.close();

    // Wait for content to load then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  }
}

/**
 * Downloads the report as HTML file
 */
export function downloadOfferHTMLReport(offer: OfferAnalysisResponse): void {
  const reportHTML = createOfferReportHTML(offer);
  const blob = new Blob([reportHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `REXI-Offer-${offer.offer.company.replace(/\s+/g, "-")}-${Date.now()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates a shareable text summary for offers
 */
export function generateOfferShareText(offer: OfferAnalysisResponse): string {
  const formatCurrency = (amount: number, currency: string = "USD") => {
    return formatCurrencyCompact(amount, currency, undefined);
  };

  const riskLevel =
    offer.overallScore >= 75 ? "Excellent ✅" :
      offer.overallScore >= 60 ? "Good 👍" :
        offer.overallScore >= 45 ? "Average ⚠️" :
          "Needs Review 🚨";

  const topRisks = offer.risks.slice(0, 2).map(r => `• ${r.title} (${r.severity})`).join("\n");

  return `📋 *REXI Offer Letter Analysis*

🏢 *Company:* ${offer.offer.company}
💼 *Role:* ${offer.offer.role}
📍 *Location:* ${offer.offer.location || "Not specified"}

💰 *Base Salary:* ${formatCurrency(offer.offer.baseSalary, offer.offer.currency)}
${offer.offer.salaryBreakdown ? `🏠 *Monthly Take-Home:* ${formatCurrency(offer.offer.salaryBreakdown.monthlyTakeHome, offer.offer.currency)}` : ""}
${offer.offer.bonus ? `🎯 *Bonus:* ${formatCurrency(offer.offer.bonus, offer.offer.currency)}` : ""}

🎯 *Score:* ${offer.overallScore}/100 (${riskLevel})
⚠️ *Risks Found:* ${offer.risks.length}

${offer.risks.length > 0 ? `🚨 *Top Risks:*\n${topRisks}` : "✅ No significant risks detected!"}

_Analyzed by REXI - rexi.pro_
_This is not legal advice._`;
}

/**
 * Share via WhatsApp with report file (mobile) or text-only (desktop)
 * Returns true if file was shared, false if only text was shared
 */
export async function shareOfferViaWhatsApp(offer: OfferAnalysisResponse): Promise<{ success: boolean; fileShared: boolean }> {
  const text = generateOfferShareText(offer);

  // Check if Web Share API with file support is available (mobile)
  if (typeof navigator !== "undefined" && navigator.canShare) {
    try {
      const reportHTML = createOfferReportHTML(offer);
      const htmlBlob = new Blob([reportHTML], { type: "text/html" });
      const fileName = `REXI-Offer-${offer.offer.company.replace(/\s+/g, "-")}-${Date.now()}.html`;
      const file = new File([htmlBlob], fileName, { type: "text/html" });

      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `REXI Analysis: ${offer.offer.company} - ${offer.offer.role}`,
          text: text,
          files: [file],
        });
        return { success: true, fileShared: true };
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return { success: false, fileShared: false };
      }
    }
  }

  // Fallback: Text-only sharing via WhatsApp URL
  const encodedText = encodeURIComponent(text);
  const whatsappUrl = `https://wa.me/?text=${encodedText}`;
  window.open(whatsappUrl, "_blank");
  return { success: true, fileShared: false };
}

/**
 * Share via Email
 */
export function shareOfferViaEmail(offer: OfferAnalysisResponse): void {
  const subject = encodeURIComponent(`REXI Offer Analysis: ${offer.offer.company} - ${offer.offer.role}`);
  const body = encodeURIComponent(generateOfferShareText(offer).replace(/\*/g, ""));
  const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
  window.location.href = mailtoUrl;
}

/**
 * Share via Telegram with file (mobile) or text-only (desktop)
 */
export async function shareOfferViaTelegram(offer: OfferAnalysisResponse): Promise<{ success: boolean; fileShared: boolean }> {
  const text = generateOfferShareText(offer);

  // Check if Web Share API with file support is available (mobile)
  if (typeof navigator !== "undefined" && navigator.canShare) {
    try {
      const reportHTML = createOfferReportHTML(offer);
      const htmlBlob = new Blob([reportHTML], { type: "text/html" });
      const fileName = `REXI-Offer-${offer.offer.company.replace(/\s+/g, "-")}-${Date.now()}.html`;
      const file = new File([htmlBlob], fileName, { type: "text/html" });

      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `REXI Analysis: ${offer.offer.company} - ${offer.offer.role}`,
          text: text,
          files: [file],
        });
        return { success: true, fileShared: true };
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return { success: false, fileShared: false };
      }
    }
  }

  // Fallback: Text-only sharing via Telegram URL
  const encodedText = encodeURIComponent(text);
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent("https://rexi.pro")}&text=${encodedText}`;
  window.open(telegramUrl, "_blank");
  return { success: true, fileShared: false };
}

/**
 * Copy shareable text to clipboard
 */
export async function copyOfferShareText(offer: OfferAnalysisResponse): Promise<boolean> {
  const text = generateOfferShareText(offer);
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Use Web Share API if available (mobile-friendly) - includes report file
 */
export async function nativeShareOffer(offer: OfferAnalysisResponse): Promise<boolean> {
  if (!navigator.share) {
    return false;
  }

  try {
    const text = generateOfferShareText(offer);
    const reportHTML = createOfferReportHTML(offer);
    const htmlBlob = new Blob([reportHTML], { type: "text/html" });
    const fileName = `REXI-Offer-${offer.offer.company.replace(/\s+/g, "-")}-${Date.now()}.html`;
    const file = new File([htmlBlob], fileName, { type: "text/html" });

    // Check if file sharing is supported
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: `REXI Analysis: ${offer.offer.company} - ${offer.offer.role}`,
        text: text,
        files: [file],
      });
    } else {
      // Fallback to text-only sharing
      await navigator.share({
        title: `REXI Analysis: ${offer.offer.company} - ${offer.offer.role}`,
        text: text,
        url: "https://rexi.pro",
      });
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if native sharing is supported
 */
export function isNativeShareSupported(): boolean {
  return typeof navigator !== "undefined" && !!navigator.share;
}
