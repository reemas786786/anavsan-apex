import React, { useState } from 'react';
import { IconSparkles, IconArrowRight } from '../constants';
import { CollaborationWorkflow } from './SignupPage';

const IconEye: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const IconEyeOff: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
);

const IconGoogle: React.FC = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.904,36.568,44,31.023,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

const IconGithub: React.FC = () => (
    <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
    </svg>
);

const AnavsanLogo: React.FC = () => (
    <div className="flex items-center select-none" title="Anavsan">
        <svg xmlns="http://www.w3.org/2000/svg" width="94" height="20" viewBox="0 0 94 20" fill="none" className="text-[#150A2B] h-[22px] w-auto">
          <path d="M9.71971 0.0413355C9.90574 -0.0220003 10.1088 -0.0207893 10.2652 0.103292C10.423 0.228614 10.4717 0.429885 10.4517 0.628022C10.4305 0.838408 10.3967 1.04847 10.3669 1.24759C10.3368 1.44963 10.3101 1.64377 10.2997 1.83638C10.2494 2.7912 10.1865 3.73404 10.195 4.67625L10.2012 5.05306C10.2436 6.80963 10.477 8.54849 10.8306 10.2759L10.9083 10.646L10.9178 10.6823C10.9209 10.6912 10.9235 10.6968 10.9253 10.7C10.9253 10.7 10.9297 10.7011 10.9332 10.7021C10.9458 10.7055 10.9662 10.7094 10.9992 10.7117C11.8345 10.7702 12.6717 10.8958 13.476 11.2065L13.5483 11.2373C13.6184 11.27 13.6829 11.3077 13.7414 11.344C13.8268 11.3968 13.8863 11.4375 13.96 11.4805L14.1232 11.5758L14.0007 11.8691L13.9301 12.0368L13.7552 11.9943C12.9029 11.7877 12.0281 11.692 11.1521 11.7077C11.2262 11.9998 11.2959 12.2779 11.3752 12.5569C11.8121 14.0905 12.3089 15.5804 13.1208 16.9356L13.2616 17.1645C13.5951 17.6903 13.9686 18.1566 14.4797 18.4862L14.6001 18.5595C15.2016 18.9046 15.803 18.9382 16.4064 18.5823C17.057 18.1986 17.3482 17.6125 17.3158 16.8442L17.3154 16.8399V16.8357C17.3153 16.8037 17.3168 16.7715 17.3199 16.7396L17.3374 16.5639L17.5106 16.5462L17.585 16.539L17.8043 16.5167L17.8184 16.7396C17.8257 16.8549 17.8408 16.9558 17.8537 17.0895C17.8628 17.1824 17.8698 17.2831 17.8654 17.3866L17.8567 17.4911C17.6274 19.3475 15.7931 20.3377 14.0418 19.6145C13.2136 19.272 12.5827 18.6975 12.0652 18.0138L11.963 17.8755C11.2348 16.865 10.727 15.7497 10.31 14.6053L10.1364 14.113C10.0074 13.7338 9.8894 13.3515 9.77582 12.9696L9.4418 11.827C9.43772 11.813 9.43389 11.8014 9.43057 11.7916C7.87864 11.9313 6.40235 12.2877 5.04908 13.0328L4.77989 13.1871C3.78685 13.7794 3.09004 14.6301 2.65418 15.6809L2.57067 15.8937C2.36672 16.4416 2.1782 16.9953 1.99531 17.5522L1.45401 19.2305C1.38121 19.4562 1.26534 19.6528 1.0739 19.7624C0.90313 19.8601 0.708512 19.8681 0.506428 19.8197L0.419604 19.7957C0.290939 19.7554 0.139005 19.6927 0.0565218 19.5513C-0.0305115 19.4019 -0.00195302 19.2354 0.0419822 19.0965L0.448267 17.806C0.586117 17.3743 0.729109 16.9429 0.884463 16.5167L1.17028 15.7424C2.51887 12.1358 4.07897 8.62169 5.98797 5.26968L6.40256 4.55363C7.1379 3.30429 7.96797 2.10683 8.75883 0.906616L8.81906 0.819794C8.96506 0.62015 9.14232 0.445215 9.30223 0.290426L9.30469 0.288739L9.35 0.247859C9.45894 0.155895 9.58448 0.0861429 9.71971 0.0413355ZM8.54741 3.63986C6.8149 6.35844 5.36728 9.17826 4.10275 12.0975C4.80163 11.679 5.5619 11.3703 6.35726 11.1846L6.7328 11.1012C7.54033 10.9292 8.36053 10.7996 9.17427 10.6536C8.73207 8.38151 8.45016 6.05124 8.54741 3.63986Z" fill="url(#paint0_linear_93077_30992)"/>
          <path d="M30.2343 19.3361H28.7157L22.5966 10.0564V19.3361H21.0723V7.67188H22.5931L28.7157 16.9285V7.67188H30.2378L30.2343 19.3361Z" fill="currentColor"/>
          <path d="M41.3836 16.7449H36.3011L35.3648 19.337H33.7598L37.973 7.75H39.7279L43.9249 19.337H42.3199L41.3836 16.7449ZM40.9489 15.5135L38.8424 9.63293L36.7358 15.5135H40.9489Z" fill="currentColor"/>
          <path d="M57.0659 7.68359L52.6682 19.3374H50.9133L46.5156 7.68359H48.1379L51.7988 17.7324L55.4643 7.68359H57.0659Z" fill="currentColor"/>
          <path d="M62.0378 19.045C61.4679 18.8017 60.9743 18.4089 60.6092 17.9081C60.2611 17.4171 60.0742 16.83 60.0742 16.2281H61.6954C61.741 16.7575 61.9823 17.2508 62.3722 17.6118C62.7681 17.9854 63.3446 18.1722 64.1018 18.1722C64.8259 18.1722 65.397 17.9908 65.8152 17.6279C66.018 17.4576 66.1798 17.2436 66.2884 17.0021C66.397 16.7605 66.4496 16.4975 66.4424 16.2327C66.4601 15.8371 66.3288 15.4492 66.0746 15.1454C65.8225 14.8628 65.5062 14.6449 65.1522 14.5101C64.6647 14.3276 64.1678 14.1714 63.6636 14.042C63.0346 13.8872 62.418 13.6861 61.8188 13.4401C61.348 13.2331 60.9388 12.9078 60.6311 12.4957C60.3029 12.0668 60.1388 11.4903 60.1388 10.7662C60.1281 10.1678 60.2968 9.57982 60.6231 9.07809C60.959 8.57629 61.432 8.18166 61.986 7.9412C62.6205 7.66354 63.3078 7.52665 64.0003 7.53995C65.0926 7.53995 65.987 7.81282 66.6834 8.35859C67.0218 8.61763 67.3017 8.94509 67.5049 9.31959C67.7082 9.6941 67.8302 10.1073 67.863 10.5321H66.1911C66.135 10.087 65.9009 9.69422 65.4889 9.35369C65.0769 9.01315 64.5307 8.84325 63.8504 8.84402C63.2155 8.84402 62.697 9.00814 62.295 9.33637C61.8937 9.66614 61.6931 10.1251 61.6931 10.72C61.6774 11.099 61.8059 11.4698 62.0528 11.7578C62.2962 12.0276 62.5995 12.2365 62.9384 12.3677C63.2897 12.5076 63.7832 12.6664 64.4189 12.844C65.0513 13.0092 65.6712 13.2188 66.2741 13.4712C66.7489 13.6826 67.1629 14.0102 67.4779 14.4236C67.8122 14.8541 67.9794 15.4368 67.9794 16.1716C67.9802 16.738 67.8242 17.2936 67.5286 17.7767C67.2046 18.2996 66.7415 18.722 66.1911 18.9966C65.5433 19.3219 64.8253 19.4827 64.1006 19.4647C63.391 19.4733 62.6877 19.3302 62.0378 19.045Z" fill="currentColor"/>
          <path d="M78.784 16.7449H73.7014L72.7606 19.337H71.1602L75.3734 7.75H77.1283L81.3253 19.337H79.7203L78.784 16.7449ZM78.3493 15.5077L76.2427 9.62716L74.1361 15.5077H78.3493Z" fill="currentColor"/>
          <path d="M93.9988 19.3361H92.4779L86.3587 10.0564V19.3361H84.8379V7.67188H86.3587L92.4779 16.9343V7.67188H93.9999L93.9988 19.3361Z" fill="currentColor"/>
          <defs>
            <linearGradient id="paint0_linear_93077_30992" x1="8.93333" y1="0.215403" x2="8.93333" y2="19.6368" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6932D5" />
              <stop offset="1" stopColor="#7163C6" />
            </linearGradient>
          </defs>
        </svg>
    </div>
);

