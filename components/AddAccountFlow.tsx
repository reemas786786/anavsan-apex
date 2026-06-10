import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    IconCheck, 
    IconClipboardCopy, 
    IconDatabase, 
    IconRefresh, 
    IconChevronRight, 
    IconLockClosed, 
    IconCheckCircle, 
    IconXCircle,
    IconArrowRight,
    IconSparkles,
    IconKey,
    IconActivity,
    IconZap
} from '../constants';
import Toast from './Toast';

interface AddAccountFlowProps {
    onCancel: () => void;
    onAddAccount: (data: { name: string; identifier: string; region: string; cloud: string }) => void;
}

const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group bg-[#0D1117] border border-white/5 rounded-2xl p-6 text-left shadow-2xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-status-success shadow-[0_0_8px_rgba(22,163,74,0.5)]"></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Snowflake Setup Script</span>
                </div>
                <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-[10px] font-bold uppercase tracking-tighter"
                >
                    {copied ? <IconCheck className="w-3.5 h-3.5 text-status-success" /> : <IconClipboardCopy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy SQL'}
                </button>
            </div>
            <pre className="text-[12px] font-mono text-gray-300 leading-relaxed overflow-x-auto whitespace-pre custom-scrollbar flex-grow">
                <code>{code}</code>
            </pre>
        </div>
    );
};

