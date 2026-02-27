"use client";

import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRbac } from "@/hooks/useRbac";
import { useStyles } from "./style";

interface ContactsHeaderProps {
  onCreateClick: () => void;
}

export const ContactsHeader = ({ onCreateClick }: ContactsHeaderProps) => {
  const { can } = useRbac();
  const { styles } = useStyles();

  return (
    <div className={styles.header}>
      <div className={styles.headerText}>
        <h1 className={styles.title}>Manage client contact persons and their information</h1>
      </div>
      {can("create:contact") && (
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreateClick}>
          Create Contact
        </Button>
      )}
    </div>
  );
};
