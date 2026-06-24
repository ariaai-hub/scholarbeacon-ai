import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

// Lazily create Stripe client only when needed
function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    typescript: true,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET ?? ""
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = event.data.object as any;
        const userId = session.metadata?.userId;
        if (userId && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          ) as any;
          const plan = subscription.items?.data[0]?.price?.id;
          await prisma.subscription.upsert({
            where: { userId },
            create: {
              userId,
              stripeSubscriptionId: subscription.id,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              plan: mapPriceToPlan(plan) as any,
              status: "ACTIVE",
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              annual: subscription.items?.data[0]?.price?.recurring?.interval === "year",
            },
            update: {
              stripeSubscriptionId: subscription.id,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              plan: mapPriceToPlan(plan) as any,
              status: "ACTIVE",
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription = event.data.object as any;
        const subRecord = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });
        if (subRecord) {
          const plan = subscription.items?.data[0]?.price?.id;
          await prisma.subscription.update({
            where: { userId: subRecord.userId },
            data: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              plan: mapPriceToPlan(plan) as any,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              status: mapStripeStatus(subscription.status) as any,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription = event.data.object as any;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { plan: "FREE", status: "CANCELED" },
        });
        break;
      }

      case "invoice.payment_failed": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = event.data.object as any;
        const sub = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: invoice.subscription as string },
        });
        if (sub) {
          await prisma.subscription.update({
            where: { userId: sub.userId },
            data: { status: "PAST_DUE" },
          });
        }
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

function mapPriceToPlan(priceId: string | undefined): string {
  if (priceId === process.env.STRIPE_PRICE_INDIVIDUAL_MONTHLY) return "INDIVIDUAL_MONTHLY";
  if (priceId === process.env.STRIPE_PRICE_FAMILY_MONTHLY) return "FAMILY_MONTHLY";
  if (priceId === process.env.STRIPE_PRICE_INDIVIDUAL_ANNUAL) return "INDIVIDUAL_ANNUAL";
  if (priceId === process.env.STRIPE_PRICE_FAMILY_ANNUAL) return "FAMILY_ANNUAL";
  return "FREE";
}

function mapStripeStatus(status: string): "ACTIVE" | "CANCELED" | "PAST_DUE" | "INCOMPLETE" {
  switch (status) {
    case "active": return "ACTIVE";
    case "canceled": return "CANCELED";
    case "past_due": return "PAST_DUE";
    case "incomplete": return "INCOMPLETE";
    default: return "ACTIVE";
  }
}
