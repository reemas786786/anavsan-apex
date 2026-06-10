import React, { useEffect, useState } from 'react';
import { IconCheckCircle, IconClose, IconInfo, IconXCircle } from '../constants';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to finish before calling onClose
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message && !isVisible) return null;

  const typeStyles = {
    success: {
      bg: 'bg-status-success',
      icon: <IconCheckCircle className="h-5 w-5 text-status-success" />,
      iconBg: 'bg-white'
    },
    error: {
      bg: 'bg-status-error',
      icon: <IconXCircle className="h-5 w-5 text-status-error" />,
      iconBg: 'bg-white'
    },
    info: {
      bg: 'bg-primary',
      icon: <IconInfo className="h-5 w-5 text-primary" />,
      iconBg: 'bg-white'
    }
  };

  const currentStyle = typeStyles[type];

  return (
    <div
      className={`fixed top-8 right-8 z-[9999] transform transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
      }`}
    >
      <div className={`${currentStyle.bg} text-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center p-2 pr-4 min-w-[300px]`}>
        <div className={`${currentStyle.iconBg} rounded-xl p-1.5 mr-3 flex-shrink-0 shadow-sm`}>
            {currentStyle.icon}
        </div>
        <p className="text-xs font-black uppercase tracking-widest flex-grow">{message}</p>
        <button onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }} className="ml-4 p-1.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all">
          <IconClose className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
