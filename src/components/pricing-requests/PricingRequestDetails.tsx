"use client";

import { Card, Descriptions, Tag, Spin } from "antd";
import { IPricingRequest } from "@/providers/pricing-requests/context";
import { useStyles } from "./style";

interface PricingRequestDetailsProps {
  pricingRequest: IPricingRequest | null;
  loading: boolean;
}

const STATUS_LABELS: Record<number, string> = {
  1: "Pending",
  2: "In Progress",
  3: "Completed",
};

const STATUS_COLORS: Record<number, string> = {
  1: "default",
  2: "processing",
  3: "success",
};

const PRIORITY_LABELS: Record<number, string> = {
  1: "Low",
  2: "Medium",
  3: "High",
  4: "Urgent",
};

const PRIORITY_COLORS: Record<number, string> = {
  1: "default",
  2: "blue",
  3: "orange",
  4: "red",
};

export const PricingRequestDetails = ({ pricingRequest, loading }: PricingRequestDetailsProps) => {
  const { styles } = useStyles();

  if (loading) {
    return (
      <Card className={styles.detailsCard} title="Pricing Request Details">
        <div className={styles.loadingState}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!pricingRequest) {
    return (
      <Card className={styles.detailsCard} title="Pricing Request Details">
        <p className={styles.emptyState}>Select a pricing request to view details</p>
      </Card>
    );
  }

  return (
    <Card className={styles.detailsCard} title="Pricing Request Details">
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Opportunity">
          {pricingRequest.opportunityTitle || "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={STATUS_COLORS[pricingRequest.status ?? 1]}>
            {STATUS_LABELS[pricingRequest.status ?? 1]}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Priority">
          <Tag color={PRIORITY_COLORS[pricingRequest.priority ?? 1]}>
            {PRIORITY_LABELS[pricingRequest.priority ?? 1]}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Requested By">
          {pricingRequest.requestedByName || "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Assigned To">
          {pricingRequest.assignedToName || "Unassigned"}
        </Descriptions.Item>
        <Descriptions.Item label="Required By">
          {pricingRequest.requiredByDate
            ? new Date(pricingRequest.requiredByDate).toLocaleDateString()
            : "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Description">
          {pricingRequest.description || "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {pricingRequest.createdAt ? new Date(pricingRequest.createdAt).toLocaleString() : "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
          {pricingRequest.updatedAt ? new Date(pricingRequest.updatedAt).toLocaleString() : "—"}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
