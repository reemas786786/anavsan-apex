
import React, { useEffect, useRef } from 'react';
import { IconClose } from '../constants';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  isFullScreen?: boolean;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose, title, description, children, isFullScreen = false }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!isOpen || !panel) return;

    const focusableElements = panel.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }

        if (event.key === 'Tab') {
            if (focusableElements.length === 1) {
                event.preventDefault();
                return;
            }
            if (event.shiftKey) { // Shift+Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    event.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    event.preventDefault();
                }
            }
        }
    };
    
    document.addEventListener('keydown', handleKeyDown);

    if (firstElement) {
      firstElement.focus();
    } else {
      panel.focus();
    }

    return () => {
        document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);


  return (
    <div 
        ref={panelRef}
        tabIndex={-1}
        className={`fixed inset-0 z-[60] overflow-hidden transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`} 
        role="dialog" 
        aria-modal="true"
    >
      {/* Overlay - Always starts below header */}
      <div 
        className={`fixed top-12 inset-x-0 bottom-0 bg-black/30 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
        onClick={onClose}
      ></div>

      {/* Side Panel Container - Fixed to top-12 to keep Top Bar visible */}
      <div className={`fixed top-12 bottom-0 ${isFullScreen ? 'inset-x-0' : 'right-0 max-w-full pl-10'} flex transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className={`w-screen ${isFullScreen ? '' : 'max-w-xl'}`}>
          <div className="flex h-full flex-col bg-white">
            {/* Header - Shown for standard panels, hidden if Flow handles its own header (like AddAccount) */}
            {!isFullScreen && (
              <div className="bg-white px-8 py-6 flex-shrink-0 border-b border-border-light">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-sidebar-topbar tracking-tight" id="slide-over-title">
                      {title}
                    </h2>
                    {description && (
                      <p className="mt-1 text-sm text-text-secondary">
                        {description}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-2 text-primary hover:text-primary-hover transition-all font-bold text-sm group"
                    onClick={onClose}
                  >
                    <span>Close panel</span>
                    <div className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-primary group-hover:bg-primary/5 transition-all">
                      <IconClose className="h-4 w-4" />
                    </div>
                  </button>
                </div>
              </div>
            )}
            
            {/* Content Container */}
            <div className="relative flex-1 flex flex-col min-h-0 overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
