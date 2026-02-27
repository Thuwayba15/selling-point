"use client";

import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRbac } from "@/hooks/useRbac";
import { useStyles } from "./style";

interface PricingRequestsHeaderProps {
  onCreateClick: () => void;
}

export const PricingRequestsHeader = ({ onCreateClick }: PricingRequestsHeaderProps) => {
  const { can } = useRbac();
  const { styles } = useStyles();

  return (
    <div className={styles.header}>
      <div className={styles.headerText}>
        <h1 className={styles.title}>Manage pricing requests and assignments</h1>
      </div>
      {can("create:pricing-request") && (
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreateClick}>
          Create Pricing Request
        </Button>
      )}
    </div>
  );
};
