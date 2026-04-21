import { NextResponse } from "next/server";

export function POST() {
  // Handle webhooks (Stripe, Resend, etc.)
  return NextResponse.json({ received: true });
}