interface LoginPageProps {
    onLogin: (email: string) => void;
    onSSOLogin: () => void;
    onShowSignup: () => void;
    onShowForgotPassword: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSSOLogin, onShowSignup, onShowForgotPassword }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('finops@mail.com');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onLogin(email);
    };

    return (
        <div className="h-screen flex bg-white font-sans text-text-strong overflow-hidden selection:bg-primary/20">
            {/* Left Panel - Form */}
            <div className="w-full lg:w-[38%] xl:w-[34%] flex flex-col h-full bg-white p-8 md:p-10 border-r border-[#F2F4F7]">
                <div className="mx-auto w-full max-w-[360px] flex-grow flex flex-col justify-center">
                    <div className="mb-6">
                        <AnavsanLogo />
                    </div>
                    
                    <h1 className="text-[28px] font-black text-[#161616] tracking-tight leading-tight">Sign in to <span className="text-[#161616]">Anavsan</span></h1>
                    <p className="mt-1.5 text-[#5A5A72] text-xs font-semibold">
                        Don't have an account?{' '}
                        <button type="button" onClick={onShowSignup} className="font-bold text-[#6932D5] hover:underline">
                            Sign up
                        </button>
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div className="space-y-1">
                            <label htmlFor="email" className="block text-[10px] font-black text-[#5A5A72] ml-1 uppercase tracking-wider">
                                Work email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@company.com"
                                className="w-full px-5 py-3 bg-[#F2F4F7] border-none rounded-full focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-[#9A9AB2] text-xs font-semibold"
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center px-1">
                                <label htmlFor="password" className="block text-[10px] font-black text-[#5A5A72] uppercase tracking-wider">
                                    Password
                                </label>
                                <button type="button" onClick={onShowForgotPassword} className="text-[10px] font-bold text-[#6932D5] hover:underline uppercase tracking-wider">
                                    Forgot?
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value="••••••••••••"
                                    readOnly
                                    placeholder="Enter your password"
                                    className="w-full px-5 py-3 bg-[#F2F4F7] border-none rounded-full focus:ring-2 focus:ring-primary outline-none transition-all text-xs font-semibold"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-1 px-4 flex items-center text-[#9A9AB2] hover:text-[#6932D5]">
                                    {showPassword ? <IconEyeOff /> : <IconEye />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" defaultChecked className="h-3.5 w-3.5 text-[#6932D5] rounded border-gray-300 focus:ring-primary" />
                            <label htmlFor="remember-me" className="ml-2 block text-[10px] text-[#5A5A72] font-black uppercase tracking-wider">
                                Remember me
                            </label>
                        </div>

                        <div className="pt-1">
                            <button type="submit" className="w-full flex justify-center items-center gap-2 py-3 bg-[#6932D5] text-white font-black rounded-full hover:bg-[#5A28BE] transition-all text-sm group">
                                <span>Sign in</span>
                                <IconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </form>

                    <div className="relative flex items-center justify-center my-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#EAE6F2]"></div></div>
                        <span className="relative bg-white px-3 text-[10px] text-[#9A9AB2] font-black uppercase tracking-widest">Or continue with</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={onSSOLogin} className="flex items-center justify-center gap-2 py-2.5 bg-white border border-border-light rounded-full hover:bg-[#F2F4F7] transition-all text-[#161616] font-bold text-xs shadow-sm">
                           <IconGoogle />
                           <span>Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2.5 bg-white border border-border-light rounded-full hover:bg-[#F2F4F7] transition-all text-[#161616] font-bold text-xs shadow-sm">
                            <IconGithub />
                            <span>GitHub</span>
                        </button>
                    </div>

                    {/* Quick Demo Login as elegant text links below SSO */}
                    <div className="mt-5 text-center">
                        <div className="flex justify-center items-center gap-4 text-xs">
                            <button 
                                type="button" 
                                onClick={() => onLogin('finops@mail.com')}
                                className="text-[#9A9AB2] hover:text-[#6932D5] hover:underline font-bold transition-all cursor-pointer"
                                title="Click to log in as FinOps"
                            >
                                FinOps
                            </button>
                            <span className="text-[#EAE6F2] font-semibold select-none">|</span>
                            <button 
                                type="button" 
                                onClick={() => onLogin('dataengineer@mail.com')}
                                className="text-[#9A9AB2] hover:text-[#6932D5] hover:underline font-bold transition-all cursor-pointer"
                                title="Click to log in as Data Engineer"
                            >
                                Data Engineer
                            </button>
                        </div>
                    </div>
                </div>

                <footer className="flex-shrink-0 pt-4">
                    <p className="text-[9px] text-[#9A9AB2] font-bold uppercase tracking-widest text-center">
                        © 2026 Anavsan, Inc.{' '}
                        <a href="#" className="text-[#6932D5] hover:underline ml-1">privacy policy</a>
                    </p>
                </footer>
            </div>

            {/* Right Panel - Illustration */}
            <div className="hidden lg:flex w-[62%] xl:w-[66%] relative bg-gradient-to-tr from-[#130733] via-[#0E0627] to-[#1F0E4E] flex-col justify-center items-center px-12 xl:px-20 overflow-hidden text-center">
                <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-[#6932D5]/10 rounded-full blur-[140px] "></div>
                <div className="absolute -bottom-20 -left-20 w-[480px] h-[480px] bg-indigo-500/10 rounded-full blur-[120px]"></div>

                <div className="max-w-2xl relative z-10 space-y-12 flex flex-col items-center">
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-6 duration-1000">
                        <h2 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-none">
                            Stop wasting your <br />
                            <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-[#A78BFA] bg-clip-text text-transparent">Snowflake budget</span>
                        </h2>
                        <p className="text-sm xl:text-base text-[#BAC3E1] font-semibold leading-relaxed opacity-85 max-w-lg mx-auto">
                            Your human-in-the-loop AI partner, collaboratively turns expensive queries into cost optimized performance queries in seconds.
                        </p>
                    </div>

                    <div className="w-full max-w-2xl">
                        <CollaborationWorkflow />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;