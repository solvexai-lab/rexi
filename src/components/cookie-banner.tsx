"use client";

import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";
import posthog from "posthog-js";

export function CookieBanner() {
    const [showConsent, setShowConsent] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("rexi_cookie_consent");
        if (!consent) {
            setShowConsent(true);
        }
    }, []);

    if (!showConsent) return null;

    const handleAccept = () => {
        localStorage.setItem("rexi_cookie_consent", "true");
        posthog.opt_in_capturing();
        setShowConsent(false);
    };

    const handleDecline = () => {
        localStorage.setItem("rexi_cookie_consent", "false");
        posthog.opt_out_capturing();
        setShowConsent(false);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] transform transition-transform duration-500 ease-out translate-y-0">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        <Cookie className="w-5 h-5 text-slate-700" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">Your Privacy Matters</h4>
                        <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed max-w-3xl">
                            We use strictly necessary cookies to make our site work. We'd also like to use analytics cookies to understand how you use REXI so we can improve it. We never sell your data or legal documents.
                            <a href="/privacy" className="text-slate-900 underline underline-offset-4 ml-1 hover:text-black">Read our Privacy Policy</a>.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                    <button
                        onClick={handleDecline}
                        className="flex-1 md:flex-none px-6 py-2.5 rounded-xl border-2 border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
                    >
                        Decline
                    </button>
                    <button
                        onClick={handleAccept}
                        className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-sm shadow-lg shadow-slate-200 hover:-translate-y-0.5 transition-all"
                    >
                        Accept Cookies
                    </button>
                </div>
            </div>
        </div>
    );
}
