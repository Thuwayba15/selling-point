"use client";

import { Card, Descriptions, Tag } from "antd";
import { IContact } from "@/providers/contacts/context";
import { useStyles } from "./style";

interface ContactDetailsProps {
  contact: IContact | null;
  loading: boolean;
}

export const ContactDetails = ({ contact, loading }: ContactDetailsProps) => {
  const { styles } = useStyles();

  if (!contact && !loading) {
    return (
      <Card className={styles.detailsCard} title="Contact Details">
        <p>Select a contact to view details</p>
      </Card>
    );
  }

  return (
    <Card className={styles.detailsCard} title="Contact Details" loading={loading}>
      {contact && (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Full Name">
            {contact.firstName} {contact.lastName}
          </Descriptions.Item>
          
          <Descriptions.Item label="Email">{contact.email}</Descriptions.Item>
          
          <Descriptions.Item label="Phone Number">
            {contact.phoneNumber || "—"}
          </Descriptions.Item>
          
          <Descriptions.Item label="Position">
            {contact.position || "—"}
          </Descriptions.Item>

          <Descriptions.Item label="Client">
            {contact.clientName || "—"}
          </Descriptions.Item>
          
          <Descriptions.Item label="Primary Contact">
            {contact.isPrimaryContact ? (
              <Tag color="gold">Yes</Tag>
            ) : (
              <Tag>No</Tag>
            )}
          </Descriptions.Item>
          
          <Descriptions.Item label="Created">
            {contact.createdAt
              ? new Date(contact.createdAt).toLocaleDateString()
              : "—"}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Card>
  );
};
