import type { ContractAnalysisResult } from "@/lib/types/contract-analysis";

/**
 * Generates a PDF report from the contract analysis result
 * Uses browser's built-in print functionality for PDF generation
 */
export async function generatePDFReport(analysis: ContractAnalysisResult): Promise<Blob> {
  // Create a new window with the report content
  const reportHTML = createReportHTML(analysis);

  // Create a blob with HTML content
  const htmlBlob = new Blob([reportHTML], { type: "text/html" });

  return htmlBlob;
}

/**
 * Creates HTML content for the PDF report
 */
function createReportHTML(analysis: ContractAnalysisResult): string {
  const severityColors: Record<string, { bg: string; text: string; label: string }> = {
    critical: { bg: "#FEF2F2", text: "#DC2626", label: "Critical" },
    high: { bg: "#FFF7ED", text: "#EA580C", label: "High" },
    medium: { bg: "#FFFBEB", text: "#D97706", label: "Medium" },
    low: { bg: "#EFF6FF", text: "#2563EB", label: "Low" },
    safe: { bg: "#ECFDF5", text: "#059669", label: "Safe" },
  };

  const clausesHTML = analysis.clauses
    .map((clause) => {
      const severity = severityColors[clause.severity] || severityColors.medium;
      const citationsHTML = clause.legalCitations
        .map(
          (citation) => `
          <div style="padding: 8px; background: #F9FAFB; border-radius: 6px; margin-top: 8px;">
            <strong style="color: #374151;">${citation.lawName}</strong>
            ${citation.section ? `<span style="color: #6B7280;"> - ${citation.section}</span>` : ""}
            <p style="margin: 4px 0 0; color: #6B7280; font-size: 12px;">${citation.relevance}</p>
          </div>
        `
        )
        .join("");

      return `
        <div style="margin-bottom: 24px; padding: 20px; background: white; border: 1px solid #E5E7EB; border-radius: 12px; break-inside: avoid;">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px;">
            <h3 style="margin: 0; font-size: 16px; color: #111827;">${clause.title}</h3>
            <span style="padding: 4px 12px; background: ${severity.bg}; color: ${severity.text}; border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: uppercase;">
              ${severity.label}
            </span>
          </div>

          <div style="padding: 12px; background: #F9FAFB; border-radius: 8px; margin-bottom: 16px;">
            <p style="margin: 0; font-family: monospace; font-size: 13px; color: #374151; line-height: 1.6;">
              "${clause.text}"
            </p>
          </div>

          <div style="margin-bottom: 12px;">
            <h4 style="margin: 0 0 8px; font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em;">Analysis</h4>
            <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.6;">${clause.aiAnalysis}</p>
          </div>

          ${clause.suggestion ? `
            <div style="margin-bottom: 12px; padding: 12px; background: #EEF2FF; border-radius: 8px;">
              <h4 style="margin: 0 0 6px; font-size: 12px; color: #4F46E5; text-transform: uppercase; letter-spacing: 0.05em;">Suggested Fix</h4>
              <p style="margin: 0; color: #4338CA; font-size: 13px;">${clause.suggestion}</p>
            </div>
          ` : ""}

          ${clause.legalCitations.length > 0 ? `
            <div>
              <h4 style="margin: 0 0 8px; font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em;">Legal References</h4>
              ${citationsHTML}
            </div>
          ` : ""}
        </div>
      `;
    })
    .join("");

  const strengthsHTML = analysis.strengths
    .map((s) => `<li style="margin-bottom: 6px; color: #059669;">✓ ${s}</li>`)
    .join("");

  const concernsHTML = analysis.concerns
    .map((c) => `<li style="margin-bottom: 6px; color: #DC2626;">⚠ ${c}</li>`)
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>REXI Legal Analysis - ${analysis.fileName}</title>
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
        <h1 style="margin: 0 0 8px; font-size: 24px; color: #111827;">Legal Document Analysis Report</h1>
        <p style="margin: 0; color: #6B7280; font-size: 14px;">Generated on ${new Date().toLocaleDateString("en-IN", { dateStyle: "full" })}</p>
      </div>

      <!-- Document Info -->
      <div style="background: white; border: 1px solid #E5E7EB; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
        <h2 style="margin: 0 0 16px; font-size: 18px; color: #111827;">📄 Document Information</h2>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
          <div>
            <p style="margin: 0; font-size: 12px; color: #6B7280; text-transform: uppercase;">File Name</p>
            <p style="margin: 4px 0 0; font-weight: 600; color: #111827;">${analysis.fileName}</p>
          </div>
          <div>
            <p style="margin: 0; font-size: 12px; color: #6B7280; text-transform: uppercase;">Document Type</p>
            <p style="margin: 4px 0 0; font-weight: 600; color: #111827;">${analysis.summary.type}</p>
          </div>
          <div>
            <p style="margin: 0; font-size: 12px; color: #6B7280; text-transform: uppercase;">Parties Involved</p>
            <p style="margin: 4px 0 0; font-weight: 600; color: #111827;">${analysis.summary.parties.join(", ") || "N/A"}</p>
          </div>
          <div>
            <p style="margin: 0; font-size: 12px; color: #6B7280; text-transform: uppercase;">Overall Score</p>
            <p style="margin: 4px 0 0; font-weight: 700; font-size: 20px; color: ${
              analysis.overallScore >= 70 ? "#059669" : analysis.overallScore >= 50 ? "#D97706" : "#DC2626"
            };">${analysis.overallScore}/100</p>
          </div>
        </div>

        ${analysis.summary.duration ? `
          <div style="margin-top: 16px;">
            <p style="margin: 0; font-size: 12px; color: #6B7280; text-transform: uppercase;">Duration</p>
            <p style="margin: 4px 0 0; font-weight: 600; color: #111827;">${analysis.summary.duration}</p>
          </div>
        ` : ""}
      </div>

      <!-- Risk Summary -->
      <div style="background: white; border: 1px solid #E5E7EB; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
        <h2 style="margin: 0 0 16px; font-size: 18px; color: #111827;">📊 Risk Summary</h2>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          ${Object.entries(analysis.riskSummary)
            .filter(([_, count]) => count > 0)
            .map(([severity, count]) => {
              const config = severityColors[severity] || severityColors.medium;
              return `
                <div style="padding: 12px 20px; background: ${config.bg}; border-radius: 12px; text-align: center;">
                  <p style="margin: 0; font-size: 24px; font-weight: 700; color: ${config.text};">${count}</p>
                  <p style="margin: 2px 0 0; font-size: 11px; color: ${config.text}; text-transform: uppercase; font-weight: 600;">${config.label}</p>
                </div>
              `;
            })
            .join("")}
        </div>
      </div>

      <!-- Overall Assessment -->
      <div style="background: white; border: 1px solid #E5E7EB; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
        <h2 style="margin: 0 0 12px; font-size: 18px; color: #111827;">📝 Overall Assessment</h2>
        <p style="margin: 0; color: #374151; line-height: 1.7;">${analysis.summary.overallAssessment}</p>
      </div>

      <!-- Strengths & Concerns -->
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

      <!-- Clauses Analysis -->
      <div class="page-break">
        <h2 style="margin: 0 0 24px; font-size: 20px; color: #111827;">🔍 Detailed Clause Analysis</h2>
        ${clausesHTML}
      </div>

      <!-- Disclaimer -->
      <div style="background: #F3F4F6; border-radius: 12px; padding: 20px; margin-top: 40px;">
        <p style="margin: 0; font-size: 12px; color: #6B7280; line-height: 1.6;">
          <strong>⚖️ Disclaimer:</strong> ${analysis.metadata.disclaimer}
        </p>
        <p style="margin: 12px 0 0; font-size: 11px; color: #9CA3AF;">
          Analysis performed on ${analysis.metadata.analysisDate} using ${analysis.metadata.modelUsed}
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #E5E7EB;">
        <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
          Generated by REXI - Smart Legal Document Review | rexilegal.com
        </p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Opens PDF in a new window for printing/saving
 */
