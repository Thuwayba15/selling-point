"use client";

import { useState } from "react";
import { Form, message } from "antd";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@/providers/auth";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import AuthTitle from "@/components/auth/AuthTitle";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import AuthLink from "@/components/auth/AuthLink";
import { useStyles } from "@/components/auth/style";

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuthActions();
  const { styles } = useStyles();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const ok = await login(values.email, values.password);
      if (ok) {
        message.success("Login successful!");
        window.location.href = "/";
      } else {
        message.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      message.error("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <Form layout="vertical" name="login" onFinish={onFinish}>
          <AuthTitle>Login</AuthTitle>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
          >
            <AuthInput placeholder="admin@salesautomation.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, min: 6, message: "Password must be at least 6 characters" }]}
          >
            <AuthInput type="password" placeholder="••••••" />
          </Form.Item>

          <AuthButton type="primary" htmlType="submit" block loading={loading}>
            Sign in
          </AuthButton>

          <div className={styles.registerNote}>
            No account? <AuthLink href="/register">Register</AuthLink>
          </div>
        </Form>
      </AuthCard>
    </AuthLayout>
  );
};

export default LoginPage;