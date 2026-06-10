

import React, { useEffect, useRef } from 'react';
import { IconClose } from '../constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
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
  
  const sizeClasses = {
    md: 'max-w-lg',
    lg: 'max-w-3xl',
    xl: 'max-w-6xl',
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
        className={`relative bg-surface rounded-3xl w-full m-4 transform transition-all duration-300 ease-in-out scale-100 flex flex-col ${sizeClasses[size]}`}
        style={{maxHeight: '90vh'}}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between flex-shrink-0">
            <h2 id="modal-title" className="text-xl font-semibold text-text-primary">{title}</h2>
            <button
                type="button"
                className="p-1 rounded-full text-text-secondary hover:bg-surface-hover hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={onClose}
                aria-label="Close modal"
            >
                <IconClose className="h-6 w-6" />
            </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto">
            {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
