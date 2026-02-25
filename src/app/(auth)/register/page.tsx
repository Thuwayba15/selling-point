"use client";

import { Button, Card, Form, Input, Space, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuthActions } from "@/providers/auth";

const { Title, Text } = Typography;

const RegisterPage = () => {
  const router = useRouter();
  const { register } = useAuthActions();

  const onFinish = async (values: { email: string; password: string }) => {
    const ok = await register(values.email, values.password);
    if (ok) router.replace("/");
  };

  return (
    <Card>
      <Space orientation="vertical" style={{ width: "100%" }} size="middle">
        <Title level={3}>Register</Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Create account
          </Button>
        </Form>

        <Text>
          Have an account? <Link href="/login">Login</Link>
        </Text>
      </Space>
    </Card>
  );
};

export default RegisterPage;