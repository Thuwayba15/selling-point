/**
 * Email Service Utility
 *
 * This utility sends emails via Brevo (formerly Sendinblue)
 *
 * Setup Instructions:
 * 1. Sign up for a free account at https://www.brevo.com
 * 2. Get your API key from Settings > SMTP & API
 * 3. Add BREVO_API_KEY to your .env.local file
 * 4. Update SENDER_EMAIL below with your verified Brevo sender email
 */

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL || "noreply@selling-point.com";
const SENDER_NAME = "Selling Point";

interface SendEmailParams {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export const sendEmail = async ({
  to,
  subject,
  htmlContent,
  textContent,
}: SendEmailParams): Promise<boolean> => {
  if (!BREVO_API_KEY) {
    return false;
  }

  try {
    const payload = {
      sender: {
        name: SENDER_NAME,
        email: SENDER_EMAIL,
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      htmlContent,
      textContent: textContent || htmlContent.replace(/<[^>]*>/g, ""),
    };

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      return false;
    }

    const result = await response.json();
    return true;
  } catch (error) {
    return false;
  }
};

export const sendInvitationEmail = async (
  email: string,
  inviteLink: string,
  role: string,
): Promise<boolean> => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; margin-bottom: 20px;">You're Invited to Selling Point</h2>
      
      <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
        You've been invited to join our organization on <strong>Selling Point</strong> as a <strong>${role}</strong>.
      </p>
      
      <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
        Click the button below to accept your invitation and complete your registration:
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${inviteLink}" 
           style="background-color: #1890ff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
          Accept Invitation
        </a>
      </div>
      
      <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
        Or copy and paste this link in your browser:
      </p>
      <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all; color: #333; font-size: 12px;">
        ${inviteLink}
      </p>
      
      <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
        This invitation link will remain valid for 7 days. If you have any questions, please contact your organization administrator.
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "You're Invited to Selling Point",
    htmlContent,
  });
};
