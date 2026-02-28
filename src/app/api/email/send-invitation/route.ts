import { NextRequest, NextResponse } from "next/server";
import { sendInvitationEmail } from "@/lib/email";
import { generateInvitationToken } from "@/lib/invitation-token";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, tenantId, role } = body;

    console.log("[send-invitation] Received request:", { email, role, tenantId });

    // Validate required fields
    if (!email || !tenantId || !role) {
      console.error("[send-invitation] Missing required fields");
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

    // Generate secure invitation token
    console.log("[send-invitation] Generating secure token...");
    const token = await generateInvitationToken({ tenantId, role, email });

    // Build invitation link with token
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (request.headers.get("host")
        ? `${request.headers.get("x-forwarded-proto") || "http"}://${request.headers.get("host")}`
        : "http://localhost:3000");
    const inviteLink = `${baseUrl}/register?token=${encodeURIComponent(token)}`;

    console.log("[send-invitation] Invitation link generated (token-based)");

    // Send invitation email
    console.log("[send-invitation] Calling sendInvitationEmail...");
    const success = await sendInvitationEmail(email, inviteLink, role);

    if (!success) {
      console.error("[send-invitation] Failed to send email");
      return NextResponse.json(
        { error: "Failed to send invitation email. Please check your Brevo API configuration." },
        { status: 500 },
      );
    }

    console.log("[send-invitation] ✅ Email sent successfully to:", email);
    return NextResponse.json(
      { message: "Invitation email sent successfully", email, inviteLink },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in send-invitation endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
