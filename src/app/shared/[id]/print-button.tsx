"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors print:hidden"
    >
      <Printer className="w-4 h-4" />
      Print
    </button>
  );
}