export function openPDFReport(analysis: ContractAnalysisResult): void {
  const reportHTML = createReportHTML(analysis);
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
 * Downloads the report as HTML file (can be opened and printed as PDF)
 */
export function downloadHTMLReport(analysis: ContractAnalysisResult): void {
  const reportHTML = createReportHTML(analysis);
  const blob = new Blob([reportHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `REXI-Report-${analysis.fileName.replace(/\.[^/.]+$/, "")}-${Date.now()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates a shareable text summary of the analysis
 */
export function generateShareText(analysis: ContractAnalysisResult): string {
  const riskLevel =
    analysis.overallScore >= 70 ? "Low Risk ✅" :
    analysis.overallScore >= 50 ? "Medium Risk ⚠️" :
    "High Risk 🚨";

  const topConcerns = analysis.concerns.slice(0, 3).map(c => `• ${c}`).join("\n");

  return `📋 *REXI Legal Analysis Report*

📄 *Document:* ${analysis.fileName}
📊 *Type:* ${analysis.summary.type}
🎯 *Score:* ${analysis.overallScore}/100 (${riskLevel})

📈 *Risk Breakdown:*
${analysis.riskSummary.critical > 0 ? `🔴 Critical: ${analysis.riskSummary.critical}\n` : ""}${analysis.riskSummary.high > 0 ? `🟠 High: ${analysis.riskSummary.high}\n` : ""}${analysis.riskSummary.medium > 0 ? `🟡 Medium: ${analysis.riskSummary.medium}\n` : ""}${analysis.riskSummary.low > 0 ? `🔵 Low: ${analysis.riskSummary.low}\n` : ""}${analysis.riskSummary.safe > 0 ? `🟢 Safe: ${analysis.riskSummary.safe}` : ""}

${analysis.concerns.length > 0 ? `⚠️ *Key Concerns:*\n${topConcerns}` : "✅ No major concerns found!"}

_Analyzed by REXI - rexilegal.com_
_This is not legal advice._`;
}

/**
 * Share via WhatsApp with PDF file (mobile) or text-only (desktop)
 * Returns true if file was shared, false if only text was shared
 */
export async function shareViaWhatsApp(analysis: ContractAnalysisResult): Promise<{ success: boolean; fileShared: boolean }> {
  const text = generateShareText(analysis);

  // Check if Web Share API with file support is available (mobile)
  if (typeof navigator !== "undefined" && navigator.canShare) {
    try {
      const reportHTML = createReportHTML(analysis);
      const htmlBlob = new Blob([reportHTML], { type: "text/html" });
      const fileName = `REXI-Analysis-${analysis.fileName.replace(/\.[^/.]+$/, "")}-${Date.now()}.html`;
      const file = new File([htmlBlob], fileName, { type: "text/html" });

      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `REXI Analysis: ${analysis.fileName}`,
          text: text,
          files: [file],
        });
        return { success: true, fileShared: true };
      }
    } catch (error) {
      // User cancelled or error - fall through to text-only
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
export function shareViaEmail(analysis: ContractAnalysisResult): void {
  const subject = encodeURIComponent(`REXI Legal Analysis: ${analysis.fileName}`);
  const body = encodeURIComponent(generateShareText(analysis).replace(/\*/g, ""));
  const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
  window.location.href = mailtoUrl;
}

/**
 * Share via Telegram with file (mobile) or text-only (desktop)
 */
export async function shareViaTelegram(analysis: ContractAnalysisResult): Promise<{ success: boolean; fileShared: boolean }> {
  const text = generateShareText(analysis);

  // Check if Web Share API with file support is available (mobile)
  if (typeof navigator !== "undefined" && navigator.canShare) {
    try {
      const reportHTML = createReportHTML(analysis);
      const htmlBlob = new Blob([reportHTML], { type: "text/html" });
      const fileName = `REXI-Analysis-${analysis.fileName.replace(/\.[^/.]+$/, "")}-${Date.now()}.html`;
      const file = new File([htmlBlob], fileName, { type: "text/html" });

      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `REXI Analysis: ${analysis.fileName}`,
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
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent("https://rexilegal.com")}&text=${encodedText}`;
  window.open(telegramUrl, "_blank");
  return { success: true, fileShared: false };
}

/**
 * Copy shareable link/text to clipboard
 */
export async function copyShareText(analysis: ContractAnalysisResult): Promise<boolean> {
  const text = generateShareText(analysis);
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Use Web Share API if available (mobile-friendly) - includes PDF file
 */
export async function nativeShare(analysis: ContractAnalysisResult): Promise<boolean> {
  if (!navigator.share) {
    return false;
  }

  try {
    const text = generateShareText(analysis);
    const reportHTML = createReportHTML(analysis);
    const htmlBlob = new Blob([reportHTML], { type: "text/html" });
    const fileName = `REXI-Analysis-${analysis.fileName.replace(/\.[^/.]+$/, "")}-${Date.now()}.html`;
    const file = new File([htmlBlob], fileName, { type: "text/html" });

    // Check if file sharing is supported
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: `REXI Analysis: ${analysis.fileName}`,
        text: text,
        files: [file],
      });
    } else {
      // Fallback to text-only sharing
      await navigator.share({
        title: `REXI Analysis: ${analysis.fileName}`,
        text: text,
        url: "https://rexilegal.com",
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
