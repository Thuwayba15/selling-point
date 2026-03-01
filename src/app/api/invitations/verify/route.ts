import { NextRequest, NextResponse } from "next/server";
import { verifyInvitationToken } from "@/lib/invitation-token";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const payload = await verifyInvitationToken(token);

    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired invitation token" }, { status: 401 });
    }

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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
