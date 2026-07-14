// Razorpay payment types

export interface PaymentCreateResponse {
  orderId: number;
  orderNumber: string;
  razorpayOrderId: string;
  amount: number; // in paise
  currency: string; // "INR"
  orderTotal: number; // in rupees
}

export type PaymentStatus = 'PAID' | 'FAILED' | 'PENDING' | 'REFUNDED' | 'PARTIALLY_REFUNDED';

export interface PaymentVerifyResponse {
  verified: boolean;
  orderNumber: string;
  paymentStatus: PaymentStatus;
  razorpayPaymentId: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes: Record<string, string>;
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}
