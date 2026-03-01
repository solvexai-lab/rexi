import { Metadata } from "next";
import { Pool } from "pg";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Scale,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  Building2,
  DollarSign,
  MapPin,
  Calendar,
  FileDown,
  ArrowLeft,
  Clock,
  Eye
} from "lucide-react";
import { PrintButton } from "./print-button";
import { formatCurrencyCompact } from "@/lib/utils/currency";

// Create a PostgreSQL pool for direct database access (bypasses PostgREST schema cache)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

interface SharedReportPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: SharedReportPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Shared Report - REXI`,
    description: "View shared legal document analysis report",
    openGraph: {
      title: "REXI Legal Analysis Report",
      description: "AI-powered legal document analysis shared via REXI",
      type: "article",
    },
    robots: {
      index: false, // Don't index shared reports
      follow: false,
    },
  };
}

async function getSharedReport(id: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM shared_reports WHERE id = $1 AND expires_at > NOW()`,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const data = result.rows[0];

    // Update view count
    await client.query(
      `UPDATE shared_reports SET view_count = view_count + 1 WHERE id = $1`,
      [id]
    );

    return {
      ...data,
      view_count: (data.view_count || 0) + 1,
    };
  } finally {
    client.release();
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString(undefined, {
    dateStyle: "medium",
  });
}

function formatCurrency(amount: number, currency: string = "USD") {
  return formatCurrencyCompact(amount, currency, undefined);
}

function getSeverityConfig(severity: string) {
  const configs: Record<string, { bg: string; text: string; border: string; icon: typeof AlertTriangle }> = {
    critical: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: AlertTriangle },
    high: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", icon: AlertCircle },
    medium: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", icon: Info },
    low: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: Info },
    safe: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: CheckCircle2 },
  };
  return configs[severity] || configs.medium;
}

function getScoreColor(score: number) {
  if (score >= 75) return "text-emerald-500";
  if (score >= 60) return "text-blue-500";
  if (score >= 45) return "text-amber-500";
  return "text-red-500";
}

