"use client";

import { Card, Button, Space, Modal, Input, Form } from "antd";
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  SendOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useRbac } from "@/hooks/useRbac";
import { IProposal } from "@/providers/proposals/context";
import { useStyles } from "./style";

interface ProposalActionsProps {
  proposal: IProposal | null;
  onEdit: () => void;
  onSubmit: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
  onDelete: () => void;
}

export const ProposalActions = ({
  proposal,
  onEdit,
  onSubmit,
  onApprove,
  onReject,
  onDelete,
}: ProposalActionsProps) => {
  const { can } = useRbac();
  const { styles } = useStyles();
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectForm] = Form.useForm();

  if (!proposal) {
    return (
      <Card className={styles.actionsCard} title="Actions">
        <p>Select a proposal to perform actions</p>
      </Card>
    );
  }

  const status =
    typeof proposal.status === "string" ? parseInt(proposal.status, 10) : (proposal.status ?? 1);
  const isDraft = status === 1;
  const isSubmitted = status === 2;
  const isRejected = status === 3;
  const isApproved = status === 4;

  const handleDelete = () => {
    Modal.confirm({
      title: "Delete Proposal",
      content: "Are you sure you want to delete this proposal? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: onDelete,
    });
  };

  const handleRejectClick = () => {
    setRejectReason("");
    rejectForm.resetFields();
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      Modal.error({
        title: "Error",
        content: "Please provide a reason for rejection",
      });
      return;
    }
    onReject(rejectReason);
    setIsRejectModalOpen(false);
    setRejectReason("");
  };

  return (
    <>
      <Card className={styles.actionsCard} title="Actions">
        <Space orientation="vertical" size="middle" className={styles.actionsStack}>
          {can("update:proposal") && isDraft && (
            <Button type="default" icon={<EditOutlined />} onClick={onEdit} block>
              Edit Proposal
            </Button>
          )}

          {can("update:proposal") && isDraft && (
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={onSubmit}
              block
              className={styles.primarySubmitButton}
            >
              Submit for Approval
            </Button>
          )}

          {can("approve:proposal") && isSubmitted && (
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={onApprove}
              block
              className={styles.approveButton}
            >
              Approve Proposal
            </Button>
          )}

          {can("reject:proposal") && isSubmitted && (
            <Button danger icon={<CloseOutlined />} onClick={handleRejectClick} block>
              Reject Proposal
            </Button>
          )}

          {can("delete:proposal") && (isDraft || isRejected) && (
            <Button danger icon={<DeleteOutlined />} onClick={handleDelete} block>
              Delete Proposal
            </Button>
          )}

          {(isApproved || isRejected) && !can("update:proposal") && (
            <p className={styles.emptyState}>
              This proposal is {isApproved ? "approved" : "rejected"} and cannot be modified.
            </p>
          )}
        </Space>
      </Card>

      {/* Reject Modal */}
      <Modal
        title="Reject Proposal"
        open={isRejectModalOpen}
        onOk={handleRejectSubmit}
        onCancel={() => setIsRejectModalOpen(false)}
        okText="Reject"
        okType="danger"
      >
        <Form form={rejectForm} layout="vertical">
          <Form.Item
            label="Rejection Reason"
            name="reason"
            rules={[{ required: true, message: "Please provide a rejection reason" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="e.g., Pricing too high, revise and resubmit"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
