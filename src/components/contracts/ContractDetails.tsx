"use client";

import { Card, Descriptions, Tag, Spin } from "antd";
import { IContract } from "@/providers/contracts/context";
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

export const ContractDetails = ({ contract, loading }: ContractDetailsProps) => {
  const { styles } = useStyles();

  if (loading) {
    return (
      <Card className={styles.detailsCard} title="Contract Details">
        <div className={styles.loadingState}>
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

  const status =
    typeof contract.status === "string" ? parseInt(contract.status, 10) : (contract.status ?? 1);

  return (
    <Card className={styles.detailsCard} title="Contract Details">
      <Descriptions
        column={{ xxl: 2, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }}
        items={[
          {
            label: "Status",
            children: (
              <Tag color={STATUS_COLORS[status] || "default"}>{STATUS_LABELS[status] || "—"}</Tag>
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
            children: contract.startDate ? new Date(contract.startDate).toLocaleDateString() : "—",
          },
          {
            label: "End Date",
            children: contract.endDate ? new Date(contract.endDate).toLocaleDateString() : "—",
          },
          {
            label: "Days Until Expiry",
            children:
              contract.daysUntilExpiry !== undefined ? `${contract.daysUntilExpiry} days` : "—",
          },
          {
            label: "Renewal Notice Period",
            children: contract.renewalNoticePeriod ? `${contract.renewalNoticePeriod} days` : "—",
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
            children: contract.createdAt ? new Date(contract.createdAt).toLocaleDateString() : "—",
          },
        ]}
      />

      {contract.description && (
        <div className={styles.sectionBlock}>
          <h4>Description</h4>
          <p>{contract.description}</p>
        </div>
      )}

      {contract.terms && (
        <div className={styles.sectionBlock}>
          <h4>Terms & Conditions</h4>
          <p>{contract.terms}</p>
        </div>
      )}
    </Card>
  );
};
