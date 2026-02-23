import { Coverage } from '@/lib/insurance/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, X } from 'lucide-react';

interface PlainEnglishProps {
    coverages: Coverage;
    extractedPerils?: {  // Dynamic content from PDF
        covered: string[];
        exclusions: string[];
    };
}

export function PlainEnglishAccordion({ coverages, extractedPerils }: PlainEnglishProps) {
    // Fallback to boolean-based display if extraction failed
    const coveredItems = extractedPerils?.covered || [
        coverages.hasOwnDamage && 'Own Damage (Accident, Fire, Theft)',
        coverages.hasThirdPartyLiability && 'Third Party Liability',
        coverages.hasZeroDepreciation && 'Zero Depreciation on Parts',
        coverages.hasEngineProtection && 'Engine & Gearbox Protection',
        coverages.hasReturnToInvoice && 'Return to Invoice',
        coverages.hasNCBProtection && 'NCB Protection',
        coverages.hasRoadsideAssistance && 'Roadside Assistance'
    ].filter(Boolean) as string[];

    const exclusionItems = extractedPerils?.exclusions || [
        'Wear and tear',
        'Consequential loss',
        'Driving under influence',
        'Driving without valid license',
        !coverages.hasEngineProtection && '⚠️ Engine damage from water (Not covered)'
    ].filter(Boolean) as string[];

    return (
        <Accordion type="single" collapsible className="space-y-3 w-full">
            <AccordionItem value="covered" className="glass-card rounded-2xl px-6 border-0">
                <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Check className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="font-bold text-slate-900">What is covered?</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-2">
                    <ul className="space-y-2 ml-11">
                        {coveredItems.map((item, i) => (
                            <li key={i} className="text-sm text-slate-600">• {item}</li>
                        ))}
                    </ul>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="not-covered" className="glass-card rounded-2xl px-6 border-0">
                <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <X className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="font-bold text-slate-900">Common Exclusions</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-2">
                    <ul className="space-y-2 ml-11">
                        {exclusionItems.map((item, i) => (
                            <li key={i} className={`text-sm ${item.includes('⚠️') ? 'text-red-600 font-semibold' : 'text-slate-600'}`}>
                                • {item}
                            </li>
                        ))}
                    </ul>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
