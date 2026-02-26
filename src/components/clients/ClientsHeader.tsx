import React from "react";
import { Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRbac } from "@/hooks/useRbac";
import { useStyles } from "./style";

interface ClientsHeaderProps {
  onCreateClick: () => void;
}

export const ClientsHeader: React.FC<ClientsHeaderProps> = ({ onCreateClick }) => {
  const { styles } = useStyles();
  const { can } = useRbac();

  // Only Admin, SalesManager, and BDM can create clients
  const canCreate = can("create:client");

  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>Clients</h1>
        <p className={styles.subtitle}>Manage your clients and track their engagement</p>
      </div>
      <Space>
        {canCreate && (
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreateClick} size="large">
            New Client
          </Button>
        )}
      </Space>
    </div>
  );
};
