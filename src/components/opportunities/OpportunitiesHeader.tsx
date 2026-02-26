"use client";

import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRbac } from "@/hooks/useRbac";
import { useStyles } from "./style";

interface OpportunitiesHeaderProps {
  onCreateClick: () => void;
}

export const OpportunitiesHeader = ({ onCreateClick }: OpportunitiesHeaderProps) => {
  const { can } = useRbac();
  const { styles } = useStyles();

  return (
    <div className={styles.header}>
      <div className={styles.headerText}>
        <h1 className={styles.title}>Opportunities</h1>
        <p className={styles.subtitle}>Track sales opportunities and pipeline progress</p>
      </div>
      {can("create:opportunity") && (
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreateClick}>
          Create Opportunity
        </Button>
      )}
    </div>
  );
};
