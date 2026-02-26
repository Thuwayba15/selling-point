"use client";

import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { useAuthActions } from "@/providers/auth";
import { ROUTES } from "@/lib/routes";

import { useStyles } from "./style";

const PAGE_NAMES: Record<string, string> = {
  [ROUTES.dashboard]: "Dashboard",
  [ROUTES.opportunities]: "Opportunities",
  [ROUTES.proposals]: "Proposals",
  [ROUTES.contracts]: "Contracts",
  [ROUTES.pricingRequests]: "Pricing Requests",
  [ROUTES.activities]: "Activities",
  [ROUTES.clients]: "Clients",
  [ROUTES.reports]: "Reports",
  [ROUTES.admin]: "Admin",
  [ROUTES.adminUsers]: "Admin • Users",
  [ROUTES.adminConfig]: "Admin • Config",
};

export const TopBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthActions();
  const { styles } = useStyles();

  const handleLogout = () => {
    logout();
    router.push(ROUTES.login);
  };

  const pageName = PAGE_NAMES[pathname] || "Page";

  return (
    <>
      <h1 className={styles.headerTitle}>{pageName}</h1>

      <div className={styles.headerRight}>
        <UserOutlined className={styles.userIcon} />
        <LogoutOutlined className={styles.logoutIcon} onClick={handleLogout} />
      </div>
    </>
  );
};