
import React, { useState } from 'react';
import { IconChevronRight, IconCheck, IconArrowUp } from '../constants';
import LandingHero from '../components/LandingHero';
import { TaskQueueSkeletonSimulator } from '../components/TaskQueueSkeletonSimulator';

interface LandingPageProps {
    onGetStarted: () => void;
    onLogin: () => void;
    onBookDemo: () => void;
}

const FeatureItem: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex items-start gap-3 text-sm text-text-secondary">
        <IconCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <span>{text}</span>
    </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin, onBookDemo }) => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const pricing = {
        individual: billingCycle === 'monthly' ? 49 : 39,
        team: billingCycle === 'monthly' ? 239 : 199,
    };

    return (
        <div className="min-h-screen bg-[#FDFCFE] text-text-strong font-sans selection:bg-primary/20">
            {/* Top Navigation */}
            <nav className="fixed top-0 inset-x-0 h-20 bg-white/10 backdrop-blur-md z-50 border-b border-white/10">
                <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold flex items-center text-white">
                                <span style={{fontFamily: 'serif', color: '#000000'}} className="text-4xl -mr-1 text-black">
                                    A
                                </span>
                                <span className="tracking-[0.1em]">NAVSAN</span>
                            </h1>
                        </div>
                        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
                            <a href="#home" className="hover:text-white transition-colors">Home</a>
                            <a href="#features" className="hover:text-white transition-colors">Features</a>
                            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                            <a href="#comparison" className="hover:text-white transition-colors">Comparison</a>
                            <a href="#docs" className="hover:text-white transition-colors">Docs</a>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={onLogin} className="px-5 py-2.5 text-sm font-semibold text-white border border-white/10 rounded-lg hover:bg-white/5 transition-all">Contact us</button>
                        <button onClick={onBookDemo} className="px-5 py-2.5 text-sm font-semibold bg-white text-primary rounded-lg hover:opacity-90 transition-all shadow-sm">Book a demo</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home">
                <LandingHero onGetStarted={onGetStarted} />
                <div className="bg-white py-12">
                    <TaskQueueSkeletonSimulator />
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 px-6 bg-[#F8F9FB]">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-border-light text-xs font-bold text-text-secondary uppercase tracking-widest mb-4">Pricing & Plans</div>
                    <h2 className="text-4xl md:text-5xl font-black text-sidebar-topbar">Affordable Pricing Plans</h2>
                    <p className="mt-4 text-text-secondary max-w-2xl mx-auto">Access the advanced tools and instant recommendations needed to maximize ROI and achieve streamlined optimization workflows.</p>

                    {/* Toggle */}
                    <div className="mt-12 flex items-center justify-center gap-6">
                        <span className={`text-sm font-bold transition-colors ${billingCycle === 'monthly' ? 'text-sidebar-topbar' : 'text-text-muted'}`}>Billed Monthly</span>
                        <button 
                            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                            className="w-14 h-7 bg-sidebar-topbar rounded-full p-1 relative transition-colors"
                        >
                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'}`}></div>
                        </button>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold transition-colors ${billingCycle === 'yearly' ? 'text-sidebar-topbar' : 'text-text-muted'}`}>Billed yearly</span>
                            <span className="bg-status-success-light text-status-success-dark text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">Save 20%</span>
                        </div>
                    </div>

                    {/* Plan Cards */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                        {/* Individual */}
                        <div className="bg-white rounded-[32px] p-8 border border-border-light flex flex-col hover:shadow-xl transition-shadow">
                            <div className="w-12 h-12 bg-pink-100 rounded-2xl mb-6 flex items-center justify-center">
                                <div className="w-6 h-6 bg-pink-500 rounded-lg rotate-45"></div>
                            </div>
                            <h3 className="text-xl font-bold text-left">Individual</h3>
                            <p className="text-sm text-text-secondary text-left mt-1">Perfect for data engineers.</p>
                            <div className="mt-8 text-left">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black">${pricing.individual}</span>
                                    <span className="text-sm text-text-muted ml-2">per member / month</span>
                                </div>
                                {billingCycle === 'yearly' && (
                                    <p className="text-xs font-bold text-primary mt-1">
                                        ${(pricing.individual * 12).toLocaleString()} billed annually
                                    </p>
                                )}
                            </div>
                            <button onClick={onGetStarted} className="mt-8 w-full py-4 bg-sidebar-topbar text-white font-bold rounded-xl hover:opacity-90 transition-all">Start 14-day free trial</button>
                            
                            <div className="mt-10 space-y-4 border-t border-border-light pt-8 text-left">
                                <FeatureItem text="Instant query optimization" />
                                <FeatureItem text="Query simulation" />
                                <FeatureItem text="Query vault" />
                                <FeatureItem text="Cloud overview & dashboard" />
                            </div>
                        </div>

                        {/* Team */}
                        <div className="bg-white rounded-[32px] p-8 border-2 border-primary ring-4 ring-primary/5 flex flex-col relative scale-105 z-10 shadow-2xl shadow-primary/10">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">Most Popular</div>
                            <div className="w-12 h-12 bg-orange-100 rounded-2xl mb-6 flex items-center justify-center">
                                <div className="grid grid-cols-2 gap-0.5">
                                    <div className="w-2.5 h-2.5 bg-orange-500 rounded-sm"></div>
                                    <div className="w-2.5 h-2.5 bg-orange-500 rounded-sm"></div>
                                    <div className="w-2.5 h-2.5 bg-orange-500 rounded-sm"></div>
                                    <div className="w-2.5 h-2.5 bg-orange-500 rounded-sm"></div>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-left">Team</h3>
                            <p className="text-sm text-text-secondary text-left mt-1">Ideal for FinOps and DataOps team.</p>
                            <div className="mt-8 text-left">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black">${pricing.team}</span>
                                    <span className="text-sm text-text-muted ml-2">for 5 members / month</span>
                                </div>
                                {billingCycle === 'yearly' && (
                                    <p className="text-xs font-bold text-primary mt-1">
                                        ${(pricing.team * 12).toLocaleString()} billed annually
                                    </p>
                                )}
                            </div>
                            <button onClick={onGetStarted} className="mt-8 w-full py-4 bg-sidebar-topbar text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg">Start 14-day free trial</button>
                            
                            <div className="mt-10 space-y-4 border-t border-border-light pt-8 text-left">
                                <FeatureItem text="Everything in Individual +" />
                                <FeatureItem text="Query assignment" />
                                <FeatureItem text="Query history insights" />
                                <FeatureItem text="Customizable dashboards" />
                                <FeatureItem text="Storage savings insights" />
                                <FeatureItem text="Alerts" />
                                <FeatureItem text="Priority support" />
                            </div>
                        </div>

                        {/* Enterprise */}
                        <div className="bg-white rounded-[32px] p-8 border border-border-light flex flex-col hover:shadow-xl transition-shadow">
                            <div className="w-12 h-12 bg-purple-100 rounded-2xl mb-6 flex items-center justify-center">
                                <div className="w-6 h-6 border-4 border-purple-500 rounded-full border-t-transparent animate-spin-slow"></div>
                            </div>
                            <h3 className="text-xl font-bold text-left">Enterprise</h3>
                            <p className="text-sm text-text-secondary text-left mt-1">Built for large organizations needs.</p>
                            <div className="mt-8 text-left flex items-baseline gap-2">
                                <span className="text-4xl font-black">%</span>
                                <span className="text-sm text-text-muted">of your annual Snowflake spend</span>
                            </div>
                            <button onClick={onLogin} className="mt-8 w-full py-4 bg-sidebar-topbar text-white font-bold rounded-xl hover:opacity-90 transition-all">Contact us</button>
                            
                            <div className="mt-10 space-y-4 border-t border-border-light pt-8 text-left">
                                <FeatureItem text="Everything in Team +" />
                                <FeatureItem text="Real-time usage dashboards & alerts" />
                                <FeatureItem text="Comprehensive dashboard drill down" />
                                <FeatureItem text="Automatic tagging & cost attribution" />
                                <FeatureItem text="Intelligent table-type & retention management" />
                                <FeatureItem text="End-to-end lineage visibility" />
                                <FeatureItem text="Policy-driven budgets & notifications" />
                            </div>
                        </div>
                    </div>

                    {/* Extended Trial Banner */}
                    <div className="mt-20 bg-gray-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-text-primary font-medium">SnowPro certified professionals can opt for extended trial <span className="text-status-error">Get 14 more days</span></p>
                        <button className="px-6 py-2 bg-white text-sidebar-topbar font-bold rounded-lg border border-border-light hover:bg-gray-50 transition-all shadow-sm">Apply Now</button>
                    </div>

                    <div className="mt-12 flex flex-wrap items-center justify-center gap-12 text-sm font-bold text-text-secondary">
                        <div className="flex items-center gap-2">
                            <IconCheck className="w-5 h-5 text-sidebar-topbar" />
                            Free 14 days trial
                        </div>
                        <div className="flex items-center gap-2">
                            <IconCheck className="w-5 h-5 text-sidebar-topbar" />
                            No credit card required
                        </div>
                        <div className="flex items-center gap-2">
                            <IconCheck className="w-5 h-5 text-sidebar-topbar" />
                            Easy set up
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-sidebar-topbar py-12 px-6 text-white/60">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-black tracking-widest text-white">ANAVSAN</span>
                        <span className="text-xs">&copy; 2024</span>
                    </div>
                    <div className="flex gap-8 text-sm">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Documentation</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
