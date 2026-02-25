"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "antd";
import {
  HomeOutlined,
  ProjectOutlined,
  FileTextOutlined,
  ReloadOutlined,
  CheckSquareOutlined,
  TeamOutlined,
  BarChartOutlined,
  SettingOutlined,
  CrownOutlined,
  ToolOutlined,
} from "@ant-design/icons";

import { ROUTES } from "@/lib/routes";
import { useAuthState } from "@/providers/auth";

export const SideNav = () => {
  const pathname = usePathname();
  const { user } = useAuthState();

  const baseItems = [
    { key: ROUTES.dashboard, icon: <HomeOutlined />, label: <Link href={ROUTES.dashboard}>Dashboard</Link> },
    { key: ROUTES.opportunities, icon: <ProjectOutlined />, label: <Link href={ROUTES.opportunities}>Opportunities</Link> },
    { key: ROUTES.pricingRequests, icon: <FileTextOutlined />, label: <Link href={ROUTES.pricingRequests}>Pricing Requests</Link> },
    { key: ROUTES.proposals, icon: <FileTextOutlined />, label: <Link href={ROUTES.proposals}>Proposals</Link> },
    { key: ROUTES.contracts, icon: <FileTextOutlined />, label: <Link href={ROUTES.contracts}>Contracts</Link> },
    { key: ROUTES.activities, icon: <CheckSquareOutlined />, label: <Link href={ROUTES.activities}>Activities</Link> },
    { key: ROUTES.clients, icon: <TeamOutlined />, label: <Link href={ROUTES.clients}>Clients</Link> },
    { key: ROUTES.reports, icon: <BarChartOutlined />, label: <Link href={ROUTES.reports}>Reports</Link> },
  ];

  const adminItems =
    user?.role === "admin"
      ? [
          { key: ROUTES.admin, icon: <CrownOutlined />, label: <Link href={ROUTES.admin}>Admin</Link> },
          { key: ROUTES.adminUsers, icon: <TeamOutlined />, label: <Link href={ROUTES.adminUsers}>Admin • Users</Link> },
          { key: ROUTES.adminConfig, icon: <ToolOutlined />, label: <Link href={ROUTES.adminConfig}>Admin • Config</Link> },
        ]
      : [];

  return (
    <Menu theme="dark" mode="inline" selectedKeys={[pathname]} items={[...baseItems, ...adminItems]} />
  );
};