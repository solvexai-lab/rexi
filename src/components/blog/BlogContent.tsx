"use client";

import React from "react";

interface BlogContentProps {
    content: string;
}

function parsesInline(text: string): React.ReactNode[] {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
}

function parseTable(lines: string[]): React.ReactElement {
    const rows = lines.map(l =>
        l.split("|").map(c => c.trim()).filter(c => c !== "")
    );
    const header = rows[0];
    const body = rows.filter((_, i) => i > 1);
    return (
        <div className="overflow-x-auto my-6 rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-900 text-white">
                    <tr>
                        {header.map((cell, i) => (
                            <th key={i} className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">
                                {cell}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {body.map((row, ri) => (
                        <tr key={ri} className="hover:bg-slate-50 transition-colors">
                            {row.map((cell, ci) => (
                                <td key={ci} className="px-4 py-3 text-slate-700 font-medium">
                                    {parsesInline(cell)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function BlogContent({ content }: BlogContentProps) {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i].trim();

        if (!line) { i++; continue; }

        // H2
        if (line.startsWith("## ")) {
            elements.push(
                <h2 key={i} className="font-serif text-2xl md:text-3xl font-bold text-slate-900 mt-10 mb-4 leading-tight">
                    {line.slice(3)}
                </h2>
            );
            i++; continue;
        }

        // H3
        if (line.startsWith("### ")) {
            elements.push(
                <h3 key={i} className="font-serif text-xl font-bold text-slate-800 mt-8 mb-3">
                    {line.slice(4)}
                </h3>
            );
            i++; continue;
        }

        // Blockquote / callout
        if (line.startsWith("> ")) {
            elements.push(
                <blockquote key={i} className="border-l-4 border-slate-900 bg-slate-50 rounded-r-2xl pl-6 pr-4 py-4 my-6">
                    <p className="text-slate-800 font-semibold italic leading-relaxed">
                        {parsesInline(line.slice(2))}
                    </p>
                </blockquote>
            );
            i++; continue;
        }

        // Table — collect consecutive table lines
        if (line.startsWith("|")) {
            const tableLines: string[] = [];
            while (i < lines.length && lines[i].trim().startsWith("|")) {
                tableLines.push(lines[i].trim());
                i++;
            }
            elements.push(<div key={`table-${i}`}>{parseTable(tableLines)}</div>);
            continue;
        }

        // Unordered list — collect consecutive bullet lines
        if (line.startsWith("- ")) {
            const items: string[] = [];
            while (i < lines.length && lines[i].trim().startsWith("- ")) {
                items.push(lines[i].trim().slice(2));
                i++;
            }
            elements.push(
                <ul key={`ul-${i}`} className="my-4 space-y-2 pl-2">
                    {items.map((item, ii) => (
                        <li key={ii} className="flex items-start gap-3 text-slate-700 leading-relaxed">
                            <span className="mt-1.5 w-2 h-2 rounded-full bg-slate-800 shrink-0" />
                            <span>{parsesInline(item)}</span>
                        </li>
                    ))}
                </ul>
            );
            continue;
        }

        // Ordered list — collect consecutive numbered lines
        if (/^\d+\.\s/.test(line)) {
            const items: string[] = [];
            while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
                items.push(lines[i].trim().replace(/^\d+\.\s/, ""));
                i++;
            }
            elements.push(
                <ol key={`ol-${i}`} className="my-4 space-y-3 pl-2">
                    {items.map((item, ii) => (
                        <li key={ii} className="flex items-start gap-4 text-slate-700 leading-relaxed">
                            <span className="shrink-0 w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                                {ii + 1}
                            </span>
                            <span className="pt-0.5">{parsesInline(item)}</span>
                        </li>
                    ))}
                </ol>
            );
            continue;
        }

        // Regular paragraph
        elements.push(
            <p key={i} className="text-slate-700 leading-relaxed md:leading-loose mb-5 text-base md:text-lg font-medium">
                {parsesInline(line)}
            </p>
        );
        i++;
    }

    return <div className="blog-prose">{elements}</div>;
}
