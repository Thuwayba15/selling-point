import { NextRequest, NextResponse } from "next/server";
import { sendInvitationEmail } from "@/lib/email";
import { generateInvitationToken } from "@/lib/invitation-token";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, tenantId, role } = body;

    // Validate required fields
    if (!email || !tenantId || !role) {
      return NextResponse.json(
        { error: "Missing required fields: email, tenantId, role" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }
    const token = await generateInvitationToken({ tenantId, role, email });

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (request.headers.get("host")
        ? `${request.headers.get("x-forwarded-proto") || "http"}://${request.headers.get("host")}`
        : "http://localhost:3000");
    const inviteLink = `${baseUrl}/register?token=${encodeURIComponent(token)}`;

    const success = await sendInvitationEmail(email, inviteLink, role);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to send invitation email. Please check your Brevo API configuration." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Invitation email sent successfully", email, inviteLink },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
