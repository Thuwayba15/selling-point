import { useState } from "react";
import { Form, Radio, message } from "antd";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@/providers/auth";
import type { RegisterPayload } from "@/providers/auth";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import AuthTitle from "./AuthTitle";
import AuthLink from "./AuthLink";
import { useStyles } from "./style";

type RegistrationMode = "new" | "join" | "default";

const RegisterForm = () => {
  const router = useRouter();
  const { register } = useAuthActions();
  const { styles } = useStyles();
  const [form] = Form.useForm();
  const [mode, setMode] = useState<RegistrationMode>("default");
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload: RegisterPayload = {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
      };

      if (mode === "new") {
        payload.tenantName = values.tenantName;
      } else if (mode === "join") {
        payload.tenantId = values.tenantId;
        payload.role = values.role;
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

  return (
    <Form form={form} layout="vertical" name="register" onFinish={onFinish}>
      <AuthTitle>Register</AuthTitle>

      <Form.Item label="Registration Type">
        <Radio.Group value={mode} onChange={(e) => setMode(e.target.value)}>
          <Radio value="default">Default (Shared Demo)</Radio>
          <Radio value="new">Create New Organisation</Radio>
          <Radio value="join">Join Existing Organisation</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        label="First Name"
        name="firstName"
        rules={[{ required: true, message: "Please enter your first name" }]}
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

      <Form.Item
        label="Phone Number (Optional)"
        name="phoneNumber"
      >
        <AuthInput placeholder="+1234567890" />
      </Form.Item>

      {mode === "new" && (
        <Form.Item
          label="Organisation Name"
          name="tenantName"
          rules={[{ required: true, message: "Please enter your organisation name" }]}
        >
          <AuthInput placeholder="Acme Corp" />
        </Form.Item>
      )}

      {mode === "join" && (
        <>
          <Form.Item
            label="Organisation ID (Tenant ID)"
            name="tenantId"
            rules={[{ required: true, message: "Please enter the organisation ID" }]}
          >
            <AuthInput placeholder="00000000-0000-0000-0000-000000000000" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role" }]}
            initialValue="SalesRep"
          >
            <Radio.Group>
              <Radio value="SalesRep">Sales Rep</Radio>
              <Radio value="SalesManager">Sales Manager</Radio>
              <Radio value="BusinessDevelopmentManager">Business Development Manager</Radio>
            </Radio.Group>
          </Form.Item>
        </>
      )}

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