// Contract Analysis View Component
function ContractReportView({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      {/* Document Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">{data.fileName}</h2>
            <p className="text-slate-500">{data.summary?.type || "Contract"}</p>
            {data.summary?.parties?.length > 0 && (
              <p className="text-sm text-slate-400 mt-1">
                Parties: {data.summary.parties.join(", ")}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className={`text-4xl font-black ${getScoreColor(data.overallScore)}`}>
              {data.overallScore}
            </div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Score</p>
          </div>
        </div>
      </div>

      {/* Risk Summary */}
      {data.riskSummary && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Risk Summary</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(data.riskSummary)
              .filter(([_, count]) => (count as number) > 0)
              .map(([severity, count]) => {
                const config = getSeverityConfig(severity);
                return (
                  <div
                    key={severity}
                    className={`px-4 py-2 rounded-xl ${config.bg} ${config.text} border ${config.border}`}
                  >
                    <span className="font-bold text-lg">{count as number}</span>
                    <span className="ml-1 text-sm capitalize">{severity}</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Overall Assessment */}
      {data.summary?.overallAssessment && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-3">Overall Assessment</h3>
          <p className="text-slate-600 leading-relaxed">{data.summary.overallAssessment}</p>
        </div>
      )}

      {/* Strengths & Concerns */}
      <div className="grid md:grid-cols-2 gap-4">
        {data.strengths?.length > 0 && (
          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
            <h3 className="text-lg font-bold text-emerald-800 mb-3">✅ Strengths</h3>
            <ul className="space-y-2">
              {data.strengths.map((s: string, i: number) => (
                <li key={i} className="text-emerald-700 text-sm">• {s}</li>
              ))}
            </ul>
          </div>
        )}
        {data.concerns?.length > 0 && (
          <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
            <h3 className="text-lg font-bold text-red-800 mb-3">⚠️ Concerns</h3>
            <ul className="space-y-2">
              {data.concerns.map((c: string, i: number) => (
                <li key={i} className="text-red-700 text-sm">• {c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Clauses */}
      {data.clauses?.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Clause Analysis</h3>
          <div className="space-y-4">
            {data.clauses.map((clause: any, i: number) => {
              const config = getSeverityConfig(clause.severity);
              const Icon = config.icon;
              return (
                <div key={i} className={`p-4 rounded-xl ${config.bg} border ${config.border}`}>
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 ${config.text} mt-0.5`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-semibold ${config.text}`}>{clause.title}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.text} border ${config.border} uppercase font-bold`}>
                          {clause.severity}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm mb-2">{clause.aiAnalysis}</p>
                      {clause.suggestion && (
                        <p className="text-indigo-600 text-sm bg-indigo-50 p-2 rounded-lg">
                          💡 {clause.suggestion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Offer Analysis View Component
function OfferReportView({ data }: { data: any }) {
  const offer = data.offer;

  return (
    <div className="space-y-6">
      {/* Company & Role Info */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-slate-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{offer?.company}</h2>
              <p className="text-slate-500 font-medium">{offer?.role}</p>
              {offer?.location && (
                <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> {offer.location}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-black ${getScoreColor(data.overallScore)}`}>
              {data.overallScore}
            </div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Score</p>
          </div>
        </div>
      </div>

      {/* Compensation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mb-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xs text-slate-400 uppercase">Base Salary</p>
          <p className="text-lg font-bold text-slate-900">
            {formatCurrency(offer?.baseSalary || 0, offer?.currency)}
          </p>
        </div>
        {offer?.bonus && (
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mb-2">
              <DollarSign className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-xs text-slate-400 uppercase">Bonus</p>
            <p className="text-lg font-bold text-slate-900">
              {formatCurrency(offer.bonus, offer?.currency)}
            </p>
          </div>
        )}
        {offer?.equity && (
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mb-2">
              <Scale className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-xs text-slate-400 uppercase">Equity</p>
            <p className="text-lg font-bold text-slate-900">{offer.equity.type}</p>
          </div>
        )}
        {offer?.startDate && (
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center mb-2">
              <Calendar className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-xs text-slate-400 uppercase">Start Date</p>
            <p className="text-lg font-bold text-slate-900">{offer.startDate}</p>
          </div>
        )}
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-3">Summary</h3>
          <p className="text-slate-600 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Strengths & Concerns */}
      <div className="grid md:grid-cols-2 gap-4">
        {data.strengths?.length > 0 && (
          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
            <h3 className="text-lg font-bold text-emerald-800 mb-3">✅ Strengths</h3>
            <ul className="space-y-2">
              {data.strengths.map((s: string, i: number) => (
                <li key={i} className="text-emerald-700 text-sm">• {s}</li>
              ))}
            </ul>
          </div>
        )}
        {data.concerns?.length > 0 && (
          <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
            <h3 className="text-lg font-bold text-red-800 mb-3">⚠️ Concerns</h3>
            <ul className="space-y-2">
              {data.concerns.map((c: string, i: number) => (
                <li key={i} className="text-red-700 text-sm">• {c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Risks */}
      {data.risks?.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Risk Analysis</h3>
          <div className="space-y-4">
            {data.risks.map((risk: any, i: number) => {
              const config = getSeverityConfig(risk.severity);
              const Icon = config.icon;
              return (
                <div key={i} className={`p-4 rounded-xl ${config.bg} border ${config.border}`}>
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 ${config.text} mt-0.5`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-semibold ${config.text}`}>{risk.title}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.text} border ${config.border} uppercase font-bold`}>
                          {risk.severity}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm">{risk.description}</p>
                      {risk.suggestion && (
                        <p className="text-indigo-600 text-sm bg-indigo-50 p-2 rounded-lg mt-2">
                          💡 {risk.suggestion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Negotiation Points */}
      {data.negotiationPoints?.length > 0 && (
        <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-200">
          <h3 className="text-lg font-bold text-indigo-800 mb-3">💬 Negotiation Points</h3>
          <ul className="space-y-2">
            {data.negotiationPoints.map((point: string, i: number) => (
              <li key={i} className="text-indigo-700 text-sm">• {point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default async function SharedReportPage({ params }: SharedReportPageProps) {
  const { id } = await params;
  const report = await getSharedReport(id);

  if (!report) {
    notFound();
  }

  const expiresAt = new Date(report.expires_at);
  const createdAt = new Date(report.created_at);
  const isExpiringSoon = expiresAt.getTime() - Date.now() < 24 * 60 * 60 * 1000; // Less than 24 hours

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">REXI</span>
            </Link>

            <div className="flex items-center gap-3">
              <PrintButton />
              <Link
                href="/analyze"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors print:hidden"
              >
                Analyze Your Document
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Report Info Banner */}
        <div className={`mb-6 p-4 rounded-xl flex items-center justify-between ${isExpiringSoon ? 'bg-amber-50 border border-amber-200' : 'bg-slate-100'}`}>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Shared {formatDate(report.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {report.view_count} views
            </span>
          </div>
          <div className={`text-sm ${isExpiringSoon ? 'text-amber-700 font-medium' : 'text-slate-400'}`}>
            {isExpiringSoon ? '⚠️ Expires soon: ' : 'Expires: '}
            {formatDate(report.expires_at)}
          </div>
        </div>

        {/* Report Content */}
        {report.report_type === "contract" ? (
          <ContractReportView data={report.report_data} />
        ) : (
          <OfferReportView data={report.report_data} />
        )}

        {/* Disclaimer */}
        <div className="mt-8 p-6 bg-slate-100 rounded-2xl print:bg-white print:p-0">
          <p className="text-sm text-slate-500 leading-relaxed">
            <strong>⚖️ Disclaimer:</strong> This analysis is provided for informational purposes only and
            does not constitute legal advice. For important legal matters, always consult with a
            qualified legal professional. This shared report will expire on {formatDate(report.expires_at)}.
          </p>
          <p className="text-xs text-slate-400 mt-3">
            Generated by REXI - Smart Legal Document Review | <Link href="/" className="underline hover:text-slate-600">rexi.pro</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
