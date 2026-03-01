import { useState, useEffect } from "react";
import { Form, Tabs, message, Spin } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthActions } from "@/providers/auth";
import type { RegisterPayload, UserRole } from "@/providers/auth";
import type { RegisterFormValues } from "@/types/forms";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import AuthTitle from "./AuthTitle";
import AuthLink from "./AuthLink";
import { useStyles } from "./style";

type RegistrationMode = "default" | "new" | "invite";

const RegisterForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuthActions();
  const { styles } = useStyles();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [verifyingToken, setVerifyingToken] = useState(false);

  // State for invite data (from token)
  const [inviteData, setInviteData] = useState<{
    tenantId: string;
    role: UserRole;
    email: string;
  } | null>(null);

  // Check for invitation token
  const inviteToken = searchParams.get("token");
  const hasInviteToken = !!inviteToken;

  // Auto-set mode to "invite" if invite token exists
  const [mode, setMode] = useState<RegistrationMode>("default");

  // Verify token and load invite data
  useEffect(() => {
    if (inviteToken) {
      verifyInvitationToken(inviteToken);
    }
  }, [inviteToken]);

  const verifyInvitationToken = async (token: string) => {
    setVerifyingToken(true);
    try {
      const response = await fetch(`/api/invitations/verify?token=${encodeURIComponent(token)}`);

      if (!response.ok) {
        message.error("Invalid or expired invitation link");
        return;
      }

      const data = await response.json();

      setInviteData({
        tenantId: data.tenantId,
        role: data.role,
        email: data.email,
      });

      setMode("invite");

      // Pre-fill email
      form.setFieldValue("email", data.email);

      message.success("Invitation verified! Please complete your registration.");
    } catch (error) {
      message.error("Failed to verify invitation token");
    } finally {
      setVerifyingToken(false);
    }
  };

  const onFinish = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      if (mode === "invite" && !inviteData) {
        message.error(
          "An invite is required to join an organization. Please check your email for an invite link.",
        );
        setLoading(false);
        return;
      }

      const payload: RegisterPayload = {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
      };

      if (mode === "new") {
        payload.tenantName = values.tenantName;
      } else if (mode === "invite" && inviteData) {
        payload.tenantId = inviteData.tenantId;
        payload.role = inviteData.role;
      }

      const success = await register(payload);
      if (success) {
        message.success("Registration successful!");
        window.location.href = "/";
      } else {
        message.error("Registration failed. Please try again.");
      }
    } catch (error) {
      message.error("An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while verifying token
  if (verifyingToken) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <Spin size="large" />
        <p style={{ marginTop: 16, color: "#666" }}>Verifying invitation...</p>
      </div>
    );
  }

  const tabItems = [
    {
      key: "default",
      label: "Demo Registration",
      children: (
        <div style={{ marginTop: 20 }}>
          <p style={{ color: "#666", marginBottom: 20 }}>
            Register with our shared demo organization to explore the platform.
          </p>
        </div>
      ),
    },
    {
      key: "new",
      label: "Create Organization",
      children: (
        <Form.Item
          label="Organization Name"
          name="tenantName"
          rules={[{ required: true, message: "Please enter your organization name" }]}
          style={{ marginTop: 20 }}
        >
          <AuthInput placeholder="Acme Corp" />
        </Form.Item>
      ),
    },
    {
      key: "invite",
      label: "Join via Invite",
      children: (
        <div style={{ marginTop: 20 }}>
          {inviteData ? (
            <div>
              <p style={{ color: "#52c41a", marginBottom: 10 }}>✓ Your invitation is valid!</p>
              <p style={{ color: "#666", marginBottom: 20 }}>
                You'll be joining as: <strong>{inviteData.role}</strong>
              </p>
            </div>
          ) : (
            <p style={{ color: "#666", marginBottom: 20 }}>
              Check your email for an invite link to join an organization.
            </p>
          )}
        </div>
      ),
    },
  ];

  return (
    <Form form={form} layout="vertical" name="register" onFinish={onFinish}>
      <AuthTitle>Register</AuthTitle>

      <Tabs
        activeKey={mode}
        onChange={(key) => setMode(key as RegistrationMode)}
        items={tabItems}
      />

      <Form.Item
        label="First Name"
        name="firstName"
        rules={[{ required: true, message: "Please enter your first name" }]}
        style={{ marginTop: 20 }}
      >
        <AuthInput placeholder="John" />
      </Form.Item>

      <Form.Item
        label="Last Name"
        name="lastName"
        rules={[{ required: true, message: "Please enter your last name" }]}
      >
        <AuthInput placeholder="Doe" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
      >
        <AuthInput placeholder="john@example.com" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, min: 6, message: "Password must be at least 6 characters" }]}
      >
        <AuthInput type="password" placeholder="••••••" />
      </Form.Item>

      <Form.Item label="Phone Number (Optional)" name="phoneNumber">
        <AuthInput placeholder="+1234567890" />
      </Form.Item>

      <AuthButton type="primary" htmlType="submit" block loading={loading}>
        Register
      </AuthButton>

      <div className={styles.registerNote}>
        Already have an account? <AuthLink href="/login">Login</AuthLink>
      </div>
    </Form>
  );
};

export default RegisterForm;
