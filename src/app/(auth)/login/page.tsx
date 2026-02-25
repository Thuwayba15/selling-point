"use client";

import { Form } from "antd";
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

  const onFinish = async (values: { email: string; password: string }) => {
    const ok = await login(values.email, values.password);
    if (ok) router.replace("/");
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
            <AuthInput placeholder="Value" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, min: 6, message: "Password must be at least 6 characters" }]}
          >
            <AuthInput type="password" placeholder="Value" />
          </Form.Item>

          <AuthButton type="primary" htmlType="submit" block>
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