import { activateUserSubscription, failUserPayment } from '@/app/service/subscription/subscription.service';
import { BillingPeriod } from '@/app/api/model/enums/subscription';
import { prisma } from '@/app/_lib/prisma';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('x-razorpay-signature');
    if (!signature) {
      return NextResponse.json(
        { success: false, message: 'Missing webhook signature' },
        { status: 400 },
      );
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('RAZORPAY_WEBHOOK_SECRET is not configured');
      return NextResponse.json(
        { success: false, message: 'Webhook signature secret is not configured' },
        { status: 500 },
      );
    }

    const rawBody = await request.text();
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');
    const signatureBuffer = Buffer.from(signature, 'utf-8');

    let isSignatureValid = false;
    if (expectedBuffer.length === signatureBuffer.length) {
      isSignatureValid = crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
    }

    if (!isSignatureValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid webhook signature verification' },
        { status: 400 },
      );
    }

    const eventData = JSON.parse(rawBody);
    const eventName = eventData.event;

    console.log(`[Razorpay Webhook Received] Event: ${eventName}`);

    if (eventName === 'payment.captured' || eventName === 'order.paid') {
      const paymentEntity = eventData.payload.payment?.entity;
      if (!paymentEntity) {
        return NextResponse.json(
          { success: false, message: 'Payment entity payload is missing' },
          { status: 400 },
        );
      }

      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;
      const amount = paymentEntity.amount / 100;
      const currency = paymentEntity.currency;
      const notes = paymentEntity.notes || {};

      if (!orderId || !notes.userId || !notes.planSlug || !notes.billingPeriod) {
        console.warn('[Razorpay Webhook] Missing order details or metadata in notes:', paymentEntity);
        return NextResponse.json(
          { success: false, message: 'Missing order details or metadata notes' },
          { status: 400 },
        );
      }

      // Check if payment is already processed
      const existingPayment = await prisma.payment.findUnique({
        where: { razorpayOrderId: orderId },
      });

      if (existingPayment?.status === 'COMPLETED') {
        console.log(`[Razorpay Webhook] Order ${orderId} already completed. Skipping.`);
        return NextResponse.json({ received: true });
      }

      try {
        await activateUserSubscription({
          userId: notes.userId,
          planSlug: notes.planSlug,
          billingPeriod: notes.billingPeriod as BillingPeriod,
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          amount,
          currency,
        });
      } catch (err: any) {
        if (err.message === 'PAYMENT_ALREADY_COMPLETED') {
          return NextResponse.json({ received: true });
        }
        throw err;
      }

      console.log(`[Razorpay Webhook] Successfully processed and activated plan: ${notes.planSlug} for user: ${notes.userId}`);
    } else if (eventName === 'payment.failed') {
      const paymentEntity = eventData.payload.payment?.entity;
      if (paymentEntity && paymentEntity.order_id) {
        await failUserPayment(paymentEntity.order_id);
        console.log(`[Razorpay Webhook] Payment failed for order: ${paymentEntity.order_id}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[POST /api/webhooks/razorpay]', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error processing webhook' },
      { status: 500 },
    );
  }
}
