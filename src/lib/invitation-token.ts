/**
 * Invitation Token Utility
 * 
 * Generates and verifies secure JWT tokens for invitation links.
 * This prevents users from manipulating tenantId and role in the URL.
 */

import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.INVITATION_JWT_SECRET || "your-secret-key-change-in-production";
const secret = new TextEncoder().encode(JWT_SECRET);

// Token expires in 7 days
const TOKEN_EXPIRATION = "7d";

export interface InvitationTokenPayload {
  tenantId: string;
  role: string;
  email: string;
}

/**
 * Generate a secure invitation token
 */
export async function generateInvitationToken(
  payload: InvitationTokenPayload,
): Promise<string> {
  try {
    const token = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(TOKEN_EXPIRATION)
      .sign(secret);

    return token;
  } catch (error) {
    console.error("[invitation-token] Error generating token:", error);
    throw new Error("Failed to generate invitation token");
  }
}

/**
 * Verify and decode an invitation token
 */
export async function verifyInvitationToken(
  token: string,
): Promise<InvitationTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);

    // Validate payload structure
    if (
      typeof payload.tenantId !== "string" ||
      typeof payload.role !== "string" ||
      typeof payload.email !== "string"
    ) {
      console.error("[invitation-token] Invalid token payload structure");
      return null;
    }

    return {
      tenantId: payload.tenantId,
      role: payload.role,
      email: payload.email,
    };
  } catch (error) {
    console.error("[invitation-token] Error verifying token:", error);
    return null;
  }
}
