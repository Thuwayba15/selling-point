"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "antd";
import {
  HomeOutlined,
  ProjectOutlined,
  FileTextOutlined,
  TeamOutlined,
  CalendarOutlined,
  FolderOutlined,
  BarChartOutlined,
  UnlockOutlined,
} from "@ant-design/icons";

import { ROUTES } from "@/lib/routes";
import { useAuthState } from "@/providers/auth";
import { useRbac } from "@/hooks/useRbac";

import { useStyles } from "./style";

export const SideNav = () => {
  const pathname = usePathname();
  const { user } = useAuthState();
  const { can } = useRbac();
  const { styles } = useStyles();

  const baseItems = [
    {
      key: ROUTES.dashboard,
      icon: <HomeOutlined />,
      label: <Link href={ROUTES.dashboard}>Dashboard</Link>,
    },
    {
      key: ROUTES.clients,
      icon: <TeamOutlined />,
      label: <Link href={ROUTES.clients}>Clients</Link>,
    },
    {
      key: ROUTES.contacts,
      icon: <TeamOutlined />,
      label: <Link href={ROUTES.contacts}>Contacts</Link>,
    },
    {
      key: ROUTES.opportunities,
      icon: <ProjectOutlined />,
      label: <Link href={ROUTES.opportunities}>Opportunities</Link>,
    },
    {
      key: ROUTES.activities,
      icon: <CalendarOutlined />,
      label: <Link href={ROUTES.activities}>Activities</Link>,
    },
    // {
    //   key: ROUTES.pricingRequests,
    //   icon: <FileTextOutlined />,
    //   label: <Link href={ROUTES.pricingRequests}>Pricing Requests</Link>,
    // },
    {
      key: ROUTES.proposals,
      icon: <FileTextOutlined />,
      label: <Link href={ROUTES.proposals}>Proposals</Link>,
    },
    {
      key: ROUTES.contracts,
      icon: <FileTextOutlined />,
      label: <Link href={ROUTES.contracts}>Contracts</Link>,
    },
    {
      key: ROUTES.notes,
      icon: <FileTextOutlined />,
      label: <Link href={ROUTES.notes}>Notes</Link>,
    },
    {
      key: ROUTES.documents,
      icon: <FolderOutlined />,
      label: <Link href={ROUTES.documents}>Documents</Link>,
    },
    ...(can("view:reports")
      ? [
          {
            key: ROUTES.reports,
            icon: <BarChartOutlined />,
            label: <Link href={ROUTES.reports}>Reports</Link>,
          },
        ]
      : []),
    ...(user?.roles.includes("Admin")
      ? [
          {
            key: ROUTES.invitations,
            icon: <UnlockOutlined />,
            label: <Link href={ROUTES.invitations}>Invitations</Link>,
          },
        ]
      : []),
  ];

  return (
    <>
      <div className={styles.siderLogo}>
        Selling Point
        <span className={styles.siderLogoDot} />
      </div>
      <Menu theme="dark" mode="inline" selectedKeys={[pathname]} items={[...baseItems]} />
    </>
  );
};
