import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe } from "../../../../lib/stripe";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = (await headers()).get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return new NextResponse("Missing webhook configuration", { status: 400 });
  }

  try {
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(rawBody, signature, secret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("Training Day Games registration paid", session.id, session.metadata);
      // Next step: persist/confirm the paid registration in Postgres.
    }

    return NextResponse.json({ received: true });
  } catch {
    return new NextResponse("Invalid webhook signature", { status: 400 });
  }
}
