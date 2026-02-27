import React from "react";
import { Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRbac } from "@/hooks/useRbac";
import { useStyles } from "./style";

interface ActivitiesHeaderProps {
  onCreateClick: () => void;
}

export const ActivitiesHeader: React.FC<ActivitiesHeaderProps> = ({ onCreateClick }) => {
  const { styles } = useStyles();
  const { can } = useRbac();

  // All roles can create activities
  const canCreate = can("create:activity");

  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>Track and manage your activities</h1>
        <p className={styles.subtitle}></p>
      </div>
      <Space>
        {canCreate && (
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreateClick} size="large">
            New Activity
          </Button>
        )}
      </Space>
    </div>
  );
};
