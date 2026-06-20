'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/admin/ui/modal';

interface DeleteVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  variantSku: string;
}

export default function DeleteVariantModal({
  isOpen,
  onClose,
  onConfirm,
  variantSku,
}: DeleteVariantModalProps) {
  const [inputValue, setInputValue] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const expectedValue = `delete ${variantSku}`;
  const isMatch = inputValue.trim() === expectedValue;

  // Reset input when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setInputValue('');
      setIsDeleting(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!isMatch) return;
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md mx-4 p-6">
      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-50 dark:bg-error-500/10">
            <svg
              className="h-5 w-5 text-error-500"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 5a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 8a1 1 0 100 2 1 1 0 000-2z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Delete Variant
            </h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              This action cannot be undone. All images associated with this variant will also be
              permanently deleted.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-error-100 bg-error-50/50 px-4 py-3 dark:border-error-500/20 dark:bg-error-500/5">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            To confirm, type{' '}
            <span className="font-mono font-semibold text-error-600 dark:text-error-400">
              delete {variantSku}
            </span>{' '}
            below.
          </p>
        </div>

        <div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && isMatch && handleConfirm()}
            placeholder={`delete ${variantSku}`}
            className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 placeholder-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-600"
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!isMatch || isDeleting}
            className="px-5 py-2 rounded-lg bg-error-500 text-sm font-medium text-white hover:bg-error-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isDeleting ? 'Deleting...' : 'Delete Variant'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
