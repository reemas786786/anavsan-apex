import React, { useState } from 'react';
import { IconChevronLeft, IconClipboardCopy, IconSparkles, IconTerminal, IconInfo, IconChevronRight, IconLightbulb, IconClose, IconCode, IconCheck, IconDotsVertical } from '../constants';

const QueryPromptGeneratorView: React.FC<{
    onBack: () => void;
    onSaveClick: (tag: string) => void;
}> = ({ onBack, onSaveClick }) => {
    const [prompt, setPrompt] = useState('');
    const [generatedSQL, setGeneratedSQL] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [showInsight, setShowInsight] = useState(true);

    const promptStarters = [
        "Top 10 customers by spend",
        "Monthly credit usage trend",
        "Unused tables in last 90 days",
        "Slowest queries by warehouse"
    ];

    const handleGenerate = () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setGeneratedSQL(null);

        // Simulate AI generation
        setTimeout(() => {
            const mockSQL = `SELECT
    c.customer_name,
    SUM(s.total_amount) AS total_spend
FROM
    fact_sales s
JOIN
    dim_customers c ON s.customer_id = c.id
WHERE
    s.order_date >= DATEADD(month, -6, CURRENT_DATE())
GROUP BY
    1
ORDER BY
    2 DESC
LIMIT 10;`;
            setGeneratedSQL(mockSQL);
            setIsLoading(false);
        }, 2000);
    };

    const handleCopy = () => {
        if (generatedSQL) {
            navigator.clipboard.writeText(generatedSQL);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const sqlLines = generatedSQL ? generatedSQL.split('\n') : [];

    return (
        <div className="p-4 h-full flex flex-col bg-background font-sans text-[14px]">
            <div className="flex-shrink-0 mb-4">
                <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-[#6A38EB] hover:opacity-80 transition-opacity">
                    <IconChevronLeft className="h-4 w-4" /> Back to overview
                </button>
            </div>

            <main className="flex-grow grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4 overflow-hidden">
                {/* Left Sidebar: Natural Language Input */}
                <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar pr-1">
                    {showInsight && (
                        <div className="bg-[#F3F0FF] border border-[#E5E7EB] p-4 rounded-[12px] flex items-start gap-3 relative shadow-sm animate-in fade-in slide-in-from-top-2 flex-shrink-0">
                            <div className="p-1.5 bg-[#6A38EB]/10 rounded-lg flex-shrink-0">
                                <IconLightbulb className="w-4 h-4 text-[#6A38EB]" />
                            </div>
                            <div className="pr-6">
                                <h4 className="text-[13px] font-semibold text-[#161616]">Schema context tip</h4>
                                <p className="text-[12px] text-[#5A5A72] mt-1 leading-relaxed">
                                    Include table names and specific columns for more accurate results. We use your schema context to improve quality.
                                </p>
                            </div>
                            <button 
                                onClick={() => setShowInsight(false)}
                                className="absolute top-4 right-4 text-[#9CA3AF] hover:text-[#161616] transition-colors"
                            >
                                <IconClose className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <div className="bg-white p-6 rounded-[12px] border border-[#E5E7EB] shadow-sm flex flex-col gap-6 flex-shrink-0">
                        <div className="space-y-1">
                            <h3 className="text-[16px] font-semibold text-[#161616]">Natural language</h3>
                            <p className="text-[13px] text-[#5A5A72]">Describe the query you want to generate</p>
                        </div>

                        <div className="space-y-4 flex flex-col">
                            {/* Prompt Starters */}
                            <div className="flex flex-wrap gap-2">
                                {promptStarters.map((starter, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setPrompt(starter)}
                                        className="px-3 py-1.5 bg-surface-nested border border-[#E5E7EB] rounded-full text-[12px] text-[#5A5A72] hover:border-[#6A38EB] hover:text-[#6A38EB] transition-all whitespace-nowrap"
                                    >
                                        {starter}
                                    </button>
                                ))}
                            </div>

                            <div className="relative h-[200px] flex flex-col">
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
                                    className="h-full w-full bg-surface-nested text-[14px] p-4 rounded-[12px] border border-[#E5E7EB] focus:ring-2 focus:ring-[#6A38EB]/10 focus:border-[#6A38EB] resize-none placeholder:text-[#9CA3AF] outline-none transition-all leading-relaxed"
                                    placeholder="e.g., Show me the top 10 customers by total spend..."
                                />
                                <div className="absolute bottom-3 right-3 text-[11px] text-[#9CA3AF] font-medium">
                                    {prompt.length}/500
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={!prompt.trim() || isLoading}
                            className="w-full bg-[#6A38EB] hover:opacity-90 text-white text-[14px] font-semibold py-3.5 rounded-[12px] shadow-md shadow-[#6A38EB]/20 transition-all active:scale-[0.98] disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] disabled:shadow-none flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <IconSparkles className="w-4 h-4" />
                                    Generate SQL
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Canvas: Code Output */}
                <div className="flex flex-col bg-white rounded-[12px] border border-[#E5E7EB] shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#F3F0FF] flex items-center justify-center">
                                <IconCode className="w-5 h-5 text-[#6A38EB]" />
                            </div>
                            <div>
                                <h3 className="text-[16px] font-semibold text-[#161616]">Generated SQL prompt</h3>
                                <p className="text-[13px] text-[#5A5A72]">Review and refine the generated code</p>
                            </div>
                        </div>
                        {generatedSQL && (
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={handleCopy}
                                    className="p-2 hover:bg-surface-nested rounded-lg text-[#5A5A72] transition-all"
                                    title="Copy SQL"
                                >
                                    {isCopied ? <IconCheck className="w-5 h-5 text-green-600" /> : <IconClipboardCopy className="w-5 h-5" />}
                                </button>
                                <button className="p-2 hover:bg-surface-nested rounded-lg text-[#5A5A72] transition-colors">
                                    <IconDotsVertical className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex-grow flex overflow-hidden relative">
                        {isLoading ? (
                            <div className="flex-grow flex flex-col items-center justify-center p-12 space-y-6">
                                <div className="w-full max-w-md space-y-4">
                                    <div className="h-4 bg-surface-nested rounded-full w-3/4 animate-pulse" />
                                    <div className="h-4 bg-surface-nested rounded-full w-1/2 animate-pulse" />
                                    <div className="h-4 bg-surface-nested rounded-full w-5/6 animate-pulse" />
                                    <div className="h-4 bg-surface-nested rounded-full w-2/3 animate-pulse" />
                                </div>
                                <div className="flex items-center gap-2 text-[#6A38EB] font-medium animate-pulse">
                                    <IconSparkles className="w-4 h-4" />
                                    <span>AI is generating your code...</span>
                                </div>
                            </div>
                        ) : generatedSQL ? (
                            <div className="flex-grow flex overflow-hidden bg-surface-nested">
                                {/* Line Numbers */}
                                <div className="w-12 bg-surface-nested border-r border-[#E5E7EB] py-6 flex flex-col items-center text-[12px] font-mono text-[#9CA3AF] select-none">
                                    {sqlLines.map((_, i) => (
                                        <div key={i} className="h-6 leading-6">{i + 1}</div>
                                    ))}
                                </div>
                                {/* Code Area */}
                                <div className="flex-grow overflow-auto py-6 px-8 no-scrollbar">
                                    <pre className="text-[14px] font-mono leading-6 text-[#161616]">
                                        {sqlLines.map((line, i) => {
                                            const highlighted = line.replace(/\b(SELECT|FROM|JOIN|ON|WHERE|GROUP BY|ORDER BY|LIMIT|AS|SUM|DATEADD|CURRENT_DATE)\b/g, '<span class="text-[#6A38EB] font-semibold">$1</span>');
                                            return (
                                                <div key={i} className="h-6" dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }} />
                                            );
                                        })}
                                    </pre>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-grow flex flex-col items-center justify-center text-center p-12">
                                <div className="w-16 h-16 bg-[#F3F0FF] rounded-2xl flex items-center justify-center mb-4">
                                    <IconTerminal className="w-8 h-8 text-[#6A38EB]/40" />
                                </div>
                                <h3 className="text-[16px] font-semibold text-[#161616]">Waiting for AI</h3>
                                <p className="text-[13px] text-[#5A5A72] mt-2 max-w-xs">
                                    Enter a prompt on the left to see the generated SQL prompt here.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-white border-t border-[#E5E7EB] flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[12px] text-[#9CA3AF] font-medium">
                            <IconInfo className="w-3.5 h-3.5" />
                            <span>Generated via Snowflake Cortex</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="px-6 py-2.5 text-[13px] font-semibold text-[#161616] border border-[#E5E7EB] rounded-[12px] hover:bg-surface-nested transition-all active:scale-95">
                                Open in Snowflake
                            </button>
                            <button 
                                onClick={handleGenerate}
                                className="px-6 py-2.5 text-[13px] font-semibold text-white bg-[#6A38EB] rounded-[12px] hover:opacity-90 transition-all shadow-sm shadow-[#6A38EB]/20 active:scale-95"
                            >
                                Refine prompt
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default QueryPromptGeneratorView;
