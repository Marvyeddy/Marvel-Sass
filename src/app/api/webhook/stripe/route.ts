// app/api/webhook/stripe/route.ts

import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextRequest } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return new Response("Webhook Error", { status: 400 });
  }

  console.log("Received event:", event.type);

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    if (!session.subscription || !session.customer) {
      return new Response("Missing subscription or customer", { status: 400 });
    }

    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    const customerId = String(session.customer);

    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      console.error("User not found for customer ID:", customerId);
      return new Response("User not found", { status: 404 });
    }

    await prisma.subscription.create({
      data: {
        stripeSubscriptionId: subscription.id,
        userId: user.id,
        currentPeriodStart: subscription.items.data[0].current_period_start,
        currentPeriodStop: subscription.items.data[0].current_period_end,
        status: subscription.status,
        planId: subscription.items.data[0].plan.id,
        interval: String(subscription.items.data[0].plan.interval),
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    if (!session.subscription) {
      return new Response("Missing subscription", { status: 400 });
    }

    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await prisma.subscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        planId: subscription.items.data[0].plan.id,
        currentPeriodStart: subscription.items.data[0].current_period_start,
        currentPeriodStop: subscription.items.data[0].current_period_end,
        status: subscription.status,
      },
    });
  }

  return new Response(null, { status: 200 });
}
