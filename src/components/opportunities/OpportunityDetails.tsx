"use client";

import { Card, Descriptions, Tag } from "antd";
import { IOpportunity } from "@/providers/opportunities/context";
import { useStyles } from "./style";

interface OpportunityDetailsProps {
  opportunity: IOpportunity | null;
  loading: boolean;
}

const STAGE_LABELS: Record<number, string> = {
  1: "Lead",
  2: "Qualified",
  3: "Proposal",
  4: "Negotiation",
  5: "Closed Won",
  6: "Closed Lost",
};

const SOURCE_LABELS: Record<number, string> = {
  1: "Inbound",
  2: "Outbound",
  3: "Referral",
  4: "Partner",
  5: "RFP",
};

export const OpportunityDetails = ({ opportunity, loading }: OpportunityDetailsProps) => {
  const { styles } = useStyles();

  if (!opportunity && !loading) {
    return (
      <Card className={styles.detailsCard} title="Opportunity Details">
        <p>Select an opportunity to view details</p>
      </Card>
    );
  }

  return (
    <Card className={styles.detailsCard} title="Opportunity Details" loading={loading}>
      {opportunity && (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Title">{opportunity.title || "—"}</Descriptions.Item>
          <Descriptions.Item label="Client">{opportunity.clientName || "—"}</Descriptions.Item>
          <Descriptions.Item label="Contact">{opportunity.contactName || "—"}</Descriptions.Item>
          <Descriptions.Item label="Owner">{opportunity.ownerName || "—"}</Descriptions.Item>
          <Descriptions.Item label="Stage">
            <Tag>{opportunity.stage ? STAGE_LABELS[opportunity.stage] : "—"}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Probability">
            {typeof opportunity.probability === "number" ? `${opportunity.probability}%` : "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Estimated Value">
            {typeof opportunity.estimatedValue === "number"
              ? `${opportunity.currency || ""} ${opportunity.estimatedValue.toLocaleString()}`.trim()
              : "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Expected Close Date">
            {opportunity.expectedCloseDate
              ? new Date(opportunity.expectedCloseDate).toLocaleDateString()
              : "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Source">
            {opportunity.source ? SOURCE_LABELS[opportunity.source] : "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Created">
            {opportunity.createdAt ? new Date(opportunity.createdAt).toLocaleDateString() : "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            {opportunity.description || "—"}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Card>
  );
};
