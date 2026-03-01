"use client";

import { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Select, Divider, App, Card, Table, Spin } from "antd";
import { useAuthState } from "@/providers/auth";
import { useUsersActions, useUsersState } from "@/providers/users";
import type { IUser } from "@/providers/users/context";
import { withAuthGuard } from "@/hoc/withAuthGuard";
import type { UserRole } from "@/providers/auth";
import type { IInvitation } from "@/providers/invitations";
import { useStyles } from "./style";

const InvitationsPage = () => {
  const { styles } = useStyles();
  const { message } = App.useApp();
  const { user } = useAuthState();
  const { getUsers } = useUsersActions();
  const { users = [], isPending: isLoadingUsers } = useUsersState();

  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<IInvitation | null>(null);

  const roles: UserRole[] = ["SalesRep", "SalesManager", "BusinessDevelopmentManager", "Admin"];

  // Fetch users for the organization
  useEffect(() => {
    if (user?.tenantId) {
      getUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.tenantId]);

  // Pre-fill tenant ID when modal opens
  const handleModalOpen = () => {
    setIsModalOpen(true);
    if (user?.tenantId) {
      form.setFieldValue("tenantId", user.tenantId);
    }
  };

  const handleGenerateInvitation = async (values: {
    tenantId: string;
    invitedEmail: string;
    role: UserRole;
  }) => {
    setIsSending(true);
    try {
      // Send email invitation - API will generate secure token and link
      const response = await fetch("/api/email/send-invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.invitedEmail,
          tenantId: values.tenantId,
          role: values.role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send email");
      }

      // Get the secure invitation link from response
      const data = await response.json();
      const inviteLink = data.inviteLink;

      // Store invitation for reference (with secure link)
      const invitation = {
        id: Math.random().toString(36).substring(7),
        invitedEmail: values.invitedEmail,
        role: values.role,
        inviteLink,
        createdAt: new Date().toISOString(),
      };

      setSelectedInvitation(invitation);
      message.success("Invitation email sent successfully!");
      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      message.error(
        "Failed to send invitation email. Check console for details or share the link manually.",
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link).then(() => {
      message.success("Link copied to clipboard!");
    });
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        {/* Generate Invitations Card */}
        <Card
          className={styles.cardSection}
          title="Send Organization Invitations"
          extra={
            <Button type="primary" onClick={handleModalOpen}>
              Generate New Invite
            </Button>
          }
        >
          <p className={styles.cardDescription}>
            Use this section to invite new members to your organization. They will receive an email
            with a secure registration link.
          </p>
        </Card>

        {/* Organization Members Card */}
        <Card className={styles.tableCard} title="Organization Members" loading={isLoadingUsers}>
          {isLoadingUsers ? (
            <Spin />
          ) : users && users.length > 0 ? (
            <Table
              columns={[
                {
                  title: "Name",
                  dataIndex: "fullName",
                  key: "fullName",
                  render: (_, record: IUser) =>
                    `${record.firstName || ""} ${record.lastName || ""}`.trim(),
                },
                {
                  title: "Email",
                  dataIndex: "email",
                  key: "email",
                },
                {
                  title: "Role",
                  dataIndex: "roles",
                  key: "roles",
                  render: (roles: string[]) => (roles && roles.length > 0 ? roles.join(", ") : "-"),
                },
              ]}
              dataSource={users}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: "max-content" }}
            />
          ) : (
            <p className={styles.noMembers}>No members found in this organization.</p>
          )}
        </Card>
      </div>

      {/* Generate Invitation Modal */}
      <Modal
        title="Generate Invitation Link"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleGenerateInvitation}>
          <Form.Item
            label="Tenant ID"
            name="tenantId"
            rules={[{ required: true, message: "Please enter the organization tenant ID" }]}
          >
            <Input placeholder="e.g., 00000000-0000-0000-0000-000000000000" />
          </Form.Item>

          <Form.Item
            label="Invited Email"
            name="invitedEmail"
            rules={[
              { required: true, message: "Please enter an email address" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input placeholder="user@example.com" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role" }]}
            initialValue="SalesRep"
          >
            <Select>
              {roles.map((role) => (
                <Select.Option key={role} value={role}>
                  {role}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isSending}>
              {isSending ? "Sending Email..." : "Send Invitation Email"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Show Generated Link Modal */}
      <Modal
        title="✅ Invitation Email Sent"
        open={!!selectedInvitation}
        onCancel={() => setSelectedInvitation(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedInvitation(null)}>
            Close
          </Button>,
          <Button
            key="copy"
            type="primary"
            onClick={() => {
              if (selectedInvitation) {
                handleCopyToClipboard(selectedInvitation.inviteLink);
              }
            }}
          >
            Copy Link (Backup)
          </Button>,
        ]}
      >
        <div>
          <div className={styles.successMessage}>
            <p className={styles.successTitle}>✅ Email Sent Successfully!</p>
            <p className={styles.successText}>
              An invitation email has been sent to{" "}
              <strong>{selectedInvitation?.invitedEmail}</strong>
            </p>
          </div>

          <p className={styles.roleLabel}>
            <strong>Assigned Role:</strong> {selectedInvitation?.role}
          </p>

          <Divider />

          <p className={styles.backupLinkText}>
            If the user doesn't receive the email, you can copy the invitation link below as a
            backup:
          </p>

          <div className={styles.linkContainer}>{selectedInvitation?.inviteLink}</div>
        </div>
      </Modal>
    </div>
  );
};

export default withAuthGuard(InvitationsPage, { allowedRoles: ["Admin"] });
