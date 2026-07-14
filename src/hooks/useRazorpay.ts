import { useCallback } from 'react';
import { RazorpayOptions, RazorpaySuccessResponse } from '@/types/payment';

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Razorpay is not available in server environment'));
      return;
    }

    if (window.Razorpay) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`,
    );

    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load Razorpay SDK')), {
        once: true,
      });
      return;
    }

    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.body.appendChild(script);
  });
}

export interface RazorpayResult {
  /** Payment completed and handler was called with Razorpay response. */
  type: 'success';
  response: RazorpaySuccessResponse;
}

export interface RazorpayDismissResult {
  /** User closed the modal without paying. */
  type: 'dismissed';
}

export type RazorpayOutcome = RazorpayResult | RazorpayDismissResult;

/**
 * Opens the Razorpay checkout modal and returns a promise that resolves once
 * the user either completes payment OR dismisses the modal.
 *
 * This lets the caller keep "isSubmitting" true for the full lifecycle of the
 * modal and handle success / dismiss in a single try/catch block.
 */
export function useRazorpay() {
  const openCheckout = useCallback(
    (
      options: Omit<RazorpayOptions, 'handler' | 'modal'>,
    ): Promise<RazorpayOutcome> => {
      return new Promise(async (resolve, reject) => {
        try {
          await loadScript();
        } catch (err) {
          reject(err);
          return;
        }

        const razorpayOptions: RazorpayOptions = {
          ...options,
          handler: (response: RazorpaySuccessResponse) => {
            resolve({ type: 'success', response });
          },
          modal: {
            ondismiss: () => {
              resolve({ type: 'dismissed' });
            },
          },
        };

        try {
          const rzp = new window.Razorpay(razorpayOptions);
          rzp.open();
        } catch (err) {
          reject(err);
        }
      });
    },
    [],
  );

  return { openCheckout };
}
