
import React, { useState, useEffect, useRef, FormEvent, useMemo } from 'react';
// Correct import as per guidelines
import { GoogleGenAI, Chat, Content } from '@google/genai';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, TrendingUp, BarChart3, Zap, Paperclip, Mic, ArrowUp, ArrowRight, Plus, ArrowDown, ThumbsUp, ThumbsDown, Copy, Share, RotateCw, MoreHorizontal, Brain, Lock, History, SquarePen, PanelRightOpen } from 'lucide-react';
import DecisionSupportFlow from '../components/DecisionSupportFlow';
import IntelligenceDecisionCard from '../components/IntelligenceDecisionCard';
import GovernanceOptimizationFlow from '../components/GovernanceOptimizationFlow';
import AgenticResponse from '../components/AgenticResponse';
import DiagnosticWizardFlow from '../components/DiagnosticWizardFlow';
import { IconShare, IconDotsVertical, IconChevronDown, IconArrowUp, IconEdit, IconClipboardCopy, IconCheck, IconAIAgent, IconSearch, IconFlag, IconMessageSquare, IconSparkles, IconExternalLink, IconPin } from '../constants';
import { recommendationsData } from '../data/dummyData';

export interface AIAgentProps {
    onNavigate?: (page: string) => void;
}

// --- TYPES ---
interface Message {
    role: 'user' | 'model';
    text: string;
    timestamp: string;
}

interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
}

// --- ICONS ---
const AnavsanLogo: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="48" height="52" viewBox="0 0 48 52" fill="none">
        <path d="M26.0245 1.10411C26.5035 0.944589 27.0263 0.947640 27.4289 1.26015C27.8353 1.57579 27.8353 1.57579 27.4289 1.26015C26.0245 1.10411ZM23.0063 10.1675C18.5457 17.0145 14.8187 24.1166 11.563 31.4691C13.3624 30.4149 15.3197 29.6376 17.3675 29.1699L18.3344 28.9598C20.4134 28.5266 22.5251 28.2002 24.6202 27.8323C23.4817 22.1099 22.7559 16.2408 23.0063 10.1675Z" fill="url(#paint0_linear_splash)" stroke="url(#paint1_linear_splash)" strokeWidth="0.75"/>
        <defs>
            <linearGradient id="paint0_linear_splash" x1="23.9999" y1="1.54252" x2="23.9999" y2="50.4578" gradientUnits="userSpaceOnUse"><stop stopColor="#6932D5"/><stop offset="1" stopColor="#7163C6"/></linearGradient>
            <linearGradient id="paint1_linear_splash" x1="24" y1="1" x2="24" y2="51" gradientUnits="userSpaceOnUse"><stop stopColor="#6932D5"/><stop offset="1" stopColor="#7163C6"/></linearGradient>
        </defs>
    </svg>
);

const IconThumbUp: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.422 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M6.633 10.5l-1.822 1.822a2.25 2.25 0 00-3.183 3.183l1.414 1.414a2.25 2.25 0 003.183-3.183L6.633 10.5z" />
    </svg>
);

const IconThumbDown: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.862 10.5a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9l-1.822 1.822a2.25 2.25 0 000 3.183l1.414 1.414a2.25 2.25 0 003.183 0l1.822-1.222a2.25 2.25 0 000-3.183l-1.414-1.414a2.25 2.25 0 00-3.183 0z" />
    </svg>
);


