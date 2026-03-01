"use client";

import { Input, Button, Space, Card } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useStyles } from "../style";

interface ContactsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateContact?: () => void;
}

export const ContactsFilters = ({ 
  searchTerm, 
  onSearchChange,
  onCreateContact 
}: ContactsFiltersProps) => {
  const { styles } = useStyles();

  return (
    <Card className={styles.filtersCard}>
      <div className={styles.filtersRow}>
        {onCreateContact && (
          <div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onCreateContact}
            >
              Add Contact
            </Button>
          </div>
        )}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <Input
            placeholder="Search contacts..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            allowClear
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </Card>
  );
};
