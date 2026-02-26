"use client";

import { Card, Descriptions, Tag, Spin, Table, Empty } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IContract, IContractRenewal } from "@/providers/contracts/context";
import { useStyles } from "./style";

interface ContractDetailsProps {
  contract: IContract | null;
  loading: boolean;
}

const STATUS_LABELS: Record<number, string> = {
  1: "Draft",
  2: "Active",
  3: "Expired",
  4: "Renewed",
  5: "Cancelled",
};

const STATUS_COLORS: Record<number, string> = {
  1: "default",
  2: "success",
  3: "warning",
  4: "processing",
  5: "error",
};

const RENEWAL_STATUS_LABELS: Record<number, string> = {
  1: "Pending",
  2: "Completed",
};

const RENEWAL_STATUS_COLORS: Record<number, string> = {
  1: "processing",
  2: "success",
};

export const ContractDetails = ({ contract, loading }: ContractDetailsProps) => {
  const { styles } = useStyles();

  if (loading) {
    return (
      <Card className={styles.detailsCard} title="Contract Details">
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!contract) {
    return (
      <Card className={styles.detailsCard} title="Contract Details">
        <p className={styles.emptyState}>Select a contract to view details</p>
      </Card>
    );
  }

  const renewalColumns: ColumnsType<IContractRenewal> = [
    {
      title: "Renewal Date",
      dataIndex: "renewalDate",
      key: "renewalDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "—"),
    },
    {
      title: "New End Date",
      dataIndex: "newEndDate",
      key: "newEndDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "—"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={RENEWAL_STATUS_COLORS[status] || "default"}>
          {RENEWAL_STATUS_LABELS[status] || "—"}
        </Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "—"),
    },
  ];

  const status = typeof contract.status === "string" ? parseInt(contract.status, 10) : contract.status ?? 1;

  return (
    <Card className={styles.detailsCard} title="Contract Details">
      <Descriptions
        column={{ xxl: 2, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }}
        items={[
          {
            label: "Status",
            children: (
              <Tag color={STATUS_COLORS[status] || "default"}>
                {STATUS_LABELS[status] || "—"}
              </Tag>
            ),
          },
          {
            label: "Contract Number",
            children: contract.contractNumber || "—",
          },
          {
            label: "Title",
            children: contract.title || "—",
          },
          {
            label: "Client",
            children: contract.clientName || "—",
          },
          {
            label: "Owner",
            children: contract.ownerName || "—",
          },
          {
            label: "Currency",
            children: contract.currency || "—",
          },
          {
            label: "Contract Value",
            children: contract.contractValue
              ? `${contract.currency || "ZAR"} ${contract.contractValue.toLocaleString()}`
              : "—",
          },
          {
            label: "Start Date",
            children: contract.startDate
              ? new Date(contract.startDate).toLocaleDateString()
              : "—",
          },
          {
            label: "End Date",
            children: contract.endDate
              ? new Date(contract.endDate).toLocaleDateString()
              : "—",
          },
          {
            label: "Days Until Expiry",
            children:
              contract.daysUntilExpiry !== undefined
                ? `${contract.daysUntilExpiry} days`
                : "—",
          },
          {
            label: "Renewal Notice Period",
            children: contract.renewalNoticePeriod
              ? `${contract.renewalNoticePeriod} days`
              : "—",
          },
          {
            label: "Expiring Soon",
            children: contract.isExpiringSoon ? (
              <Tag color="orange">Yes</Tag>
            ) : (
              <Tag color="green">No</Tag>
            ),
          },
          {
            label: "Created",
            children: contract.createdAt
              ? new Date(contract.createdAt).toLocaleDateString()
              : "—",
          },
        ]}
      />

      {contract.description && (
        <div style={{ marginTop: 20 }}>
          <h4>Description</h4>
          <p>{contract.description}</p>
        </div>
      )}

      {contract.terms && (
        <div style={{ marginTop: 20 }}>
          <h4>Terms & Conditions</h4>
          <p>{contract.terms}</p>
        </div>
      )}

      {contract.renewals && contract.renewals.length > 0 && (
        <div className={styles.renewalSection}>
          <h4>Renewals</h4>
          <Table
            columns={renewalColumns}
            dataSource={contract.renewals}
            rowKey="id"
            pagination={false}
          />
        </div>
      )}

      {(!contract.renewals || contract.renewals.length === 0) && (
        <div className={styles.renewalSection}>
          <h4>Renewals</h4>
          <Empty description="No renewals yet" />
        </div>
      )}
    </Card>
  );
};
