import { NextRequest, NextResponse } from "next/server";
import { verifyInvitationToken } from "@/lib/invitation-token";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    console.log("[verify-invitation] Verifying token...");

    const payload = await verifyInvitationToken(token);

    if (!payload) {
      console.error("[verify-invitation] Invalid or expired token");
      return NextResponse.json(
        { error: "Invalid or expired invitation token" },
        { status: 401 },
      );
    }

    console.log("[verify-invitation] ✅ Token verified for:", payload.email);

    return NextResponse.json(
      {
        valid: true,
        tenantId: payload.tenantId,
        role: payload.role,
        email: payload.email,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[verify-invitation] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
