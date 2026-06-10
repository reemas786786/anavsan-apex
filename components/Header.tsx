
import React, { useState, useRef, useEffect } from 'react';
import { IconMenu, IconSparkles, IconUser, IconSearch, IconBell, IconClose, IconHelpCircle, IconSupport, IconAIAgent } from '../constants';
import { User, Bell, CreditCard, Lock, LogOut } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import { Notification, Page } from '../types';

interface HeaderProps {
    onMenuClick: () => void;
    onLogoClick: () => void;
    isSidebarOpen: boolean;
    brandLogo: string | null;
    onOpenProfile: () => void;
    onLogout: () => void;
    hasNewAssignment?: boolean;
    notifications: Notification[];
    onMarkAllNotificationsAsRead: () => void;
    onClearAllNotifications: () => void;
    onNavigate: (page: Page, subPage?: string) => void;
    onOpenQuickAsk: () => void;
    displayMode: 'cost' | 'credits';
    onDisplayModeChange: (mode: 'cost' | 'credits') => void;
}

const AnavsanLogo: React.FC<{}> = () => (
    <div className="flex items-center gap-1 cursor-pointer select-none" title="Anavsan - Home">
        <svg xmlns="http://www.w3.org/2000/svg" width="94" height="20" viewBox="0 0 94 20" fill="none" className="text-white h-[24px] w-auto">
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

const BrandLogo: React.FC<{ logoUrl: string }> = ({ logoUrl }) => (
    <div className="flex items-center justify-center h-[26px] w-[112px]" title="Brand Logo">
        <img src={logoUrl} alt="Brand Logo" className="max-h-full max-w-full object-contain" />
    </div>
);


const Header: React.FC<HeaderProps> = ({ 
    onMenuClick, 
    onLogoClick, 
    isSidebarOpen, 
    brandLogo, 
    onOpenProfile, 
    onLogout, 
    hasNewAssignment, 
    notifications,
    onMarkAllNotificationsAsRead,
    onClearAllNotifications,
    onNavigate,
    onOpenQuickAsk,
    displayMode,
    onDisplayModeChange,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
            setIsUserMenuOpen(false);
        }
        if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
            setIsNotificationsOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="bg-sidebar-topbar px-4 py-2 flex items-center justify-between flex-shrink-0 h-12 z-40 relative">
      <div className="flex items-center gap-4">
        <button 
            onClick={onMenuClick} 
            className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors" 
            aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isSidebarOpen}
            aria-controls="sidebar-menu"
        >
          {/* Visual change: Always show the hamburger icon regardless of sidebar state */}
          <IconMenu className="h-[18px] w-[18px]" />
        </button>
        <button onClick={onLogoClick} className="focus:outline-none focus:ring-2 focus:ring-primary rounded-md p-1 -m-1">
            {brandLogo ? <BrandLogo logoUrl={brandLogo} /> : <AnavsanLogo />}
        </button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IconSearch className="h-4 w-4 text-text-muted" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full h-8 bg-white/[0.08] border-0 text-white rounded-full pl-9 pr-3 text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-sidebar-topbar"
            />
        </div>
        <button onClick={onOpenQuickAsk} className="p-1.5 rounded-full text-primary bg-primary/20 hover:bg-primary/30 transition-colors flex items-center justify-center shrink-0 w-8 h-8" aria-label="Ask AI Assistant">
            <IconAIAgent className="h-[22px] w-[22px]" />
        </button>
        <div className="relative" ref={notificationsRef}>
            <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
              <IconBell className="h-[18px] w-[18px]" />
              {unreadCount > 0 && (
                 <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-status-error text-white text-[9px] font-bold ring-2 ring-sidebar-topbar">{unreadCount}</span>
              )}
            </button>
            <NotificationDropdown
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                notifications={notifications}
                onMarkAllAsRead={onMarkAllNotificationsAsRead}
                onViewAll={() => {
                    onNavigate('Alerts');
                    setIsNotificationsOpen(false);
                }}
            />
        </div>
        <button 
            onClick={() => onNavigate('Docs')}
            className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Help docs"
            title="Help docs"
        >
          <IconHelpCircle className="h-[18px] w-[18px]" />
        </button>

        <button 
            onClick={() => onNavigate('Support')}
            className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Support"
            title="Support"
        >
          <IconSupport className="h-[18px] w-[18px]" />
        </button>

        <div className="relative flex items-center pl-2" ref={userMenuRef}>
            <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors" aria-haspopup="true" aria-expanded={isUserMenuOpen} aria-label="User menu">
                <IconUser className="h-[18px] w-[18px]" />
            </button>
            {isUserMenuOpen && (
                <div className="origin-top-right absolute right-0 top-full mt-2 w-72 rounded-[16px] shadow-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 z-50 p-2.5 flex flex-col transition-all duration-200 animate-in fade-in slide-in-from-top-2">
                    {/* Modern User Profile Header Card */}
                    <div className="px-3 py-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-3 mb-1.5 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5829D6] to-[#8B5CF6] dark:from-purple-600 dark:to-indigo-500 flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
                            S
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-black text-slate-800 dark:text-white tracking-wide uppercase truncate">Sameer</span>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 truncate mt-0.5">sameer@anavsan.com</span>
                            <span className="inline-block w-max mt-1 text-[8.5px] font-black tracking-widest text-[#5829D6] dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-100/50 dark:border-purple-900/60 rounded px-1.5 py-0.5 uppercase">
                                Administrator
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-0.5" role="menu" aria-orientation="vertical">
                        {/* User Information */}
                        <button 
                            onClick={() => { onNavigate('Profile', 'User information'); setIsUserMenuOpen(false); }} 
                            className="group w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg transition-all text-left" 
                            role="menuitem"
                        >
                            <User className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-[#5829D6] dark:group-hover:text-purple-400 transition-colors" />
                            <span>User information</span>
                        </button>

                        {/* Notification Preferences */}
                        <button 
                            onClick={() => { onNavigate('Profile', 'Notification preferences'); setIsUserMenuOpen(false); }} 
                            className="group w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg transition-all text-left" 
                            role="menuitem"
                        >
                            <Bell className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-[#5829D6] dark:group-hover:text-purple-400 transition-colors" />
                            <span>Notification preferences</span>
                        </button>

                        {/* Billing & Plans */}
                        <button 
                            onClick={() => { onNavigate('Profile', 'Billing & plans'); setIsUserMenuOpen(false); }} 
                            className="group w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg transition-all text-left" 
                            role="menuitem"
                        >
                            <CreditCard className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-[#5829D6] dark:group-hover:text-purple-400 transition-colors" />
                            <span>Billing & plans</span>
                        </button>

                        {/* Change Password */}
                        <button 
                            onClick={() => { onNavigate('Profile', 'Change password'); setIsUserMenuOpen(false); }} 
                            className="group w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg transition-all text-left" 
                            role="menuitem"
                        >
                            <Lock className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-[#5829D6] dark:group-hover:text-purple-400 transition-colors" />
                            <span>Change password</span>
                        </button>

                        {/* Display Primary Unit Segmented Toggle */}
                        <div className="flex flex-col gap-2 px-3 py-2.5 border-t border-slate-100 dark:border-slate-800/80 my-1.5">
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Display unit</span>
                            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 p-1 rounded-xl flex items-center w-full">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onDisplayModeChange('credits'); }}
                                    className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all text-center ${displayMode === 'credits' ? 'bg-[#5829D6] dark:bg-purple-600 text-white shadow-xs font-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                                >
                                    Credits
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onDisplayModeChange('cost'); }}
                                    className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all text-center ${displayMode === 'cost' ? 'bg-[#5829D6] dark:bg-purple-600 text-white shadow-xs font-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                                >
                                    USD
                                </button>
                            </div>
                        </div>

                        {/* Logout option with active states */}
                        <div className="border-t border-slate-100 dark:border-slate-800/80 my-1"></div>
                        <button 
                            onClick={() => { onLogout(); setIsUserMenuOpen(false); }} 
                            className="group w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all text-left" 
                            role="menuitem"
                        >
                            <LogOut className="h-4 w-4 text-red-500 dark:text-red-400 group-hover:translate-x-0.5 transition-transform" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </header>
  );
};


export default Header;
