"use client";

import { Card, Button, Space } from "antd";
import { EditOutlined, CheckOutlined, UserAddOutlined } from "@ant-design/icons";
import { useRbac } from "@/hooks/useRbac";
import { IPricingRequest } from "@/providers/pricing-requests/context";
import { useStyles } from "./style";

interface PricingRequestActionsProps {
  pricingRequest: IPricingRequest | null;
  onEdit: () => void;
  onAssign: () => void;
  onComplete: () => void;
}

export const PricingRequestActions = ({
  pricingRequest,
  onEdit,
  onAssign,
  onComplete,
}: PricingRequestActionsProps) => {
  const { can } = useRbac();
  const { styles } = useStyles();

  if (!pricingRequest) {
    return (
      <Card className={styles.actionsCard} title="Actions">
        <p>Select a pricing request to perform actions</p>
      </Card>
    );
  }

  const isCompleted = pricingRequest.status === 3;

  return (
    <Card className={styles.actionsCard} title="Actions">
      <Space orientation="vertical" size="middle" className={styles.actionsStack}>
        {can("update:pricing-request") && !isCompleted && (
          <Button type="default" icon={<EditOutlined />} onClick={onEdit} block>
            Edit Request
          </Button>
        )}

        {can("assign:pricing-request") && !isCompleted && (
          <Button type="default" icon={<UserAddOutlined />} onClick={onAssign} block>
            Assign Request
          </Button>
        )}

        {can("complete:pricing-request") && !isCompleted && (
          <Button type="primary" icon={<CheckOutlined />} onClick={onComplete} block>
            Mark as Complete
          </Button>
        )}
      </Space>
    </Card>
  );
};
