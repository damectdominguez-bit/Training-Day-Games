import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "../../../lib/stripe";

const schema = z.object({
  division: z.enum(["RX", "Intermediate", "Scaled"]),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  gym: z.string().optional(),
  emergencyName: z.string().min(1),
  emergencyPhone: z.string().min(1),
  shirtSize: z.string().optional(),
  waiver: z.literal("on"),
});

const prices: Record<string, number> = {
  RX: 19900,
  Intermediate: 17900,
  Scaled: 15900,
};

export async function POST(req: Request) {
  try {
    const payload = schema.parse(await req.json());
    const stripe = getStripe();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: payload.email,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: prices[payload.division],
          product_data: {
            name: `Training Day Games — ${payload.division}`,
            description: `${payload.firstName} ${payload.lastName}`,
          },
        },
      }],
      metadata: {
        division: payload.division,
        firstName: payload.firstName,
        lastName: payload.lastName,
        gym: payload.gym || "",
        waiverAccepted: "true",
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to start registration." }, { status: 400 });
  }
}
