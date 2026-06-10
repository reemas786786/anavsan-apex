import React, { useState, useEffect } from 'react';
import { Widget, Account } from '../types';
import Modal from './Modal';

interface WidgetSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  widget: Omit<Widget, 'id' | 'dataSource'>;
  accounts: Account[];
  onConfirm: (dataSource: Widget['dataSource']) => void;
}

const WidgetSetupModal: React.FC<WidgetSetupModalProps> = ({ isOpen, onClose, widget, accounts, onConfirm }) => {
  const [dataSourceType, setDataSourceType] = useState<'overall' | 'account'>('overall');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');

  useEffect(() => {
    // Set a default account when the modal opens and accounts are available
    if (isOpen && accounts.length > 0) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [isOpen, accounts]);

  const handleConfirm = () => {
    if (dataSourceType === 'overall') {
      onConfirm({ type: 'overall' });
    } else {
      if (!selectedAccountId) {
        // Simple validation: don't allow confirming without an account selected
        alert('Please select an account.');
        return;
      }
      onConfirm({ type: 'account', accountId: selectedAccountId });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Configure: ${widget.title}`}>
      <div className="p-8 space-y-6">
        <div>
          <label className="block text-sm font-bold text-text-secondary mb-2">DATA SOURCE</label>
          <p className="text-sm text-text-secondary mb-3">
            Choose whether this widget should show aggregated data from all accounts or data from a single specific account.
          </p>
          <div className="flex items-center bg-gray-200 rounded-full p-1">
            <button
              onClick={() => setDataSourceType('overall')}
              className={`w-1/2 px-3 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                dataSourceType === 'overall' ? 'bg-white shadow-sm text-text-primary' : 'text-text-secondary'
              }`}
            >
              Overall Metrics
            </button>
            <button
              onClick={() => setDataSourceType('account')}
              className={`w-1/2 px-3 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                dataSourceType === 'account' ? 'bg-white shadow-sm text-text-primary' : 'text-text-secondary'
              }`}
              disabled={accounts.length === 0}
            >
              Specific Account
            </button>
          </div>
        </div>

        {dataSourceType === 'account' && (
          <div>
            <label htmlFor="account-select" className="block text-sm font-medium text-text-secondary mb-1">
              Select an account
            </label>
            <select
              id="account-select"
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg"
              aria-label="Select specific account"
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 bg-background border-t border-border-color flex justify-end items-center gap-3 flex-shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-semibold px-4 py-2 rounded-full bg-surface-hover text-primary hover:bg-primary/20 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="px-4 py-2 text-sm font-semibold text-white rounded-full shadow-sm bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Add Widget
        </button>
      </div>
    </Modal>
  );
};

export default WidgetSetupModal;