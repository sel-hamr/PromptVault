import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Handle webhooks (Stripe, Resend, etc.)
  return NextResponse.json({ received: true });
}
