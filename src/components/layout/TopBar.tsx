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
  [ROUTES.clients]: "Clients",
  [ROUTES.contacts]: "Contacts",
  [ROUTES.opportunities]: "Opportunities",
  [ROUTES.reports]: "Reports",
  [ROUTES.invitations]: "Invitations",
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

  // Check for dynamic routes
  let pageName = PAGE_NAMES[pathname];
  
  if (!pageName) {
    // Handle opportunity workspace route
    if (pathname.startsWith('/opportunities/')) {
      const pathParts = pathname.split('/');
      if (pathParts.length >= 3 && pathParts[2]) {
        pageName = "Opportunity Workspace";
      }
    } else {
      pageName = "Page";
    }
  }

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
        <strong>Role:</strong> {user?.roles.join(", ")}
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
        <Dropdown popupRender={() => userMenuContent} trigger={["click"]} placement="bottomRight">
          <UserOutlined className={styles.userIcon} />
        </Dropdown>
        <LogoutOutlined className={styles.logoutIcon} onClick={handleLogout} />
      </div>
    </>
  );
};
