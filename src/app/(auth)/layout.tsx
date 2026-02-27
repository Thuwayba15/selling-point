import type { ReactNode } from "react";
import AppShell from "@/components/layout/AppShell";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <AppShell>{children}</AppShell>;
};

export default AuthLayout;
