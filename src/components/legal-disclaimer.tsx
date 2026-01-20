import React from 'react';

export function LegalDisclaimer() {
  return (
    <div className="text-[10px] text-slate-500 max-w-2xl mx-auto mt-8 leading-relaxed italic">
      <p>
        <strong>Disclaimer:</strong> REXI is an automated document analysis tool designed to help freelancers identify common document patterns. 
        It does not provide legal advice, and its analysis should not be considered a substitute for professional legal counsel. 
        The "risk patterns" detected are based on industry standards and general legal principles, which may vary by jurisdiction. 
        Always consult with a qualified attorney before signing any legal agreement.
      </p>
    </div>
  );
}
