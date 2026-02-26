"use client";

import { Space, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRbac } from "@/hooks/useRbac";
import { useStyles } from "./style";

interface ContractsHeaderProps {
  onCreateClick: () => void;
}

export const ContractsHeader = ({ onCreateClick }: ContractsHeaderProps) => {
  const { styles } = useStyles();
  const { can } = useRbac();

  return (
    <div className={styles.header}>
      <div className={styles.headerText}>
        <h1 className={styles.title}>Manage and track all your contracts and renewals</h1>
      </div>
      <Space>
        {can("create:contract") && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onCreateClick}
            size="large"
          >
            New Contract
          </Button>
        )}
      </Space>
    </div>
  );
};