// --- CHAT HISTORY SIDEBAR ---
const ChatHistorySidebar: React.FC<{
    chats: ChatSession[];
    activeChatId: string | null;
    onSelectChat: (id: string) => void;
    onNewChat: () => void;
}> = ({ chats, activeChatId, onSelectChat, onNewChat }) => {
    return (
        <aside className="w-64 bg-surface text-text-primary p-2 flex flex-col flex-shrink-0 border-r border-border-color">
            <div className="flex items-center justify-between p-2">
                <h3 className="text-base font-semibold text-text-strong">Chats</h3>
                <button onClick={onNewChat} className="p-2 rounded-lg hover:bg-surface-hover" aria-label="New Chat">
                    <IconEdit className="w-5 h-5" />
                </button>
            </div>
            <div className="relative mt-2">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IconSearch className="h-4 w-4 text-text-muted" />
                </div>
                <input
                    type="search"
                    placeholder="Search chats..."
                    className="w-full pl-9 pr-3 py-2 bg-surface-nested border border-border-color rounded-lg text-sm focus:ring-1 focus:ring-primary"
                />
            </div>
            <nav className="mt-4 overflow-y-auto flex-1">
                <ul className="space-y-1">
                    {chats.map(chat => (
                        <li key={chat.id}>
                            <button
                                onClick={() => onSelectChat(chat.id)}
                                className={`w-full text-left px-3 py-2 text-sm rounded-lg truncate transition-colors ${
                                    chat.id === activeChatId ? 'bg-surface-hover text-text-strong font-semibold' : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                                }`}
                            >
                                {chat.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

// --- HEADER SWITCHER ---
const HeaderSwitcher: React.FC<{ selectedAgent: 'general' | 'cortex'; onSelect: (agent: 'general' | 'cortex') => void }> = ({ selectedAgent, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const agents = [
        { id: 'general', name: 'General Assistant', icon: IconMessageSquare, color: 'text-text-primary' },
        { id: 'cortex', name: 'Cortex Optimizer', icon: IconSparkles, color: 'text-[#6A38EB]', tooltip: 'Uses Snowflake native LLMs for deep SQL refactoring.' }
    ];

    const currentAgent = agents.find(a => a.id === selectedAgent) || agents[0];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-hover transition-colors"
            >
                <span className="text-lg font-bold text-text-strong">Ask APEX</span>
                <IconChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-surface border border-border-color rounded-xl shadow-xl z-50 overflow-hidden py-1">
                    {agents.map(agent => (
                        <button
                            key={agent.id}
                            onClick={() => {
                                onSelect(agent.id as any);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-surface-hover transition-colors group ${selectedAgent === agent.id ? 'bg-surface-nested' : ''}`}
                        >
                            <div className={`mt-0.5 ${agent.color}`}>
                                <agent.icon className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col items-start text-left">
                                <span className={`text-sm font-semibold ${selectedAgent === agent.id ? 'text-primary' : 'text-text-primary'}`}>
                                    {agent.name}
                                </span>
                                {agent.tooltip && (
                                    <span className="text-xs text-text-muted leading-tight mt-0.5">
                                        {agent.tooltip}
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- RICH MESSAGE COMPONENTS ---
const CodeBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };
    
    const highlightedCode = useMemo(() => {
        const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'GROUP BY', 'ORDER BY', 'LIMIT', 'AS', 'ON', 'WITH', 'INSERT', 'INTO', 'VALUES', 'CREATE', 'TABLE', 'WAREHOUSE', 'ALTER', 'DROP', 'UPDATE', 'DELETE'];
        const pattern = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
        return code.replace(pattern, '<span class="text-[#A78BFA] font-bold">$1</span>');
    }, [code]);

    return (
        <div className="bg-[#1E1E1E] rounded-xl my-4 overflow-hidden border border-white/10 shadow-lg">
            <div className="flex justify-between items-center px-4 py-2 bg-white/5 border-b border-white/10">
                <span className="text-xs font-mono font-medium text-white/50 uppercase tracking-wider">{language || 'sql'}</span>
                <div className="flex items-center gap-3">
                    <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors">
                        {isCopied ? <IconCheck className="w-3.5 h-3.5 text-status-success"/> : <IconClipboardCopy className="w-3.5 h-3.5" />}
                        {isCopied ? 'Copied' : 'Copy'}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors">
                        <IconExternalLink className="w-3.5 h-3.5" />
                        Open in Snowflake
                    </button>
                </div>
            </div>
            <pre className="p-5 text-sm font-mono text-[#D4D4D4] overflow-x-auto leading-relaxed">
                <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
            </pre>
        </div>
    );
};

const RecommendedActionCard: React.FC<{
    recId: string;
    recTitle: string;
    affectedResource: string;
    accountName: string;
    severity: string;
    savings: string;
    userContext: string;
    onPromptClick: (prompt: string) => void;
    onNavigate?: (page: string) => void;
}> = ({ recId, recTitle, affectedResource, accountName, severity, savings, userContext, onPromptClick, onNavigate }) => {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-rose-200 dark:border-rose-900 shadow-[0_4px_16px_rgba(244,63,94,0.06)] p-4 max-w-2xl mt-4 select-none">
            <div className="bg-[#FFF8F8] dark:bg-[#1A1012] p-4 rounded-xl border border-rose-100 dark:border-rose-950 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:shadow-xs">
                <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-900 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-black">
                            Query Anomaly
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold font-mono">
                            ID: {recId}
                        </span>
                    </div>
                    <h3 className="font-extrabold text-[#111827] dark:text-[#F3F4F6] text-xs leading-snug">
                        Query q-9482115 (scanning 1.2TB of data due to lack of pruning)
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        Affected: <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono text-[10px]">{affectedResource}</span> • Est. Savings: <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">${parseInt(savings).toLocaleString()}/mo</span>
                    </p>
                </div>
                
                <button
                    onClick={() => {
                        onPromptClick(`[diagnostic-wizard-flow:${recId}|${recTitle}|${affectedResource}|${accountName}|${severity}|${savings}|${userContext}]`);
                    }}
                    className="w-full md:w-auto shrink-0 flex items-center justify-center gap-1 bg-rose-600 hover:bg-rose-700 text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs active:scale-[0.98] select-none"
                >
                    <span>Start diagnosis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3 text-xs border-t border-dashed border-slate-100 dark:border-zinc-800">
                <span className="text-slate-400 font-semibold text-[11px]">
                    Or return to the Enforcement Desk to see all active alerts.
                </span>
                <button
                    onClick={() => {
                        if (onNavigate) {
                            onNavigate('Enforcement Desk');
                        } else {
                            window.dispatchEvent(new CustomEvent('navigate-to-page', { detail: 'Enforcement Desk' }));
                        }
                    }}
                    className="inline-flex items-center gap-1.5 bg-[#1E293B] dark:bg-zinc-800 hover:bg-slate-800 text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs active:scale-[0.98]"
                >
                    <span>Back to desk</span>
                    <IconExternalLink className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
};

const FormattedContent: React.FC<{ text: string, onPromptClick: (prompt: string) => void, onNavigate?: (page: string) => void }> = ({ text, onPromptClick, onNavigate }) => {
    const parts = text.split(/(\`\`\`[\s\S]*?\`\`\`|\[.*?\])/g).filter(Boolean);

    const applySentenceCase = (str: string) => {
        return str.replace(/(^\w|\.\s+\w)/g, letter => letter.toUpperCase());
    };

    return (
        <div className="prose max-w-none text-text-primary text-[13px] leading-[1.5] prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-p:whitespace-pre-wrap font-normal">
            {parts.map((part, index) => {
                const codeBlockMatch = part.match(/\`\`\`(\w+)?\n([\s\S]*?)\`\`\`/);
                if (codeBlockMatch) {
                    const language = codeBlockMatch[1] || '';
                    const code = codeBlockMatch[2] || '';
                    
                    if(language === 'chart') {
                        try {
                            const chartData = JSON.parse(code);
                            if(chartData.type === 'bar') {
                                return (
                                    <div key={index} className="my-6 p-4 bg-surface-nested rounded-xl border border-border-color shadow-sm">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="text-sm font-semibold text-text-strong">Data Visualization</h4>
                                            <button className="flex items-center gap-1.5 text-xs text-primary hover:underline font-medium">
                                                <IconPin className="w-3.5 h-3.5" />
                                                Pin to Dashboard
                                            </button>
                                        </div>
                                        <div style={{height: 220}}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={chartData.data}>
                                                    <XAxis dataKey="name" fontSize={11} stroke="var(--color-text-muted)" />
                                                    <YAxis fontSize={11} stroke="var(--color-text-muted)" />
                                                    <Tooltip 
                                                        contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border-color)', borderRadius: '8px' }}
                                                        itemStyle={{ fontSize: '12px' }}
                                                    />
                                                    <Bar dataKey="value" fill="#6A38EB" radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                );
                            }
                        } catch (e) { /* ignore parse error */ }
                    }
                    
                    return <CodeBlock key={index} language={language} code={code} />;
                }
                
                const buttonMatch = part.match(/\[(.*?)\]/);
                if (buttonMatch) {
                    const buttonText = buttonMatch[1];
                    if (buttonText === 'decision-support') {
                        return <DecisionSupportFlow key={index} />;
                    }
                    if (buttonText.startsWith('intelligence-decision-card:')) {
                        const [, name, policyType] = buttonText.split(':');
                        return <IntelligenceDecisionCard key={index} name={name} policyType={policyType} />;
                    }
                    if (buttonText.startsWith('governance-optimization-flow:')) {
                        const [, accountName, budget, admin, warehouse, idle] = buttonText.split(':');
                        return (
                            <GovernanceOptimizationFlow 
                                key={index} 
                                accountName={accountName} 
                                requestedBudget={parseInt(budget)} 
                                leadAdmin={admin} 
                                inefficientWarehouse={warehouse} 
                                idleTimePercent={parseInt(idle)} 
                            />
                        );
                    }
                    if (buttonText.startsWith('agentic-response:')) {
                        const payload = buttonText.substring('agentic-response:'.length);
                        const [account, why, resource, owner, question, policy] = payload.split('|');
                        return (
                            <AgenticResponse 
                                key={index}
                                accountName={account || ''}
                                why={why || ''}
                                resource={resource || ''}
                                ownerName={owner || ''}
                                actionQuestion={question || ''}
                                policyType={policy || ''}
                            />
                        );
                    }
                    if (buttonText.startsWith('diagnostic-wizard-flow-recommend-card:')) {
                        const parts = buttonText.substring('diagnostic-wizard-flow-recommend-card:'.length).split('|');
                        const [recId, recTitle, affectedResource, accountName, severity, savings, userContext] = parts;
                        return (
                            <RecommendedActionCard
                                key={index}
                                recId={recId}
                                recTitle={recTitle}
                                affectedResource={affectedResource}
                                accountName={accountName}
                                severity={severity}
                                savings={savings}
                                userContext={userContext}
                                onPromptClick={onPromptClick}
                                onNavigate={onNavigate}
                            />
                        );
                    }
                    if (buttonText.startsWith('diagnostic-wizard-flow:')) {
                        const parts = buttonText.substring('diagnostic-wizard-flow:'.length).split('|');
                        const [recId, recTitle, affectedResource, accountName, severity, savings, userContext] = parts;
                        return (
                            <DiagnosticWizardFlow
                                key={index}
                                recId={recId}
                                recTitle={recTitle}
                                affectedResource={affectedResource}
                                accountName={accountName}
                                severity={severity}
                                savings={savings}
                                userContext={userContext}
                                onNavigate={onNavigate}
                            />
                        );
                    }
                    return <button key={index} onClick={() => onPromptClick(buttonText)} className="my-2 bg-primary/10 text-primary font-semibold px-4 py-1.5 rounded-full text-sm hover:bg-primary/20 transition-colors">{buttonText}</button>
                }

                const boldAndListFormatted = part
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\`(.*?)\`/g, '<code class="font-mono text-[0.825rem] bg-[#F1EDF9] dark:bg-zinc-800 border border-border-color text-primary font-semibold px-1.5 py-0.5 rounded-md mx-0.5 select-all">$1</code>')
                    .replace(/^\* (.*$)/gm, '<ul><li>$1</li></ul>')
                    .replace(/<\/ul><ul>/g, '') // merge lists
                    .replace(/<h[1-6]>(.*?)<\/h[1-6]>/g, (match, content) => {
                        return `<h3>${applySentenceCase(content)}</h3>`;
                    });

                return <span key={index} dangerouslySetInnerHTML={{ __html: boldAndListFormatted }} />;
            })}
        </div>
    );
};

const StructuredResponse: React.FC<{ text: string, onPromptClick: (prompt: string) => void, onNavigate?: (page: string) => void }> = ({ text, onPromptClick, onNavigate }) => {
    const sections = text.split('---').map(s => s.trim()).filter(Boolean);
    const introText = sections.length > 1 && !sections[0].startsWith('**') ? sections.shift() : null;

    return (
        <div className="space-y-4">
            {introText && <p className="prose max-w-none text-text-primary text-[13px] leading-[1.5] font-normal">{introText}</p>}
            {sections.map((section, index) => (
                <div key={index} className="space-y-4">
                    <FormattedContent text={section} onPromptClick={onPromptClick} onNavigate={onNavigate} />
                </div>
            ))}
        </div>
    );
};


const ChatMessage: React.FC<{ message: Message, onPromptClick: (prompt: string) => void, onNavigate?: (page: string) => void }> = ({ message, onPromptClick, onNavigate }) => {
    const isModel = message.role === 'model';
    const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

    // If it's a model response but there's no text, don't render it yet to prevent empty placeholders
    if (isModel && !message.text.trim()) {
        return null;
    }

    // Split model response into multiple bubbles if delimiter is present, ignoring empty ones
    const bubbles = isModel 
        ? message.text.split('---').map(b => b.trim()).filter(Boolean) 
        : [message.text];

    // If there are no non-empty bubbles to show, render nothing
    if (bubbles.length === 0) {
        return null;
    }

    return (
        <div className={`flex items-start gap-4 ${!isModel ? 'justify-end' : 'justify-start'}`}>
            {isModel && (
                 <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-surface shadow-xs border border-border-color mt-1 p-1">
                     <IconAIAgent className="w-5 h-5" />
                 </div>
            )}

            <div className={`flex flex-col gap-2 max-w-[80%] ${!isModel ? 'items-end' : 'items-start'}`}>
                {isModel && (
                    <div className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-0.5 flex items-center gap-1.5 select-none">
                        <span className="text-primary font-bold">APEX</span>
                        <span className="opacity-40">•</span>
                        <span>{message.timestamp}</span>
                    </div>
                )}

                {bubbles.map((bubbleText, bIdx) => (
                    <motion.div 
                        key={bIdx} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className={`relative transition-all duration-300 ${
                            isModel 
                            ? 'bg-transparent border-none p-0 shadow-none text-text-primary' 
                            : 'bg-gradient-to-br from-[#6932D5] to-[#7163C6] text-white rounded-[24px] rounded-tr-[4px] px-5 py-4 shadow-sm border border-[#6932D5]/20'
                        }`}
                    >
                        {isModel ? (
                            <StructuredResponse text={bubbleText.trim()} onPromptClick={onPromptClick} onNavigate={onNavigate} />
                        ) : (
                            <p className="whitespace-pre-wrap text-[13px] leading-[1.5] select-text font-normal">{bubbleText}</p>
                        )}
                    </motion.div>
                ))}

                {/* Minimal, elegant action menu for User messages */}
                {!isModel && (
                    <div className="mt-1 flex items-center gap-1 opacity-0 hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => navigator.clipboard.writeText(message.text)} 
                            className="p-1 rounded text-text-muted hover:text-primary transition-colors" 
                            title="Copy message"
                        >
                            <Copy className="w-3 h-3" />
                        </button>
                    </div>
                )}

                {/* Multi-feature action buttons row below Model messages - Matches screenshot exactly */}
                {isModel && (
                     <div className="mt-2.5 flex items-center gap-2">
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(message.text);
                            }} 
                            className="p-1.5 rounded-lg text-text-muted hover:bg-surface-hover hover:text-text-strong transition-all border border-transparent hover:border-border-color" 
                            title="Copy response"
                        >
                            <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button 
                            onClick={() => setFeedback('up')} 
                            className={`p-1.5 rounded-lg hover:bg-surface-hover transition-all border border-transparent hover:border-border-color ${feedback === 'up' ? 'text-primary' : 'text-text-muted'}`}
                            title="Good response"
                        >
                            <ThumbsUp className={`w-3.5 h-3.5 ${feedback === 'up' ? 'fill-primary/20' : ''}`} />
                        </button>

                        <button 
                            onClick={() => setFeedback('down')} 
                            className={`p-1.5 rounded-lg hover:bg-surface-hover transition-all border border-transparent hover:border-border-color ${feedback === 'down' ? 'text-primary' : 'text-text-muted'}`}
                            title="Bad response"
                        >
                            <ThumbsDown className={`w-3.5 h-3.5 ${feedback === 'down' ? 'fill-primary/20' : ''}`} />
                        </button>

                        <button 
                            className="p-1.5 rounded-lg text-text-muted hover:bg-surface-hover hover:text-text-strong transition-all border border-transparent hover:border-border-color" 
                            title="Share"
                        >
                            <Share className="w-3.5 h-3.5" />
                        </button>

                        <button 
                            onClick={() => onPromptClick(message.text)}
                            className="p-1.5 rounded-lg text-text-muted hover:bg-surface-hover hover:text-text-strong transition-all border border-transparent hover:border-border-color" 
                            title="Regenerate"
                        >
                            <RotateCw className="w-3.5 h-3.5" />
                        </button>

                        <button 
                            className="p-1.5 rounded-lg text-text-muted hover:bg-surface-hover hover:text-text-strong transition-all border border-transparent hover:border-border-color" 
                            title="More options"
                        >
                            <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- INITIAL PROMPTS VIEW ---
const initialPromptsData = [
    {
        category: 'ENFORCEMENT',
        title: 'Audit Accountability',
        description: "Identify the owner of last night's credit spike and route it to the Enforcement Desk.",
        prompt: "Identify the owner of last night's credit spike and route it to the Enforcement Desk.",
        icon: Shield,
        badgeColor: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300 border-red-100 dark:border-red-900',
    },
    {
        category: 'INTELLIGENCE',
        title: 'Cortex Workload Analysis',
        description: 'Predict AI token consumption and credit impact for your next LLM deployment.',
        prompt: 'Predict AI token consumption and credit impact for my next LLM deployment using Cortex Workload Analysis.',
        icon: TrendingUp,
        badgeColor: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-300 border-purple-100 dark:border-purple-900',
    },
    {
        category: 'COST ANALYSIS',
        title: 'Storage Intelligence',
        description: 'Detect unused time-travel snapshots and unoptimized tables to reduce bloat.',
        prompt: 'Detect unused time-travel snapshots and unoptimized tables to reduce bloat using Storage Intelligence.',
        icon: BarChart3,
        badgeColor: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300 border-amber-100 dark:border-amber-900',
    },
    {
        category: 'OPTIMIZATION',
        title: 'Warehouse Right-Sizing',
        description: 'Analyze concurrency patterns to identify over-provisioned or idle warehouses.',
        prompt: 'Analyze concurrency patterns to identify over-provisioned or idle warehouses.',
        icon: Zap,
        badgeColor: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900',
    }
];

const glowColorMap: Record<string, string> = {
    'ENFORCEMENT': 'rgba(106, 56, 235, 0.08)',
    'INTELLIGENCE': 'rgba(106, 56, 235, 0.08)',
    'COST ANALYSIS': 'rgba(106, 56, 235, 0.08)',
    'OPTIMIZATION': 'rgba(106, 56, 235, 0.08)',
};

const borderHoverColorMap: Record<string, string> = {
    'ENFORCEMENT': 'hover:border-purple-500/40 hover:shadow-[0_8px_30px_rgba(106, 56, 235, 0.06)]',
    'INTELLIGENCE': 'hover:border-purple-500/40 hover:shadow-[0_8px_30px_rgba(106, 56, 235, 0.06)]',
    'COST ANALYSIS': 'hover:border-purple-500/40 hover:shadow-[0_8px_30px_rgba(106, 56, 235, 0.06)]',
    'OPTIMIZATION': 'hover:border-purple-500/40 hover:shadow-[0_8px_30px_rgba(106, 56, 235, 0.06)]',
};

const iconColorMap: Record<string, string> = {
    'ENFORCEMENT': 'group-hover:text-purple-500',
    'INTELLIGENCE': 'group-hover:text-purple-500',
    'COST ANALYSIS': 'group-hover:text-purple-500',
    'OPTIMIZATION': 'group-hover:text-purple-500',
};

const PromptCard: React.FC<{
    category: string;
    title: string;
    description: string;
    prompt: string;
    icon: React.ComponentType<any>;
    badgeColor: string;
    onPromptClick: (prompt: string) => void;
}> = ({ category, title, description, prompt, icon: Icon, badgeColor, onPromptClick }) => {
    const [coords, setCoords] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setCoords({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const hoverGlowColor = glowColorMap[category] || 'rgba(105, 50, 213, 0.15)';
    const hoverBorderClass = borderHoverColorMap[category] || 'hover:border-primary/45 hover:shadow-[0_8px_30px_rgba(105,50,213,0.06)]';
    const hoverIconClass = iconColorMap[category] || 'group-hover:text-primary';

    return (
        <motion.button 
            onMouseMove={handleMouseMove}
            whileHover={{ 
                y: -3,
                transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPromptClick(prompt)} 
            className={`p-4 bg-surface rounded-xl border border-border-color/80 ${hoverBorderClass} transition-all duration-300 group flex flex-col justify-between h-full relative overflow-hidden shadow-xs text-left`}
        >
            {/* Enterprise Spotlight Cursor Tracker Overlay */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(240px circle at ${coords.x}px ${coords.y}px, ${hoverGlowColor}, transparent 80%)`,
                }}
            />
            
            {/* Fine line border highlight on hover */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 opacity-65 text-purple-500" />

            <div className="flex justify-between items-center w-full relative z-20 mb-2">
                <span className={`text-[8.5px] uppercase tracking-wider px-2 py-0.5 rounded-full font-extrabold border ${badgeColor}`}>
                    {category}
                </span>
                <Icon className={`w-3.5 h-3.5 text-text-muted group-hover:scale-105 ${hoverIconClass} transition-all duration-200`} />
            </div>
            
            <div className="mt-0.5 relative z-20">
                <h3 className="font-extrabold text-text-strong text-[13px] group-hover:text-text-primary transition-colors duration-200 leading-snug">
                    {title}
                </h3>
                <p className="text-[10.5px] text-text-secondary mt-0.5 leading-normal font-semibold opacity-80 group-hover:opacity-100 group-hover:text-text-primary transition-all duration-200">
                    {description}
                </p>
            </div>
        </motion.button>
    );
};

const InitialPrompts: React.FC<{ onPromptClick: (prompt: string) => void }> = ({ onPromptClick }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 16 } }
    };

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-start min-h-[75%] text-center pt-1 pb-4 md:pt-2 md:pb-5 px-4 max-w-2xl mx-auto w-full"
        >
            <div className="relative w-10 h-10 md:w-11 md:h-11 flex items-center justify-center mb-3">
                {/* Ambient breathing halo glow and interactive scale */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#6CA7FF]/20 to-[#5A07FF]/20 rounded-full blur-lg animate-[pulse_3s_infinite_ease-in-out]" />
                <motion.div 
                    variants={itemVariants}
                    whileHover={{ scale: 1.1, rotate: 12 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                    className="w-10 h-10 md:w-11 md:h-11 relative z-10 flex items-center justify-center cursor-pointer"
                >
                    <IconSparkles className="w-10 h-10 md:w-11 md:h-11 filter drop-shadow-[0_4px_12px_rgba(90,7,255,0.15)]" />
                </motion.div>
            </div>
            
            <motion.h2 
                variants={itemVariants}
                className="text-xl md:text-[25px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#6CA7FF] to-[#5A07FF] tracking-tight leading-[1.1] pb-1"
                style={{
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                How can I help you today?
            </motion.h2>
            
            <motion.p 
                variants={itemVariants}
                className="text-text-secondary mt-1.5 max-w-md text-[11px] md:text-xs font-semibold opacity-85 leading-relaxed"
            >
                Apex is ready to secure and optimize your Snowflake Data Cloud environment.
            </motion.p>
            
            <motion.div 
                variants={containerVariants}
                className="w-full mt-5 grid grid-cols-1 md:grid-cols-2 gap-2.5 text-left"
            >
                {initialPromptsData.map((p) => (
                    <PromptCard 
                        key={p.title}
                        category={p.category}
                        title={p.title}
                        description={p.description}
                        prompt={p.prompt}
                        icon={p.icon}
                        badgeColor={p.badgeColor}
                        onPromptClick={onPromptClick}
                    />
                ))}
            </motion.div>
        </motion.div>
    );
};

const SuggestionChips: React.FC<{ onChipClick: (text: string) => void }> = ({ onChipClick }) => {
    const chips = [
        { text: "Optimize compute clusters", icon: Zap },
        { text: "Summarize Cortex usage", icon: Brain },
        { text: "Check for PII violations", icon: Lock }
    ];

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            {chips.map((chip, idx) => {
                const Icon = chip.icon;
                return (
                    <motion.button
                        key={chip.text}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 + 0.3 }}
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onChipClick(chip.text)}
                        className="px-3.5 py-1.5 bg-surface border border-border-color rounded-full text-xs font-semibold text-text-secondary hover:bg-surface-hover hover:text-primary flex items-center gap-1.5 transition-all shadow-sm"
                    >
                        <Icon className="w-3.5 h-3.5 text-primary opacity-80" />
                        <span>{chip.text}</span>
                    </motion.button>
                );
            })}
        </div>
    );
};


// --- MAIN COMPONENT ---
const AIAgent: React.FC<AIAgentProps> = ({ onNavigate }) => {
    const [chats, setChats] = useState<ChatSession[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedAgent, setSelectedAgent] = useState<'general' | 'cortex'>('general');
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    
    // Dynamic stepper layout integration state
    const [activeStepSequence, setActiveStepSequence] = useState<any | null>(null);
    const [lastClosedStepSequence, setLastClosedStepSequence] = useState<any | null>(null);
    const [isStepperQueryExpanded, setIsStepperQueryExpanded] = useState<boolean>(false);
    const [isStepperCopied, setIsStepperCopied] = useState<boolean>(false);
    const [isResponsiveSqueezed, setIsResponsiveSqueezed] = useState<boolean>(false);

    // Track dynamic screen layout constraints
    useEffect(() => {
        const handleResize = () => {
            setIsResponsiveSqueezed(window.innerWidth < 1200);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Automatically mutual-exclude/toggle sidebars when screen is squeezed to prevent overlapping/cramping
    useEffect(() => {
        if (isResponsiveSqueezed) {
            if (activeStepSequence && showHistory) {
                setLastClosedStepSequence(activeStepSequence);
                setActiveStepSequence(null);
            }
        }
    }, [showHistory, isResponsiveSqueezed]);

    useEffect(() => {
        if (isResponsiveSqueezed) {
            if (activeStepSequence && showHistory) {
                setShowHistory(false);
            }
        }
    }, [activeStepSequence, isResponsiveSqueezed]);
    
    const chatScrollContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Handle deep linked navigation from custom window events
    useEffect(() => {
        const handleNavigation = (e: Event) => {
            const page = (e as CustomEvent).detail;
            if (onNavigate) {
                onNavigate(page);
            }
        };
        window.addEventListener('navigate-to-page', handleNavigation);
        return () => {
            window.removeEventListener('navigate-to-page', handleNavigation);
        };
    }, [onNavigate]);

    // Listen to custom window events triggered from within DiagnosticWizardFlow
    useEffect(() => {
        const handleActive = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            const rec = recommendationsData.find(r => r.id === detail.recId);
            const queryText = rec?.metrics?.queryText || (detail.recTitle?.toLowerCase().includes('query') || detail.recId?.toLowerCase().includes('rec-spec') ? `SELECT * FROM ${detail.affectedResource || 'FACT_SALES'} WHERE EVENT_DATE >= '2023-01-01';` : undefined);
            setActiveStepSequence({
                ...detail,
                queryText
            });
            setLastClosedStepSequence(null);
        };

        const handleStep = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            setActiveStepSequence((prev: any) => prev ? { ...prev, currentStep: detail.currentStep } : null);
            
            // Seamlessly scroll the chat scroll area to keep the newly revealed process section in view
            setTimeout(() => {
                if (chatScrollContainerRef.current) {
                    chatScrollContainerRef.current.scrollTo({
                        top: chatScrollContainerRef.current.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            }, 150);
            setTimeout(() => {
                if (chatScrollContainerRef.current) {
                    chatScrollContainerRef.current.scrollTo({
                        top: chatScrollContainerRef.current.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            }, 450);
        };

        const handleInactive = () => {
            setActiveStepSequence(null);
        };

        window.addEventListener('apex-diagnostic-active', handleActive);
        window.addEventListener('apex-diagnostic-step', handleStep);
        window.addEventListener('apex-diagnostic-inactive', handleInactive);

        return () => {
            window.removeEventListener('apex-diagnostic-active', handleActive);
            window.removeEventListener('apex-diagnostic-step', handleStep);
            window.removeEventListener('apex-diagnostic-inactive', handleInactive);
        };
    }, []);

    // Listen to diagnostic completion to prompt Apex's follow-up message with the recommended action card
    useEffect(() => {
        const handleCompleted = () => {
            if (!activeChatId) return;
            setChats(prev => prev.map(c => {
                if (c.id === activeChatId) {
                    // Avoid duplicate messages
                    const hasCompletedMsg = c.messages.some(m => m.text.includes("diagnostic-wizard-flow-recommend-card"));
                    if (hasCompletedMsg) return c;

                    const followUpMessage: Message = {
                        role: 'model',
                        text: "Fantastic work! The diagnostic and GitHub pull request routing for **REC-SPEC-006** have successfully completed. Credit simulator checks confirm a **-71% reduction in warehouse costs**.\n\nSince this is solved, we have another high-priority query anomaly that needs active optimization to prevent cost leakages. Below is the recommended next action: ---\n\n[diagnostic-wizard-flow-recommend-card:REC-SPEC-005|CUSTOMER_ACTIVITY Full Table Scan|CUSTOMER_ACTIVITY|Account B|High|10200|mike_de]",
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };

                    return {
                        ...c,
                        messages: [...c.messages, followUpMessage]
                    };
                }
                return c;
            }));

            // Seamless auto-scroll
            setTimeout(() => {
                if (chatScrollContainerRef.current) {
                    chatScrollContainerRef.current.scrollTo({
                        top: chatScrollContainerRef.current.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            }, 250);
        };

        window.addEventListener('apex-diagnostic-completed', handleCompleted);
        return () => {
            window.removeEventListener('apex-diagnostic-completed', handleCompleted);
        };
    }, [activeChatId]);

    // Initialize with a single new chat on mount
    useEffect(() => {
        handleNewChat();
    }, []);

    // Handle deep-linked actions from AI Directives or Enforcement Desk
    useEffect(() => {
        const pendingPrompt = localStorage.getItem('apex_initial_chat_prompt');
        if (pendingPrompt && activeChatId) {
            const hasChat = chats.some(c => c.id === activeChatId);
            if (hasChat) {
                localStorage.removeItem('apex_initial_chat_prompt');
                handleSendMessage(undefined, pendingPrompt);
            }
        }
    }, [activeChatId, chats]);

    // Scroll to bottom helper
    const handleScrollToBottom = () => {
        if (chatScrollContainerRef.current) {
            chatScrollContainerRef.current.scrollTo({
                top: chatScrollContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    const handleReopenStepper = () => {
        if (lastClosedStepSequence) {
            setActiveStepSequence(lastClosedStepSequence);
            setLastClosedStepSequence(null);
        }
    };

    // Scroll event listener to auto-hide/show the bottom float anchor
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const isNearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 160;
        setShowScrollButton(!isNearBottom);
    };

    // Scroll to bottom effect on new triggers
    useEffect(() => {
        if (chats.length > 0 && activeChatId) {
            const currentChat = chats.find(c => c.id === activeChatId);
            if (currentChat && currentChat.messages.length > 1) {
                handleScrollToBottom();
            } else if (chatScrollContainerRef.current) {
                chatScrollContainerRef.current.scrollTop = 0;
            }
        }
    }, [chats, isLoading, activeChatId]);
    
    // Auto-resize textarea effect
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    const handleNewChat = () => {
        const newChat: ChatSession = {
            id: `chat-${Date.now()}`,
            title: 'New Chat',
            messages: [{ 
                role: 'model', 
                text: 'Hello! I am APEX. How can I help you analyze your data cloud today?',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})
            }],
        };
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newChat.id);
    };
    
    const submitPrompt = (prompt: string) => {
        setInput(prompt);
        // We need to wait for the state to update, so we use a small timeout before submitting the form
        setTimeout(() => {
            textareaRef.current?.form?.requestSubmit();
        }, 0);
    };

    const handleSendMessage = async (e?: FormEvent, overrideText?: string) => {
        if (e) e.preventDefault();
        const messageText = overrideText !== undefined ? overrideText.trim() : input.trim();
        if (!messageText || isLoading || !activeChatId) return;

        const activeChat = chats.find(c => c.id === activeChatId);
        if(!activeChat) return;

        const userMessage: Message = { 
            role: 'user', 
            text: messageText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})
        };
        
        // Update chat title if it's a new chat
        const isNewChat = activeChat.messages.length <= 1;
        const newTitle = isNewChat ? (messageText.length > 30 ? `${messageText.substring(0, 27)}...` : messageText) : activeChat.title;

        // Immediately add both user message and an empty placeholder model message
        const placeholderModelMessage: Message = {
            role: 'model',
            text: '',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})
        };

        setChats(prev => prev.map(c => c.id === activeChatId ? {
            ...c, 
            title: newTitle, 
            messages: [...c.messages, userMessage, placeholderModelMessage]
        } : c));
        
        if (overrideText === undefined) {
            setInput('');
        }
        setIsLoading(true);
        setError(null);
        
        try {
            // ALWAYS initialize GoogleGenAI with named apiKey parameter from process.env.API_KEY or process.env.GEMINI_API_KEY
            const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
            const ai = new GoogleGenAI({ apiKey });
            
            // Prepare history, excluding the initial welcome message and the newly added empty placeholder
            const history = activeChat.messages.slice(1).map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            } as Content));

            const isMockQuery1 = messageText.toLowerCase().includes('chart of warehouse costs');
            const isMockQuery2 = messageText.toLowerCase().includes('analyze account a cost drivers');
            const isMockQuery3 = messageText.toLowerCase().includes('set a monthly budget of $5,000');
            const isDiagnosticWizard = messageText.startsWith('[diagnostic-wizard-flow:');

            if (isMockQuery1 || isMockQuery2 || isMockQuery3 || isDiagnosticWizard) {
                // Determine mock query answer
                let responseText = "";
                if (isDiagnosticWizard) {
                    responseText = "I've detected a query optimization request. Let's initiate the dynamic diagnostic sequence for this item: --- \n\n" + messageText;
                } else if(isMockQuery1) {
                    responseText = "Here is the active warehouse cost distribution for this billing period: --- Let me fetch a live visualization of these resource allocation areas. \n\n```chart\n{\"type\":\"bar\",\"data\":[{\"name\":\"Compute\",\"value\":850},{\"name\":\"Transform\",\"value\":250},{\"name\":\"BI\",\"value\":125},{\"name\":\"Finance\",\"value\":1200}]}\n```";
                } else if(isMockQuery2) {
                    responseText = "I've analyzed the recent activity on **Account A**. --- It looks like the `FINTECH_WAREHOUSE` is driving 92% of your costs due to some heavy recursive joins. Alex Rivera seems to be the one running these workloads. --- Should I have Alex look into this and draft an auto-suspend policy to keep things under control?\n\n[agentic-response:Account A|The warehouse is significantly oversized for your actual query load, resulting in ~$1,200/month of wasted credits.|FINTECH_WAREHOUSE|Alex Rivera|Shall I assign an optimization task to Alex Rivera?|Draft Policy]";
                } else {
                    responseText = "Alright, I've initialized a $5,000 monthly guardrail for **Account A**. ✅ --- Just so you know, based on current velocity, I predict you'll hit $5,900 this month. Most of that is 'Vampire Burn' on `FINTECH_WH`. --- Should I have Alex Rivera look into a 60s auto-suspend policy to save you that $900?\n\n[agentic-response:Account A|The warehouse is significantly oversized for your actual query load, resulting in ~$1,200/month of wasted credits.|FINTECH_WH|Alex Rivera|Assign to Alex Rivera to implement the 60s auto-suspend policy?|Draft Policy]";
                }

                setIsLoading(false); // Hide the dots container since typewriter starts typing
                
                const words = responseText.split(' ');
                let currentText = "";
                for (let i = 0; i < words.length; i++) {
                    currentText += (i === 0 ? "" : " ") + words[i];
                    // Using standard primitive string state update to trigger minimal re-renders
                    const t = currentText;
                    setChats(prev => prev.map(c => {
                        if (c.id === activeChatId) {
                            const updatedMessages = [...c.messages];
                            if (updatedMessages.length > 0) {
                                updatedMessages[updatedMessages.length - 1] = {
                                    ...updatedMessages[updatedMessages.length - 1],
                                    text: t
                                };
                            }
                            return { ...c, messages: updatedMessages };
                        }
                        return c;
                    }));
                    
                    // High-quality fast styling animation loop
                    await new Promise(resolve => setTimeout(resolve, 7));
                }
            } else {
                // Real Gemini Chat with streaming support that begins delivering response instantly!
                const chatInstance = ai.chats.create({ 
                    model: 'gemini-3.5-flash', 
                    history,
                    config: {
                        systemInstruction: `
Act as "Apex." You are a highly skilled technical partner for data cloud management.

### RULES FOR CONVERSATION:
1. BREVITY: Keep messages short. Use 2 or 3 bubbles instead of one long one. Separate bubbles with '---' on a new line.
2. NATURAL LANGUAGE: Do not use headers like "THE WHY" or "THE WHO". Speak like a human: "I've noticed..." or "It looks like...".
3. ACKNOWLEDGE FIRST: Always confirm the user's request immediately ("Budget set!") before giving extra advice.
4. PROACTIVE ADVICE: Your "Agentic" value is finding the problem the user didn't ask about. 
5. INTERACTIVE PROPOSALS: When suggesting an action, use the Proposal Card tag: [agentic-response:Account|Why|Resource|OwnerName|ActionQuestion|PolicyType]
   - Use '|' as a separator inside the tag.
   - Example: [agentic-response:Account A|The warehouse is significantly oversized for your actual query load, resulting in ~$1,200/month of wasted credits.|REPORTING_WH|Sam Lee|Assign to Sam Lee?|Draft Policy]
`
                    }
                });

                const responseStream = await chatInstance.sendMessageStream({ message: messageText });
                let accumulatedText = "";
                
                for await (const chunk of responseStream) {
                    const chunkText = chunk.text;
                    if (chunkText) {
                        setIsLoading(false); // Hide the dots container since stream is flowing live
                        accumulatedText += chunkText;
                        
                        setChats(prev => prev.map(c => {
                            if (c.id === activeChatId) {
                                const updatedMessages = [...c.messages];
                                if (updatedMessages.length > 0) {
                                    updatedMessages[updatedMessages.length - 1] = {
                                        ...updatedMessages[updatedMessages.length - 1],
                                        text: accumulatedText
                                    };
                                }
                                return { ...c, messages: updatedMessages };
                            }
                            return c;
                        }));
                    }
                }
            }

        } catch (e) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            const errorText = `Sorry, I encountered an error: ${errorMessage}`;
            setChats(prev => prev.map(c => {
                if (c.id === activeChatId) {
                    const updatedMessages = [...c.messages];
                    if (updatedMessages.length > 0) {
                        updatedMessages[updatedMessages.length - 1] = {
                            role: 'model',
                            text: errorText,
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})
                        };
                    }
                    return { ...c, messages: updatedMessages };
                }
                return c;
            }));
            setError('There was an issue communicating with the AI. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const activeChat = chats.find(c => c.id === activeChatId);

    return (
        <div className="flex h-full bg-background text-text-primary">
            {showHistory && (
                <ChatHistorySidebar
                    chats={chats}
                    activeChatId={activeChatId}
                    onSelectChat={(id) => setActiveChatId(id)}
                    onNewChat={handleNewChat}
                />
            )}
            <main className="flex-1 flex flex-col bg-background overflow-hidden relative">

                {/* Floating restore button at top-right corner to reopen stepper */}
                {lastClosedStepSequence && !activeStepSequence && (
                    <div className="absolute top-4 right-4 z-40">
                        <button
                            onClick={handleReopenStepper}
                            className="bg-surface hover:bg-surface-hover hover:border-primary/45 hover:scale-105 active:scale-95 transition-all text-primary rounded-full shadow-lg border border-border-color p-3 flex items-center justify-center cursor-pointer"
                            title="Show Live Diagnostic Steps"
                        >
                            <PanelRightOpen className="w-5 h-5 text-primary" />
                        </button>
                    </div>
                )}

                <div 
                    ref={chatScrollContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth chat-custom-scroll"
                >
                    <AnimatePresence mode="wait">
                        {activeChat && activeChat.messages.length > 1 ? (
                            <motion.div 
                                key="chat-messages"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                className="max-w-2xl mx-auto space-y-8 pb-4"
                            >
                                {activeChat.messages.map((msg, index) => (
                                    <ChatMessage key={index} message={msg} onPromptClick={submitPrompt} onNavigate={onNavigate} />
                                ))}
                                {isLoading && (
                                    <div className="flex items-start gap-4">
                                        <div className="relative w-9 h-9 flex-shrink-0 select-none mt-1">
                                            {/* Outer Spinner Track */}
                                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="60" cy="60" r="52" fill="transparent" stroke="currentColor" strokeOpacity={0.06} strokeWidth={1.5} />
                                            </svg>
                                            {/* Spinning Glowing Arc with multi-color stroke */}
                                            <svg className="absolute inset-0 w-full h-full animate-spin" style={{ animationDuration: '1s' }} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                                                <defs>
                                                    <linearGradient id="mini-arc-loader" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" stopColor="#6932D5" />
                                                        <stop offset="50%" stopColor="#9061F9" />
                                                        <stop offset="100%" stopColor="#3B82F6" />
                                                    </linearGradient>
                                                </defs>
                                                <circle cx="60" cy="60" r="52" fill="none"
                                                    stroke="url(#mini-arc-loader)"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeDasharray="160 140"
                                                />
                                            </svg>
                                            {/* Centered Apex AI Icon - explicitly non-pulsing and scaled exactly to match completed avatar */}
                                            <div className="absolute inset-0 flex items-center justify-center p-1">
                                                <IconAIAgent className="w-5 h-5 text-primary" />
                                            </div>
                                        </div>
 
                                        <div className="flex flex-col justify-start">
                                            <div className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5 select-none pt-0.5">
                                                <span className="text-primary font-bold">APEX</span>
                                                <span className="opacity-40">•</span>
                                                <span className="text-[9.5px]">Thinking...</span>
                                            </div>
                                            <div className="mt-1 flex items-center gap-1">
                                                <span className="text-xs text-text-muted/80 font-medium">Formulating response</span>
                                                <span className="flex gap-1 items-center pb-0.5 ml-1">
                                                    <span className="h-1 w-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                    <span className="h-1 w-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                    <span className="h-1 w-1 bg-primary rounded-full animate-bounce"></span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="initial-prompts"
                                initial={{ opacity: 0, y: -15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 15 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <InitialPrompts onPromptClick={submitPrompt} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Floating "Scroll Down" Helper Button - Matches enterprise grade UX */}
                <AnimatePresence>
                    {showScrollButton && activeChat && activeChat.messages.length > 1 && (
                        <motion.button
                            type="button"
                            initial={{ opacity: 0, scale: 0.85, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.85, y: 10 }}
                            onClick={handleScrollToBottom}
                            className="absolute bottom-40 left-1/2 -translate-x-1/2 p-3 bg-surface hover:bg-surface-hover text-text-strong rounded-full shadow-lg border border-border-color hover:border-primary/40 focus:outline-none transition-colors z-30 flex items-center justify-center active:scale-95 group"
                            title="Scroll to bottom"
                        >
                            <ArrowDown className="w-4.5 h-4.5 text-text-muted group-hover:text-primary transition-colors" />
                        </motion.button>
                    )}
                </AnimatePresence>

                <div className="p-4 md:p-6 flex-shrink-0 bg-gradient-to-t from-background via-background to-background/0 relative z-20">
                    <div className="max-w-2xl mx-auto">
                        {!(activeChat && activeChat.messages.length > 1) && !activeStepSequence && <SuggestionChips onChipClick={submitPrompt} />}
                        
                        {/* Redesigned luxurious chat Input Area styled in complete consistency with Anavsan's design */}
                        <form onSubmit={handleSendMessage} className="relative bg-surface p-2 rounded-[28px] border border-border-color shadow-sm hover:border-primary/30 focus-within:border-primary/50 focus-within:bg-surface focus-within:shadow-md transition-all duration-300 flex items-center gap-3">
                            <div className="flex items-center gap-1 flex-shrink-0">
                                <button 
                                    type="button" 
                                    className="p-2 ml-1 rounded-full hover:bg-surface-hover text-text-muted hover:text-primary transition-colors flex-shrink-0 flex items-center justify-center" 
                                    title="Add layout or assets"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleNewChat}
                                    className="p-2 rounded-full hover:bg-surface-hover text-text-muted hover:text-primary transition-all duration-200 flex items-center justify-center"
                                    title="Start a new chat"
                                >
                                    <SquarePen className="w-5 h-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowHistory(prev => !prev)}
                                    className={`p-2 transition-all duration-200 rounded-full flex items-center justify-center ${
                                        showHistory 
                                        ? 'bg-primary/10 text-primary' 
                                        : 'hover:bg-surface-hover text-text-muted hover:text-primary'
                                    }`}
                                    title="Toggle chat history"
                                >
                                    <History className="w-5 h-5" />
                                </button>
                            </div>

                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                                placeholder={selectedAgent === 'cortex' ? "Paste SQL or ask for optimization..." : "Ask Anything..."}
                                className="flex-1 bg-transparent border-none outline-none focus:ring-0 py-2.5 px-1 text-sm resize-none max-h-36 overflow-hidden placeholder:text-text-muted/70 text-text-primary leading-[1.5]"
                                disabled={isLoading}
                                rows={1}
                            />

                            <div className="flex items-center gap-2 flex-shrink-0 pr-1">
                                <button 
                                    type="button" 
                                    className="p-2.5 rounded-full hover:bg-surface-hover text-text-muted hover:text-primary transition-colors" 
                                    title="Voice input"
                                >
                                    <Mic className="w-5 h-5" />
                                </button>
                                
                                <button
                                    type="submit"
                                    className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-[#6932D5] to-[#8B5CF6] text-white transition-all shadow-md group ${
                                        input.trim() 
                                        ? 'from-primary to-primary-hover active:scale-95 hover:scale-105' 
                                        : 'hover:opacity-95 active:scale-95'
                                    }`}
                                    aria-label={input.trim() ? "Send message" : "Voice voice visualizer"}
                                >
                                    {input.trim() ? (
                                        <ArrowUp className="w-5 h-5" />
                                    ) : (
                                        /* High-fidelity responsive micro-wave animation of Voice input */
                                        <div className="flex items-center gap-0.5 justify-center h-4">
                                            <span className="w-0.5 h-2 bg-white rounded-full animate-[pulse_1s_infinite_0ms]" />
                                            <span className="w-0.5 h-3.5 bg-white rounded-full animate-[pulse_1s_infinite_150ms]" />
                                            <span className="w-0.5 h-1.5 bg-white rounded-full animate-[pulse_1s_infinite_300ms]" />
                                            <span className="w-0.5 h-3 bg-white rounded-full animate-[pulse_1s_infinite_450ms]" />
                                            <span className="w-0.5 h-2 bg-white rounded-full animate-[pulse_1s_infinite_600ms]" />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </form>
                        
                        <p className="text-[10px] text-center text-text-muted mt-3 font-medium opacity-80">
                            Apex may provide inaccurate info. Verify important Snowflake Data Cloud changes.
                        </p>
                    </div>
                </div>
            </main>

            {/* RIGHT SIDE STEPPER WALKTHROUGH LAYOUT */}
            <AnimatePresence>
                {activeStepSequence && (
                    <motion.aside 
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 320, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="border-l border-border-color bg-surface shrink-0 overflow-x-hidden overflow-y-auto font-sans flex flex-col h-full z-30 relative shadow-xl chat-custom-scroll"
                    >
                        <div className="w-[320px] p-5 flex flex-col gap-4 flex-shrink-0">
                            <div className="flex items-center justify-between pb-3 border-b border-border-color/60">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-extrabold text-text-strong">Live Diagnostic Steps</h3>
                                </div>
                                <button 
                                    onClick={() => {
                                        setLastClosedStepSequence(activeStepSequence);
                                        setActiveStepSequence(null);
                                    }}
                                    className="text-text-muted hover:text-text-primary p-1 hover:bg-surface-hover rounded transition-colors cursor-pointer"
                                    title="Close stepper"
                                >
                                    <Plus className="w-4 h-4 rotate-45" />
                                </button>
                            </div>

                            {/* Card Details Box */}
                            <div className="bg-surface-nested border border-border-color/60 rounded-xl p-3.5 space-y-3 shadow-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono font-bold text-text-muted bg-surface/50 border border-border-color px-2 py-0.5 rounded uppercase">
                                        {activeStepSequence.recId || 'APX-214'}
                                    </span>
                                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                        activeStepSequence.severity?.toLowerCase().includes('high') 
                                            ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                                            : activeStepSequence.severity?.toLowerCase().includes('medium')
                                                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                                : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                    }`}>
                                        {activeStepSequence.severity || 'High'}
                                    </span>
                                </div>
                                
                                <div className="space-y-1">
                                    <h4 className="text-xs font-black text-text-strong tracking-tight leading-tight">
                                        {activeStepSequence.recTitle || activeStepSequence.title || 'Under-utilized Warehouse'}
                                    </h4>
                                    <p className="text-[11px] text-text-muted font-medium">
                                        Resource: <span className="font-mono text-primary font-bold">{activeStepSequence.affectedResource || 'DAILY_ETL_WH'}</span>
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-border-color/40 text-[11px]">
                                    <div>
                                        <span className="text-[9.5px] text-text-muted block font-medium">Account</span>
                                        <span className="font-bold text-text-strong block truncate" title={activeStepSequence.accountName}>{activeStepSequence.accountName || 'Finance Prod'}</span>
                                    </div>
                                    <div>
                                        <span className="text-[9.5px] text-text-muted block font-medium">Est. Monthly Savings</span>
                                        <span className="font-extrabold text-emerald-500 block">${activeStepSequence.savings || '1,200'}</span>
                                    </div>
                                    {activeStepSequence.userContext && (
                                        <div className="col-span-2 pt-0.5">
                                            <span className="text-[9.5px] text-text-muted block font-medium">Owner Context</span>
                                            <span className="font-bold text-text-strong flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                                                {activeStepSequence.userContext}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Stepper track */}
                            <div className="mt-2 pl-4 space-y-5 relative border-l border-border-color/50 flex flex-col">
                                {[
                                    { step: 0, title: "Detected Inefficiency", desc: "Identify scan/warehouse anomalies" },
                                    { step: 1, title: "Diagnostic Context", desc: "Compile PKG context block" },
                                    { step: 2, title: "AI Optimization Blueprint", desc: "Generate prompt template" },
                                    { step: 3, title: "GitHub Auto Enforcement", desc: "Push or direct enforce fix" }
                                ].map((item, idx) => {
                                    const isActive = activeStepSequence.currentStep === item.step;
                                    const isCompleted = activeStepSequence.currentStep > item.step;
                                    
                                    return (
                                        <div key={idx} className="relative">
                                            {/* Dot Indicator */}
                                            <div className="absolute -left-[26px] top-1">
                                                {isCompleted ? (
                                                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border border-white shadow-xs">
                                                        <svg className="w-3 h-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                ) : isActive ? (
                                                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center border border-white shadow-[0_0_8px_rgba(106,56,235,0.4)]">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                                    </div>
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full bg-surface border-2 border-border-color flex items-center justify-center" />
                                                )}
                                            </div>

                                            {/* Title and details */}
                                            <div className="flex flex-col gap-0.5 pl-2.5">
                                                <span className={`text-[12px] font-extrabold leading-tight ${isActive ? 'text-primary' : isCompleted ? 'text-text-strong font-bold' : 'text-text-muted font-semibold'}`}>
                                                    {item.title}
                                                </span>
                                                <span className="text-[10.5px] text-text-muted font-medium leading-normal">
                                                    {item.desc}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Expandable Accordion component for Query (only if has query text) */}
                            {activeStepSequence.queryText && (
                                <div className="mt-4 border border-border-color rounded-xl overflow-hidden bg-surface-nested">
                                    <button
                                        onClick={() => setIsStepperQueryExpanded(!isStepperQueryExpanded)}
                                        className="w-full px-3 py-2.5 flex items-center justify-between text-xs font-bold text-text-strong bg-surface-hover border-b border-border-color"
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <Lock className="w-3.5 h-3.5 text-primary shrink-0" />
                                            <span>Query Code Block</span>
                                        </div>
                                        <IconChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isStepperQueryExpanded ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    {isStepperQueryExpanded && (
                                        <div className="p-3 bg-[#090F19] border-t border-border-color/40 space-y-2">
                                            <div className="flex justify-between items-center bg-[#151D30] px-2 py-1.5 rounded border border-slate-800/80">
                                                <span className="text-[9.5px] font-mono text-slate-500 font-bold uppercase tracking-wider">Target SQL</span>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(activeStepSequence.queryText);
                                                        setIsStepperCopied(true);
                                                        setTimeout(() => setIsStepperCopied(false), 2000);
                                                    }}
                                                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors"
                                                >
                                                    {isStepperCopied ? (
                                                        <>
                                                            <IconCheck className="w-3 h-3 text-emerald-500" />
                                                            <span>Copied</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-3 h-3" />
                                                            <span>Copy</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            <div className="min-h-[80px] max-h-[160px] overflow-y-auto select-all p-2.5 rounded bg-[#0A0E17] chat-custom-scroll border border-border-color/40">
                                                <pre className="font-mono text-[10.5px] text-slate-300 leading-normal whitespace-pre-wrap select-all font-medium">
                                                    {activeStepSequence.queryText}
                                                </pre>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AIAgent;
