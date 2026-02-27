"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "antd";
import {
  HomeOutlined,
  ProjectOutlined,
  FileTextOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import { ROUTES } from "@/lib/routes";
import { useAuthState } from "@/providers/auth";

import { useStyles } from "./style";

export const SideNav = () => {
  const pathname = usePathname();
  const { user } = useAuthState();
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
      key: ROUTES.pricingRequests,
      icon: <FileTextOutlined />,
      label: <Link href={ROUTES.pricingRequests}>Pricing Requests</Link>,
    },
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
