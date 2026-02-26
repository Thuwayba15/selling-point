"use client";

import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRbac } from "@/hooks/useRbac";
import { useStyles } from "./style";

interface ProposalsHeaderProps {
  onCreateClick: () => void;
}

export const ProposalsHeader = ({ onCreateClick }: ProposalsHeaderProps) => {
  const { styles } = useStyles();

  const { can } = useRbac();

  return (
    <div className={styles.header}>
      <div className={styles.headerText}>
        <h1 className={styles.title}>Proposals</h1>
        <p className={styles.subtitle}>Create and manage sales proposals</p>
      </div>
      {can("create:proposal") && (
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreateClick}>
          Create Proposal
        </Button>
      )}
    </div>
  );
};
