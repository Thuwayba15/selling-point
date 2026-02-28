"use client";

import { Card, Descriptions, Tag, Spin, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IProposal, IProposalLineItem } from "@/providers/proposals/context";
import { useStyles } from "./style";

interface ProposalDetailsProps {
  proposal: IProposal | null;
  loading: boolean;
}

const STATUS_LABELS: Record<number, string> = {
  1: "Draft",
  2: "Submitted",
  3: "Rejected",
  4: "Approved",
};

const STATUS_COLORS: Record<number, string> = {
  1: "default",
  2: "processing",
  3: "error",
  4: "success",
};

export const ProposalDetails = ({ proposal, loading }: ProposalDetailsProps) => {
  const { styles } = useStyles();

  if (loading) {
    return (
      <Card className={styles.detailsCard} title="Proposal Details">
        <div className={styles.loadingState}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!proposal) {
    return (
      <Card className={styles.detailsCard} title="Proposal Details">
        <p className={styles.emptyState}>Select a proposal to view details</p>
      </Card>
    );
  }

  const lineItemColumns: ColumnsType<IProposalLineItem> = [
    {
      title: "Product/Service",
      dataIndex: "productServiceName",
      key: "productServiceName",
      render: (productServiceName) => productServiceName || "—",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description) => description || "—",
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
      render: (qty) => qty || "—",
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price) => (price ? `${proposal.currency || "R"} ${price.toLocaleString()}` : "—"),
    },
    {
      title: "Discount %",
      dataIndex: "discount",
      key: "discount",
      render: (discount) => (discount ? `${discount}%` : "0%"),
    },
    {
      title: "Tax %",
      dataIndex: "taxRate",
      key: "taxRate",
      render: (tax) => (tax ? `${tax}%` : "0%"),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total, record) => {
        const lineTotal = total !== undefined ? total : record.totalPrice;
        return (lineTotal ? `${proposal.currency || "R"} ${lineTotal.toLocaleString()}` : "—");
      },
    },
  ];

  return (
    <Card className={styles.detailsCard} title="Proposal Details">
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Title">{proposal.title || "—"}</Descriptions.Item>
        <Descriptions.Item label="Client">{proposal.clientName || "—"}</Descriptions.Item>
        <Descriptions.Item label="Opportunity">
          {proposal.opportunityTitle || "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={STATUS_COLORS[proposal.status ?? 1]}>
            {STATUS_LABELS[proposal.status ?? 1]}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Description">{proposal.description || "—"}</Descriptions.Item>
        <Descriptions.Item label="Valid Until">
          {proposal.validUntil ? new Date(proposal.validUntil).toLocaleDateString() : "—"}
        </Descriptions.Item>
        {proposal.status === 3 && proposal.rejectionReason && (
          <Descriptions.Item label="Rejection Reason">{proposal.rejectionReason}</Descriptions.Item>
        )}
        <Descriptions.Item label="Created At">
          {proposal.createdAt ? new Date(proposal.createdAt).toLocaleString() : "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
          {proposal.updatedAt ? new Date(proposal.updatedAt).toLocaleString() : "—"}
        </Descriptions.Item>
      </Descriptions>

      {proposal.lineItems && proposal.lineItems.length > 0 && (
        <>
          <div className={styles.lineItemsHeader}>Line Items</div>
          <Table
            columns={lineItemColumns}
            dataSource={proposal.lineItems}
            loading={loading}
            rowKey="id"
            pagination={false}
            scroll={{ x: "max-content" }}
            size="small"
            className={styles.lineItemsTable}
          />

          <div className={styles.summarySection}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Subtotal:</span>
              <span className={styles.summaryValue}>
                {proposal.currency || "R"} {(proposal.subtotal || 0).toLocaleString()}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Tax:</span>
              <span className={styles.summaryValue}>
                {proposal.currency || "R"} {(proposal.tax || 0).toLocaleString()}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={`${styles.summaryLabel} ${styles.totalAmount}`}>Total:</span>
              <span className={`${styles.summaryValue} ${styles.totalAmount}`}>
                {proposal.currency || "R"} {(proposal.totalAmount || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};
