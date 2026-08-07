import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "../../../lib/stripe";

const teammateSchema = z.object({
  id: z.number(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  gender: z.string().min(1),
  shirtSize: z.string().min(1),
  gym: z.string().optional(),
});

const schema = z.object({
  division: z.enum(["RX", "Intermediate", "Scaled"]),
  registrationType: z.enum(["INDIVIDUAL", "TEAM"]),
  teamName: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  gender: z.string().min(1),
  birthDate: z.string().min(1),
  gym: z.string().optional(),
  emergencyName: z.string().min(1),
  emergencyPhone: z.string().min(1),
  shirtSize: z.string().optional(),
  waiver: z.literal("on"),
  teammates: z.array(teammateSchema).max(4).default([]),
}).superRefine((data, ctx) => {
  if (data.registrationType === "TEAM") {
    if (!data.teamName?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["teamName"], message: "Team name is required." });
    }
    if (data.teammates.length < 1) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["teammates"], message: "Add at least one teammate." });
    }
  }
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
    const rosterSize = payload.registrationType === "TEAM" ? payload.teammates.length + 1 : 1;

    const teammateMetadata = Object.fromEntries(
      payload.teammates.flatMap((athlete, index) => [
        [`athlete${index + 2}_name`, `${athlete.firstName} ${athlete.lastName}`],
        [`athlete${index + 2}_email`, athlete.email],
        [`athlete${index + 2}_gender`, athlete.gender],
        [`athlete${index + 2}_shirt`, athlete.shirtSize],
        [`athlete${index + 2}_gym`, athlete.gym || ""],
      ])
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: payload.email,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: prices[payload.division],
          product_data: {
            name: payload.registrationType === "TEAM"
              ? `Training Day Games — ${payload.division} Team`
              : `Training Day Games — ${payload.division}`,
            description: payload.registrationType === "TEAM"
              ? `${payload.teamName} · ${rosterSize} athletes`
              : `${payload.firstName} ${payload.lastName}`,
          },
        },
      }],
      metadata: {
        registrationType: payload.registrationType,
        division: payload.division,
        teamName: payload.teamName || "",
        rosterSize: String(rosterSize),
        captainName: `${payload.firstName} ${payload.lastName}`,
        captainEmail: payload.email,
        captainPhone: payload.phone,
        captainGender: payload.gender,
        captainBirthDate: payload.birthDate,
        captainShirt: payload.shirtSize || "",
        gym: payload.gym || "",
        emergencyName: payload.emergencyName,
        emergencyPhone: payload.emergencyPhone,
        waiverAccepted: "true",
        ...teammateMetadata,
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to start registration. Please review the athlete information and try again." }, { status: 400 });
  }
}
