import type { ReactNode } from "react";
import { ProtectedShell } from "@/components/layout/ProtectedShell";

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  return <ProtectedShell>{children}</ProtectedShell>;
};

export default ProtectedLayout;