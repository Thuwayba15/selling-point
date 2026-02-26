"use client";

import { Card, Button, Space, Modal, Form, Input, DatePicker } from "antd";
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import { useRbac } from "@/hooks/useRbac";
import { IContract } from "@/providers/contracts/context";
import { useStyles } from "./style";
import type { Dayjs } from "dayjs";

interface ContractActionsProps {
  contract: IContract | null;
  onEdit: () => void;
  onActivate: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onCreateRenewal: (renewalData: any) => void;
  loading?: boolean;
}

export const ContractActions = ({
  contract,
  onEdit,
  onActivate,
  onCancel,
  onDelete,
  onCreateRenewal,
  loading = false,
}: ContractActionsProps) => {
  const { can } = useRbac();
  const { styles } = useStyles();
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);
  const [renewalForm] = Form.useForm();

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

  const handleCreateRenewal = () => {
    setIsRenewalModalOpen(true);
  };

  const handleRenewalSubmit = async () => {
    try {
      const values = await renewalForm.validateFields();
      const renewalData = {
        ...values,
        renewalDate: values.renewalDate
          ? (values.renewalDate as Dayjs).toISOString()
          : undefined,
        newEndDate: values.newEndDate
          ? (values.newEndDate as Dayjs).toISOString()
          : undefined,
      };
      onCreateRenewal(renewalData);
      setIsRenewalModalOpen(false);
      renewalForm.resetFields();
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  return (
    <>
      <Card className={styles.actionsCard} title="Actions">
        <Space orientation="vertical" style={{ width: "100%" }}>
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
            </>
          )}

          {can("create:contract") && isActive && (
            <Button
              block
              icon={<ReloadOutlined />}
              onClick={handleCreateRenewal}
              loading={loading}
            >
              Create Renewal
            </Button>
          )}

          {can("activate:contract") && isActive && (
            <Button
              block
              danger
              icon={<CloseOutlined />}
              onClick={handleCancel}
              loading={loading}
            >
              Cancel Contract
            </Button>
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
            <div style={{ marginTop: "12px", fontSize: "12px", color: "#999" }}>
              No actions available for this contract status
            </div>
          )}
        </Space>
      </Card>

      <Modal
        title="Create Renewal"
        open={isRenewalModalOpen}
        onOk={handleRenewalSubmit}
        onCancel={() => {
          setIsRenewalModalOpen(false);
          renewalForm.resetFields();
        }}
        okText="Create"
        cancelText="Cancel"
      >
        <Form
          form={renewalForm}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="Renewal Date"
            name="renewalDate"
            rules={[{ required: true, message: "Please select renewal date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="New End Date"
            name="newEndDate"
            rules={[{ required: true, message: "Please select new end date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Notes"
            name="notes"
            rules={[{ required: false }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Add renewal notes (e.g., price adjustments, changes)"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
