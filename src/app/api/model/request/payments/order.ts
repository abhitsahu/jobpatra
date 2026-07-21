import { BillingPeriod } from '@/app/api/model/enums/subscription';

export interface CreateOrderRequest {
  planSlug: string;
  billingPeriod: BillingPeriod;
  currency?: 'INR' | 'USD';
}

export interface VerifyPaymentRequest {
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  planSlug: string;
  billingPeriod: BillingPeriod;
}
