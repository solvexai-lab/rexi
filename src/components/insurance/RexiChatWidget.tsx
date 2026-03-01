"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface RexiChatWidgetProps {
    analysisId: string;
    context: 'insurance' | 'offer' | 'contract' | 'health-insurance';
    initialMessage?: string;
    chatEndpoint?: string;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const PERSONAS = {
    insurance: { title: "Personal Policy Expert", placeholder: "Ask about coverage..." },
    offer: { title: "Salary Negotiation Coach", placeholder: "Ask about take-home pay..." },
    contract: { title: "Legal & Risk Analyst", placeholder: "Ask about liability..." },
    'health-insurance': { title: "Medical Policy Expert", placeholder: "Ask about room rent, waiting periods..." },
};

export function RexiChatWidget({ analysisId, context, initialMessage, chatEndpoint }: RexiChatWidgetProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: initialMessage || "I've analyzed your document. How can I help you understand it better?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    // Clear chat on analysisId change (new document)
    useEffect(() => {
        setMessages([{
            id: 'welcome',
            role: 'assistant',
            content: initialMessage || "I've analyzed your document. How can I help you understand it better?",
            timestamp: new Date()
        }]);
    }, [analysisId, initialMessage]);

    if (!isMounted) return null;

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const apiEndpoint = chatEndpoint || "/api/rexi/chat"; // Unified Endpoint or Custom
            const response = await fetch(apiEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage.content,
                    analysisId,
                    context // Pass context to backend
                })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Failed to get response");

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I encountered an issue. Please try asking again.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatMessage = (text: string) => {
        return text.split('\n').map((line, i) => (
            <p key={i} className="mb-2 min-h-[1.2em]">
                {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j}>{part.slice(2, -2)}</strong>;
                    }
                    return part;
                })}
            </p>
        ));
    };

    const persona = PERSONAS[context];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none font-sans">
            {/* Chat Window - Glass Panel */}
            {isOpen && (
                <div className="pointer-events-auto mb-6 w-full max-w-[360px] sm:max-w-[400px] h-[600px] max-h-[80vh] glass-panel-heavy squircle-soft flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 fade-in duration-500 origin-bottom-right shadow-dreamy border-white/60">

                    {/* Header - Premium */}
                    <div className="p-8 pb-4 flex items-center justify-between shrink-0 relative overflow-hidden">
                        <div className="absolute inset-0 mesh-gradient opacity-10 pointer-events-none" />
                        <div className="relative z-10">
                            <h3 className="font-serif text-3xl font-bold text-slate-950 tracking-tight leading-none">Rexi</h3>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mt-2">
                                {persona.title}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className="relative z-10 text-slate-400 hover:text-slate-950 hover:bg-white/50 rounded-full w-10 h-10 transition-all"
                        >
                            <X className="w-6 h-6" />
                        </Button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar bg-white/40">
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={cn(
                                    "flex flex-col max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                                    m.role === 'user' ? "ml-auto items-end" : "items-start"
                                )}
                            >
                                <div className={cn(
                                    "px-5 py-3.5 text-sm font-medium leading-relaxed",
                                    m.role === 'user'
                                        ? "bg-slate-950 text-white rounded-[1.5rem] rounded-tr-none shadow-xl"
                                        : "bg-white text-slate-800 rounded-[1.5rem] rounded-tl-none shadow-sm border border-slate-100"
                                )}>
                                    {formatMessage(m.content)}
                                </div>
                                <span className="text-[8px] uppercase font-bold text-slate-400 mt-2 tracking-widest opacity-60">
                                    {m.role === 'assistant' ? 'Rexi' : 'You'} • {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex flex-col items-start max-w-[85%] animate-pulse">
                                <div className="bg-white px-5 py-3.5 rounded-[1.5rem] rounded-tl-none shadow-sm border border-slate-100">
                                    <div className="flex gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-6 sm:p-8 bg-white/40 border-t border-white/60">
                        <div className="relative group">
                            <Input
                                placeholder={persona.placeholder}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                className="pr-12 h-14 bg-white/80 border-slate-200/60 rounded-2xl focus-visible:ring-slate-400 focus-visible:border-slate-400 font-medium text-slate-950 placeholder:text-slate-400 placeholder:font-bold placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                            />
                            <Button
                                size="icon"
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 top-2 h-10 w-10 bg-slate-950 hover:bg-black text-white rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Launcher Button - Premium Capsule */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "pointer-events-auto h-14 z-50 flex items-center justify-center gap-3 transition-all duration-500 shadow-2xl hover:scale-[1.02] rounded-full text-white border-0",
                    isOpen
                        ? "w-14 bg-slate-900 rotate-90 shadow-none border-0"
                        : "w-auto px-8 bg-slate-950 hover:bg-slate-900"
                )}
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <>
                        <Sparkles className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
                        <span className="font-semibold text-base tracking-tight text-white whitespace-nowrap">Ask Rexi</span>
                    </>
                )}
            </Button>
        </div>
    );
}
