
import React, { useRef, useEffect } from 'react';
import { IconClose, IconSparkles } from '../constants';

interface AIQuickAskPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAgent: () => void;
}

const AIQuickAskPanel: React.FC<AIQuickAskPanelProps> = ({ isOpen, onClose, onOpenAgent }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };
    if (isOpen) {
        document.addEventListener('keydown', handleKeyDown);
        setTimeout(() => panelRef.current?.focus(), 50); // Small delay to ensure panel is rendered
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);


  return (
    <div 
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'visible' : 'invisible'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-quick-ask-title"
    >
        <div 
            className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
            aria-hidden="true"
        />
        <div
            ref={panelRef}
            tabIndex={-1}
            className={`absolute top-0 right-0 h-full w-full max-w-md bg-surface shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} focus:outline-none`}
        >
            <header className="p-4 flex items-center justify-between border-b border-border-color flex-shrink-0">
                <div className="flex items-center gap-2">
                    <IconSparkles className="w-6 h-6 text-primary" />
                    <h2 id="ai-quick-ask-title" className="text-lg font-semibold text-text-strong">Contextual Assistant</h2>
                </div>
                <button onClick={onClose} className="p-1 rounded-full text-text-secondary hover:bg-surface-hover">
                    <IconClose className="w-5 h-5" />
                </button>
            </header>
            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                <div className="text-sm text-center text-text-muted p-4 bg-surface-nested rounded-lg">Ask a question about the current view to get quick insights.</div>
            </div>
            <footer className="p-4 border-t border-border-color flex-shrink-0">
                <div className="relative">
                    <input
                    type="text"
                    placeholder="e.g., Which of these is most costly?"
                    className="w-full bg-input-bg border border-border-color rounded-full py-2.5 pl-4 pr-10 text-sm focus:ring-primary focus:border-primary"
                    />
                </div>
                <button onClick={onOpenAgent} className="mt-3 text-xs text-link hover:underline text-center w-full">
                    Want a deeper analysis? → Open in AI Agent
                </button>
            </footer>
        </div>
    </div>
  );
};

export default AIQuickAskPanel;
