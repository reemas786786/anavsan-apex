import React from 'react';

const IconArrowRight: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);

const LoginGraphic: React.FC = () => (
    <div className="absolute inset-0">
        <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="coinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#FBBF24' }} />
                    <stop offset="100%" style={{ stopColor: '#F59E0B' }} />
                </linearGradient>
            </defs>
            <rect width="800" height="800" fill="#433372" />
            <circle cx="550" cy="120" r="10" fill="#EF4444" opacity="0.4" />
            <circle cx="150" cy="650" r="8" fill="#14B8A6" opacity="0.5" />
            <path d="M-50 400 L150 400 L200 350 L700 350" stroke="#6932D5" strokeWidth="2" fill="none" opacity="0.3" />
            <path d="M850 500 L650 500 L600 550 L100 550" stroke="#6932D5" strokeWidth="2" fill="none" opacity="0.3" />
            <path d="M400 850 L400 600 L450 550 L450 250" stroke="#6932D5" strokeWidth="2" fill="none" opacity="0.3" />
            <path d="M250 -50 L250 200 L300 250 L600 250" stroke="#6932D5" strokeWidth="2" fill="none" opacity="0.3" />
            <path d="M-50 700 L200 700 L250 650 L250 500 L350 400" stroke="#6932D5" strokeWidth="2" fill="none" opacity="0.3" />
            <path d="M850 100 L600 100 L550 150 L550 350 L500 400" stroke="#6932D5" strokeWidth="2" fill="none" opacity="0.3" />
            <circle cx="150" cy="400" r="4" fill="#A78BFA" />
            <circle cx="700" cy="350" r="4" fill="#A78BFA" />
            <circle cx="100" cy="550" r="4" fill="#A78BFA" />
            <circle cx="400" cy="600" r="4" fill="#A78BFA" />
            <circle cx="450" cy="250" r="4" fill="#A78BFA" />
            <circle cx="250" cy="500" r="4" fill="#A78BFA" />
            <g transform="translate(350, 450) scale(1.5)">
                <path d="M 0 100 L 20 90 L 180 90 L 200 100 L 180 110 L 20 110 Z" fill="#C7D2FE" />
                <path d="M 20 90 L 20 110 L 180 110 L 180 90 Z" fill="#A5B4FC" />
                <path d="M 30 95 C 40 40, 160 40, 170 95 L 160 100 C 150 50, 50 50, 40 100 Z" fill="#F3F4F6" />
                <path d="M 40 60 L 160 60 M 40 65 L 140 65 M 40 70 L 160 70 M 40 75 L 120 75 M 40 80 L 160 80" stroke="#9CA3AF" strokeWidth="1" />
                <circle cx="180" cy="40" r="15" fill="url(#coinGradient)" />
                <ellipse cx="180" cy="40" rx="15" ry="5" fill="#FCD34D" opacity="0.5" />
                <text x="180" y="44" fontFamily="Arial" fontSize="10" fill="#CA8A04" textAnchor="middle" fontWeight="bold">$</text>
                <circle cx="20" cy="120" r="20" fill="url(#coinGradient)" />
                <ellipse cx="20" cy="120" rx="20" ry="7" fill="#FCD34D" opacity="0.5" />
                <text x="20" y="125" fontFamily="Arial" fontSize="14" fill="#CA8A04" textAnchor="middle" fontWeight="bold">$</text>
                <circle cx="100" cy="125" r="18" fill="url(#coinGradient)" />
                <ellipse cx="100" cy="125" rx="18" ry="6" fill="#FCD34D" opacity="0.5" />
                <text x="100" y="129" fontFamily="Arial" fontSize="12" fill="#CA8A04" textAnchor="middle" fontWeight="bold">$</text>
            </g>
        </svg>
    </div>
);

interface ForgotPasswordPageProps {
    onContinue: () => void;
    onBackToLogin: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onContinue, onBackToLogin }) => {

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onContinue();
    };

    return (
        <div className="min-h-screen flex bg-white font-sans text-text-strong">
            {/* Left Panel - Form */}
            <div className="w-full lg:w-2/5 flex flex-col justify-center p-8 sm:p-16">
                <div className="mx-auto w-full max-w-sm">
                    <h1 className="text-3xl font-bold">Reset your password</h1>
                    <p className="mt-2 text-text-secondary">
                        Remember your password?{' '}
                        <button type="button" onClick={onBackToLogin} className="font-semibold text-primary hover:underline">
                            Sign in
                        </button>
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-secondary">
                                Work email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="you@company.com"
                                    className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="w-full flex justify-center items-center gap-2 px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                <span>Continue</span>
                                <IconArrowRight />
                            </button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm text-text-secondary">
                        Need help? <a href="#" className="font-semibold text-primary hover:underline">Contact support</a>
                    </div>
                </div>
                <footer className="w-full max-w-sm mx-auto mt-auto pt-8 text-xs text-text-muted text-center">
                    &copy; Anavsan Corp. All rights reserved.{' '}
                    <a href="#" className="text-primary hover:underline">
                        Privacy policy
                    </a>
                </footer>
            </div>

            {/* Right Panel - Graphic */}
            <div className="hidden lg:block w-3/5 relative overflow-hidden">
                <LoginGraphic />
            </div>
        </div>
    );
};

export default ForgotPasswordPage;