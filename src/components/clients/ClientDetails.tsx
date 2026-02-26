import React from "react";
import { Card, Descriptions, Empty, Tag } from "antd";
import type { Client } from "./ClientsTable";
import { useStyles } from "./style";

interface ClientDetailsProps {
  client: Client | null;
}

const CLIENT_TYPE_MAP: Record<number, string> = {
  1: "Government",
  2: "Private",
  3: "Partner",
};

export const ClientDetails: React.FC<ClientDetailsProps> = ({ client }) => {
  const { styles } = useStyles();

  if (!client) {
    return <Empty description="Select a client to view details" />;
  }

  return (
    <Card className={styles.detailsCard}>
      <Descriptions title={client.name} column={1} bordered>
        <Descriptions.Item label="Industry">{client.industry}</Descriptions.Item>
        <Descriptions.Item label="Type">
          <Tag color={client.clientType === 1 ? "blue" : client.clientType === 2 ? "cyan" : "purple"}>
            {CLIENT_TYPE_MAP[client.clientType] || "Unknown"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={client.isActive ? "green" : "default"}>{client.isActive ? "Active" : "Inactive"}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Email">{client.contactEmail || "—"}</Descriptions.Item>
        <Descriptions.Item label="Phone">{client.phoneNumber || "—"}</Descriptions.Item>
        <Descriptions.Item label="Website">
          {client.websiteUrl ? (
            <a href={client.websiteUrl} target="_blank" rel="noopener noreferrer">
              {client.websiteUrl}
            </a>
          ) : (
            "—"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Company Size">{client.companySize || "—"}</Descriptions.Item>
        <Descriptions.Item label="Address">
          {client.address && client.city && client.country
            ? `${client.address}, ${client.city}, ${client.country}`
            : "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Created">
          {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : "—"}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
