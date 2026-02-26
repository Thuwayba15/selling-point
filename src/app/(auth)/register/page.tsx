"use client";

import { useRouter } from "next/navigation";
import { useAuthActions } from "@/providers/auth";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import RegisterForm from "@/components/auth/RegisterForm";

const RegisterPage = () => {
  const router = useRouter();
  const { register } = useAuthActions();

  return (
    <AuthLayout>
      <AuthCard>
        <RegisterForm />
      </AuthCard>
    </AuthLayout>
  );
};

export default RegisterPage;