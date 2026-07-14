import api from '@/lib/axios';
import { ApiEnvelope } from '@/types/checkout';
import { PaymentCreateResponse, PaymentVerifyResponse } from '@/types/payment';

/**
 * Creates a Razorpay order for an existing checkout order.
 * Call this after POST /checkout/initiate returns an orderId.
 */
export async function createPaymentOrder(
  orderId: number
): Promise<ApiEnvelope<PaymentCreateResponse>> {
  const res = await api.post<ApiEnvelope<PaymentCreateResponse>>('/payment/create-order', {
    orderId,
  });
  return res.data;
}

/**
 * Verifies the Razorpay payment signature with the backend after the
 * Razorpay modal reports a successful payment.
 */
export async function verifyPayment(payload: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<ApiEnvelope<PaymentVerifyResponse>> {
  const res = await api.post<ApiEnvelope<PaymentVerifyResponse>>('/payment/verify', payload);
  return res.data;
}
