import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { to, subject, htmlContent, textContent } = await request.json();

    if (!to || !subject || !htmlContent) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, htmlContent" },
        { status: 400 },
      );
    }

    const result = await sendEmail({
      to,
      subject,
      htmlContent,
      textContent,
    });

    if (result) {
      return NextResponse.json({ success: true, message: "Email sent successfully" });
    } else {
      return NextResponse.json(
        { error: "Failed to send email - check Brevo configuration" },
        { status: 500 },
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
