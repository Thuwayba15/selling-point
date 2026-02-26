"use client";

import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Dropdown, Typography, Divider } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useAuthActions, useAuthState } from "@/providers/auth";
import { ROUTES } from "@/lib/routes";

import { useStyles } from "./style";

const { Text } = Typography;

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
  const { user } = useAuthState();
  const { styles } = useStyles();

  const handleLogout = () => {
    logout();
    router.push(ROUTES.login);
  };

  const pageName = PAGE_NAMES[pathname] || "Page";

  const userMenuContent = (
    <div className={styles.userMenuContent}>
      <Text strong className={styles.userMenuTextStrong}>
        {user?.firstName} {user?.lastName}
      </Text>
      <br />
      <Text type="secondary" className={styles.userMenuTextSecondary}>
        {user?.email}
      </Text>
      <Divider className={styles.userMenuDivider} />
      <Text type="secondary" className={styles.userMenuTextSecondary}>
        <strong>Role:</strong> {user?.roles.join(', ')}
      </Text>
      <br />
      <Text type="secondary" className={styles.userMenuTextSecondary}>
        <strong>Organization:</strong> {user?.tenantId}
      </Text>
    </div>
  );

  return (
    <>
      <h1 className={styles.headerTitle}>{pageName}</h1>

      <div className={styles.headerRight}>
        <Dropdown popupRender={() => userMenuContent} trigger={['click']} placement="bottomRight">
          <UserOutlined className={styles.userIcon} style={{ cursor: 'pointer' }} />
        </Dropdown>
        <LogoutOutlined className={styles.logoutIcon} onClick={handleLogout} />
      </div>
    </>
  );
};