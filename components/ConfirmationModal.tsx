import React, { useEffect, useRef } from 'react';
import { IconClose } from '../constants';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  confirmVariant?: 'danger' | 'warning' | 'primary';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmVariant = 'primary' }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
        const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        firstElement.focus();

        const handleTabKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        };

        const currentModalRef = modalRef.current;
        currentModalRef?.addEventListener('keydown', handleTabKeyPress);
        return () => {
            currentModalRef?.removeEventListener('keydown', handleTabKeyPress);
        };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-hover focus:ring-primary',
    warning: 'bg-status-warning hover:bg-status-warning/90 focus:ring-status-warning',
    danger: 'bg-status-error hover:bg-status-error/90 focus:ring-status-error',
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modal-title"
    >
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true"></div>
      
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative bg-surface rounded-2xl w-full max-w-lg m-4 transform transition-all duration-300 ease-in-out scale-100 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 flex items-start justify-between flex-shrink-0">
          <h2 id="modal-title" className="text-xl font-semibold text-text-primary">{title}</h2>
          <button
            type="button"
            className="p-1 -m-1 rounded-full text-text-secondary hover:bg-surface-hover hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={onClose}
            aria-label="Close modal"
          >
            <IconClose className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <p className="text-sm text-text-secondary">{message}</p>
        </div>
        
        {/* Footer */}
        <div className="px-6 pb-6 flex justify-end items-center gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose} 
            className="text-sm font-semibold px-6 py-2.5 rounded-full bg-button-secondary-bg text-primary hover:bg-button-secondary-bg-hover transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm} 
            className={`px-6 py-2.5 text-sm font-semibold text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantClasses[confirmVariant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;