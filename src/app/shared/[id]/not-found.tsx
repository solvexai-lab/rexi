import Link from "next/link";
import { Scale, Clock, ArrowRight } from "lucide-react";

export default function SharedReportNotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-slate-400" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          Report Not Found
        </h1>

        <p className="text-slate-500 mb-8 leading-relaxed">
          This shared report may have expired or the link is invalid.
          Shared reports are available for 7 days after creation.
        </p>

        <div className="space-y-3">
          <Link
            href="/analyze"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
          >
            Analyze Your Own Document
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 text-slate-600 font-medium rounded-xl hover:bg-slate-100 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-slate-400">
          <Scale className="w-5 h-5" />
          <span className="font-semibold">REXI</span>
        </div>
      </div>
    </div>
  );
}