const AddAccountFlow: React.FC<AddAccountFlowProps> = ({ onCancel, onAddAccount }) => {
    const [step, setStep] = useState<'details' | 'deployment' | 'waiting' | 'validation'>('details');
    const [accountName, setAccountName] = useState('');
    const [accountIdentifier, setAccountIdentifier] = useState('');
    const [creditRate, setCreditRate] = useState('3.00');
    const [primaryGoal, setPrimaryGoal] = useState<'FinOps' | 'Engineering' | 'Governance' | null>(null);
    const [progress, setProgress] = useState(0);
    const [logMessages, setLogMessages] = useState<string[]>([]);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const tips = [
        "Most Snowflake waste comes from warehouses staying awake for 5 minutes after a query ends. I'll help you change that to 60 seconds.",
        "Remote spilling is the #1 killer of query performance. I've already found 12 cases in your history.",
        "Anavsan identifies 'Vampire Burn'—queries that consume credits while producing zero business value.",
        "Automated budget guardrails can prevent 90% of accidental cost spikes."
    ];

    const technicalMilestones = [
        { time: "[00:15]", msg: "Ingesting ACCOUNT_USAGE metadata..." },
        { time: "[01:30]", msg: "Mapping warehouse load patterns for the last 30 days..." },
        { time: "[02:45]", msg: "Analyzing SQL patterns to identify 'Vampire Burn'..." },
        { time: "[04:00]", msg: "Building your organization's Knowledge Graph..." },
        { time: "[04:30]", msg: "Analyzing compute cluster 'BI_WH'..." },
        { time: "[04:45]", msg: "Calculating potential savings for 'PROD_DB'..." }
    ];

    useEffect(() => {
        if (step === 'waiting') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 1;
                });
            }, 150);

            const logInterval = setInterval(() => {
                setLogMessages(prev => {
                    if (prev.length < technicalMilestones.length) {
                        const next = technicalMilestones[prev.length];
                        return [...prev, `${next.time} ${next.msg}`];
                    }
                    return prev;
                });
            }, 1200);

            const tipInterval = setInterval(() => {
                setCurrentTipIndex(prev => (prev + 1) % tips.length);
            }, 5000);

            return () => {
                clearInterval(interval);
                clearInterval(logInterval);
                clearInterval(tipInterval);
            };
        }
    }, [step]);

    const handleDetailsContinue = () => {
        if (!accountName || !accountIdentifier) {
            setToast({ message: "Please fill in all fields", type: 'error' });
            return;
        }
        setStep('deployment');
    };

    const setupScript = useMemo(() => {
        return `CREATE OR REPLACE USER anavsan_user
  RSA_PUBLIC_KEY       = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoSK6sk3IICn3JvDqH5YAHCcF/rU4wnQLTpLb+8Oe5NAolAeyuG3MVXiqbTlIskQDsIeiR1+QQFepyRb4mr8XRkdGzp/jGMq6/sWvaIKS540m/52Se7W5EbcPl9SbcYMSq36uFvLiOZuuLvf3kJImjXQwOP8MEwLV8bIcDJjKoeFMPYU40KSSGBeztpTfkorg3d1lpcn8khIYeAVI2U7btFj0SaeXdJZLexCVT6+zzbQvtn/yiLL/pXUx5/GOLNCPzKP581CroUYJjh08IxOWRy9oAf+ByT510Zqd2kX8diihoF9oeiwPiC9r7Rt7PsVtI8EooWzWibeK+NlNcLY7ZQIDAQAB'
  TYPE                 = SERVICE
  DEFAULT_ROLE         = anavsan_role
  DEFAULT_WAREHOUSE    = anavsan_wh
  COMMENT              = 'Service account for Anavsan - KEY PAIR AUTH';

CREATE OR REPLACE ROLE anavsan_role;
GRANT ROLE anavsan_role TO USER anavsan_user;
GRANT IMPORTED PRIVILEGES ON DATABASE SNOWFLAKE TO ROLE anavsan_role;
GRANT MONITOR USAGE ON ACCOUNT TO ROLE anavsan_role;

CREATE OR REPLACE WAREHOUSE anavsan_wh
WAREHOUSE_SIZE = XSMALL
AUTO_SUSPEND = 300
AUTO_RESUME = TRUE
INITIALLY_SUSPENDED = TRUE;
ALTER USER anavsan_user SET DEFAULT_WAREHOUSE = anavsan_wh;
GRANT USAGE ON WAREHOUSE anavsan_wh TO ROLE anavsan_role;

CREATE OR REPLACE NETWORK POLICY anavsan_network_policy
ALLOWED_IP_LIST = (
    '3.130.165.248'
);
ALTER USER anavsan_user SET NETWORK_POLICY = anavsan_network_policy;`;
    }, []);

    const handleCopyAndOpen = () => {
        navigator.clipboard.writeText(setupScript);
        setToast({ message: "Script copied to clipboard!", type: 'success' });
        window.open("https://app.snowflake.com", "_blank");
        
        // Simulate "Listening" and finding connection
        setTimeout(() => {
            setStep('waiting');
        }, 4000);
    };

    const handleWaitingContinue = () => {
        setStep('validation');
    };

    const handleFinalize = () => {
        onAddAccount({
            name: accountName,
            identifier: accountIdentifier,
            region: 'Auto-detected',
            cloud: 'Snowflake'
        });
    };

    return (
        <div className="flex h-full bg-[#F4F1F9] relative overflow-hidden font-sans">
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}

            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <AnimatePresence mode="wait">
                    {/* STEP 1: SETUP DETAILS */}
                    {step === 'details' && (
                        <motion.div 
                            key="details"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-xl w-full text-center space-y-10"
                        >
                            <div className="space-y-4">
                                <h1 className="text-5xl font-black text-text-strong tracking-tight">
                                    Connect your <span className="text-primary">Snowflake</span> account.
                                </h1>
                                <p className="text-lg text-text-secondary font-medium leading-relaxed">
                                    Provide your account details to generate a secure integration script.
                                </p>
                            </div>

                            <div className="space-y-6 text-left">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">Account display name</label>
                                    <input 
                                        type="text" 
                                        value={accountName}
                                        onChange={(e) => setAccountName(e.target.value)}
                                        placeholder="e.g., Marketing Team Snowflake"
                                        className="w-full bg-white border border-border-light rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                    />
                                    <p className="text-[10px] text-text-muted font-bold ml-1">To identify this account inside Anavsan.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">Snowflake account identifier</label>
                                    <input 
                                        type="text" 
                                        value={accountIdentifier}
                                        onChange={(e) => setAccountIdentifier(e.target.value)}
                                        placeholder="e.g., ZHDNFZF-RCC91942"
                                        className="w-full bg-white border border-border-light rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                    />
                                    <p className="text-[10px] text-text-muted font-bold ml-1">Find your identifier in under Profile &gt; Connect a tool to Snowflake.</p>
                                </div>

                                <button 
                                    onClick={handleDetailsContinue}
                                    disabled={!accountName || !accountIdentifier}
                                    className="w-full bg-primary text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary-hover active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    <span>Generate Setup Script</span>
                                    <IconArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: THE DEPLOYMENT */}
                    {step === 'deployment' && (
                        <motion.div 
                            key="deployment"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-5 gap-12 items-start"
                        >
                            <div className="lg:col-span-2 space-y-8 text-left pt-8">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                        <IconZap className="w-3 h-3" />
                                        Run setup script
                                    </div>
                                    <h1 className="text-4xl font-black text-text-strong tracking-tight">
                                        Finalize setup in Snowflake.
                                    </h1>
                                    <p className="text-lg text-text-secondary font-medium leading-relaxed">
                                        Copy and run this script in a Snowflake worksheet to perform all the necessary setup steps at once.
                                    </p>
                                    <div className="p-4 bg-white/50 border border-primary/10 rounded-2xl text-xs text-text-secondary font-medium leading-relaxed">
                                        This script applies a strict network policy that restricts the service user to Anavsan’s trusted IP (<span className="text-primary font-bold">3.130.165.248</span>).
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <button 
                                        onClick={handleCopyAndOpen}
                                        className="w-full bg-primary text-white py-6 rounded-[28px] font-black text-base uppercase tracking-widest hover:bg-primary-hover active:scale-[0.98] transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 group"
                                    >
                                        <IconDatabase className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                        <span>Copy and go to Snowflake</span>
                                    </button>

                                    <div className="flex flex-col items-center gap-4 py-8">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-full border-4 border-primary/10 flex items-center justify-center">
                                                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                                            </div>
                                            <div className="absolute inset-0 w-16 h-16 rounded-full bg-primary/5 animate-ping"></div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-primary font-black text-xs uppercase tracking-widest animate-pulse">Listening for connection...</p>
                                            <p className="text-[10px] text-text-muted font-bold mt-1 uppercase tracking-tighter">Waiting for script execution</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-3 h-[600px] w-full">
                                <CodeBlock code={setupScript} />
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: THE INTERACTIVE WAIT (Swan Touch) */}
                    {step === 'waiting' && (
                        <motion.div 
                            key="waiting"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="max-w-5xl w-full flex flex-col items-center space-y-12"
                        >
                            {/* TOP: Progress & Title */}
                            <div className="w-full max-w-2xl text-center space-y-6">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-text-strong tracking-tight">Initializing your Intelligent Workspace...</h2>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 h-3 bg-white/50 rounded-full overflow-hidden border border-border-light">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                className="h-full bg-primary"
                                            />
                                        </div>
                                        <span className="text-sm font-black text-primary w-12">{progress}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* MIDDLE: The Action (Interview) */}
                            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                                {/* Question 1: Credit Rate */}
                                <div className="bg-white p-8 rounded-[40px] border border-border-light shadow-xl space-y-6 flex flex-col">
                                    <div className="space-y-2">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                            <IconSparkles className="w-3 h-3" />
                                            ROI Calculation
                                        </div>
                                        <h3 className="text-xl font-black text-text-strong">Help me calculate your savings</h3>
                                        <p className="text-sm text-text-secondary font-medium">How much do you pay per Snowflake credit?</p>
                                    </div>
                                    <div className="relative flex-grow flex items-center">
                                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                            <span className="text-2xl font-black text-text-strong">$</span>
                                        </div>
                                        <input 
                                            type="number"
                                            step="0.01"
                                            value={creditRate}
                                            onChange={(e) => setCreditRate(e.target.value)}
                                            className="w-full bg-[#F4F1F9] border-none rounded-3xl pl-12 pr-24 py-6 text-3xl font-black text-text-strong outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                        />
                                        <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
                                            <span className="text-sm font-black text-text-muted uppercase tracking-widest">per credit</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Question 2: Primary Goal */}
                                <div className="bg-white p-8 rounded-[40px] border border-border-light shadow-xl space-y-6 flex flex-col">
                                    <div className="space-y-2">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                            <IconActivity className="w-3 h-3" />
                                            Workload Health
                                        </div>
                                        <h3 className="text-xl font-black text-text-strong">What is your primary goal this week?</h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { id: 'FinOps', label: 'Lower monthly bill', icon: <IconZap className="w-4 h-4" /> },
                                            { id: 'Engineering', label: 'Fix slow queries', icon: <IconRefresh className="w-4 h-4" /> },
                                            { id: 'Governance', label: 'Set budget guardrails', icon: <IconLockClosed className="w-4 h-4" /> }
                                        ].map(goal => (
                                            <button 
                                                key={goal.id}
                                                onClick={() => setPrimaryGoal(goal.id as any)}
                                                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${primaryGoal === goal.id ? 'border-primary bg-primary/5' : 'border-border-light hover:border-primary/30'}`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${primaryGoal === goal.id ? 'bg-primary text-white' : 'bg-surface-nested text-text-muted'}`}>
                                                    {goal.icon}
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{goal.id}</p>
                                                    <p className="text-sm font-bold text-text-strong">{goal.label}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* BOTTOM: The AI Log & Tips */}
                            <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                                {/* AI Log */}
                                <div className="lg:col-span-3 bg-[#0D1117] rounded-[32px] p-8 border border-white/5 shadow-2xl h-[280px] flex flex-col">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-3 h-3 rounded-full bg-primary animate-ping absolute inset-0"></div>
                                                <div className="w-3 h-3 rounded-full bg-primary relative"></div>
                                            </div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Analysis Stream</span>
                                        </div>
                                        <div className="text-[10px] font-mono text-primary/50">ANAVSAN_AGENT_v1.0.4</div>
                                    </div>
                                    <div className="flex-grow overflow-y-auto custom-scrollbar space-y-2 font-mono text-[11px]">
                                        <AnimatePresence initial={false}>
                                            {logMessages.map((msg, i) => (
                                                <motion.div 
                                                    key={i}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="flex gap-4"
                                                >
                                                    <span className="text-primary/40 shrink-0">{msg.split(' ')[0]}</span>
                                                    <span className="text-gray-300">{msg.split(' ').slice(1).join(' ')}</span>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        <div className="h-4 w-2 bg-primary/50 animate-pulse inline-block ml-1"></div>
                                    </div>
                                </div>

                                {/* Pro-Tips Carousel */}
                                <div className="lg:col-span-2 bg-primary rounded-[32px] p-8 text-white shadow-2xl shadow-primary/20 h-[280px] flex flex-col justify-between relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                    <div className="space-y-4 relative">
                                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                            <IconSparkles className="w-5 h-5" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Did you know?</p>
                                        <AnimatePresence mode="wait">
                                            <motion.p 
                                                key={currentTipIndex}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="text-lg font-bold leading-relaxed"
                                            >
                                                {tips[currentTipIndex]}
                                            </motion.p>
                                        </AnimatePresence>
                                    </div>
                                    <div className="flex gap-1">
                                        {tips.map((_, i) => (
                                            <div key={i} className={`h-1 rounded-full transition-all ${i === currentTipIndex ? 'w-6 bg-white' : 'w-2 bg-white/30'}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Final Action Button (Visible when progress is high or goal is selected) */}
                            <motion.button 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: progress > 80 && primaryGoal ? 1 : 0.5, y: 0 }}
                                onClick={handleWaitingContinue}
                                disabled={progress < 90 || !primaryGoal}
                                className="bg-text-strong text-white px-12 py-5 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] hover:bg-black active:scale-95 transition-all shadow-2xl flex items-center gap-4 group disabled:cursor-not-allowed"
                            >
                                <span>{progress < 100 ? 'Finalizing Analysis...' : 'Save & Continue'}</span>
                                <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </motion.div>
                    )}

                    {/* STEP 4: THE VALIDATION */}
                    {step === 'validation' && (
                        <motion.div 
                            key="validation"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-2xl w-full text-center space-y-10"
                        >
                            <div className="relative mx-auto w-32 h-32">
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                                    className="absolute inset-0 bg-status-success rounded-full flex items-center justify-center shadow-2xl shadow-status-success/40"
                                >
                                    <IconCheck className="w-16 h-16 text-white" />
                                </motion.div>
                                <motion.div 
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute -inset-4 border-2 border-status-success rounded-full"
                                />
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-5xl font-black text-text-strong tracking-tight">
                                    Connection Successful.
                                </h1>
                                <div className="bg-white p-8 rounded-[32px] border border-border-light shadow-sm max-w-lg mx-auto">
                                    <p className="text-lg text-text-secondary font-medium leading-relaxed italic">
                                        "I've successfully linked to <span className="text-primary font-bold">{accountName}</span>. I am now ingesting your last 7 days of metadata. I've already identified <span className="text-text-strong font-bold">3 warehouses</span> with high idle times."
                                    </p>
                                </div>
                            </div>

                            <button 
                                onClick={handleFinalize}
                                className="bg-text-strong text-white px-12 py-5 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] hover:bg-black active:scale-95 transition-all shadow-2xl flex items-center gap-4 mx-auto group"
                            >
                                <span>Explore My First Insights</span>
                                <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#7163C6]/5 rounded-full blur-[100px]"></div>
            </div>
            
            {/* Cancel Button */}
            {step !== 'validation' && (
                <button 
                    onClick={onCancel}
                    className="absolute top-8 right-8 p-3 rounded-full bg-white border border-border-light text-text-muted hover:text-text-strong transition-all shadow-sm"
                >
                    <IconXCircle className="w-6 h-6" />
                </button>
            )}
        </div>
    );
};

export default AddAccountFlow;
