"use client";

import { Card, Button, Space, Modal } from "antd";
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useRbac } from "@/hooks/useRbac";
import { IContract } from "@/providers/contracts/context";
import { useStyles } from "./style";

interface ContractActionsProps {
  contract: IContract | null;
  onEdit: () => void;
  onActivate: () => void;
  onCancel: () => void;
  onDelete: () => void;
  loading?: boolean;
}

export const ContractActions = ({
  contract,
  onEdit,
  onActivate,
  onCancel,
  onDelete,
  loading = false,
}: ContractActionsProps) => {
  const { can } = useRbac();
  const { styles } = useStyles();

  if (!contract) {
    return (
      <Card className={styles.actionsCard} title="Actions">
        <p>Select a contract to perform actions</p>
      </Card>
    );
  }

  const status = typeof contract.status === "string" ? parseInt(contract.status, 10) : contract.status ?? 1;
  const isDraft = status === 1;
  const isActive = status === 2;
  const isExpired = status === 3;
  const isRenewed = status === 4;
  const isCancelled = status === 5;

  const handleActivate = () => {
    Modal.confirm({
      title: "Activate Contract",
      content: "Are you sure you want to activate this contract? This action cannot be undone.",
      okText: "Activate",
      okType: "primary",
      cancelText: "Cancel",
      onOk: onActivate,
    });
  };

  const handleCancel = () => {
    Modal.confirm({
      title: "Cancel Contract",
      content: "Are you sure you want to cancel this contract?",
      okText: "Cancel",
      okType: "danger",
      cancelText: "Keep Active",
      onOk: onCancel,
    });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Delete Contract",
      content: "Are you sure you want to delete this contract? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: onDelete,
    });
  };

  return (
    <>
      <Card className={styles.actionsCard} title="Actions">
        <Space orientation="vertical" className={styles.actionsStack}>
          {can("update:contract") && isDraft && (
            <Button
              block
              icon={<EditOutlined />}
              onClick={onEdit}
              loading={loading}
            >
              Edit Contract
            </Button>
          )}

          {can("activate:contract") && isDraft && (
            <Button
              block
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleActivate}
              loading={loading}
            >
              Activate Contract
            </Button>
          )}

          {can("update:contract") && isActive && (
            <>
              <Button
                block
                icon={<EditOutlined />}
                onClick={onEdit}
                loading={loading}
              >
                Edit Contract
              </Button>

              <Button
                block
                danger
                icon={<CloseOutlined />}
                onClick={handleCancel}
                loading={loading}
              >
                Cancel Contract
              </Button>
            </>
          )}

          {can("delete:contract") && isDraft && (
            <Button
              block
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              loading={loading}
            >
              Delete Contract
            </Button>
          )}

          {(isDraft || isExpired || isRenewed || isCancelled) && (
            <div className={styles.actionNotice}>
              No actions available for this contract status
            </div>
          )}
        </Space>
      </Card>
    </>
  );
};
