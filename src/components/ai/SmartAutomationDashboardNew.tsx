import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Typography,
  Space,
  Select,
  Input,
  Form,
  Row,
  Col,
  Progress,
  message,
  Tag,
  Divider,
  Checkbox,
  Table,
  Modal,
  Dropdown,
  Menu,
  Badge,
  Statistic,
  Timeline,
  Alert,
  Tooltip,
  Spin,
} from "antd";
import {
  RobotOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  MailOutlined,
  CalendarOutlined,
  UserOutlined,
  DollarOutlined,
  AlertOutlined,
  EditOutlined,
  CopyOutlined,
  SendOutlined,
  PhoneOutlined,
  ScheduleOutlined,
  PlusOutlined,
  EyeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { dataAwareAIService } from "@/lib/ai/data-aware-ai-service";
import { groqService } from "@/lib/ai/groq-service";
import { useStyles } from "./style";
import { DashboardSalesPerformance } from "@/components/dashboard";
import type { ISalesPerformance } from "@/providers/dashboard/context";
import { useRbac } from "@/hooks/useRbac";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export const SmartAutomationDashboard = () => {
  const { styles } = useStyles();
  const { isAdmin, isManager } = useRbac();
  const canViewSalesPerformance = isAdmin || isManager;
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [currentUserName, setCurrentUserName] = useState<string>("User");

  // Modal states
  const [opportunityModalVisible, setOpportunityModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [emailTemplate, setEmailTemplate] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");

  // Form states
  const [opportunityForm] = Form.useForm();
  const [emailForm] = Form.useForm();

  useEffect(() => {
    loadAllData();
    // Get current user from local storage
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        const firstName = user.firstName || "";
        const lastName = user.lastName || "";
        const fullName = `${firstName} ${lastName}`.trim() || user.email || "User";
        setCurrentUserName(fullName);
      }
    } catch (error) {
      console.log("Could not get user from local storage:", error);
    }
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Fetch all data
      const [opportunitiesData, clientsData] = await Promise.all([
        dataAwareAIService.fetchOpportunities(),
        dataAwareAIService.fetchClients(),
      ]);

      setOpportunities(opportunitiesData);
      setClients(clientsData);

      // Get current user from local storage to filter data
      let currentUser = null;
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          currentUser = JSON.parse(userStr);
        }
      } catch (error) {
        console.log("Could not get user from local storage:", error);
      }

      // Filter opportunities for current user/tenant (if user data available)
      // Since Current User is null, let's try a different approach
      let userOpps = opportunitiesData;

      // Try to get user info again with different keys
      try {
        const userStr =
          localStorage.getItem("user") ||
          localStorage.getItem("currentUser") ||
          localStorage.getItem("authUser");
        if (userStr) {
          const user = JSON.parse(userStr);
          console.log("Found user data:", user);

          // Filter by multiple possible tenant fields
          userOpps = opportunitiesData.filter((opp: any) => {
            // Check if opportunity has any tenant-related fields that match user
            return (
              opp.tenantId === user.tenantId ||
              opp.organizationId === user.organizationId ||
              opp.companyId === user.companyId ||
              opp.assignedTo === user.id ||
              opp.ownerId === user.id ||
              opp.createdBy === user.id
            );
          });
        }
      } catch (error) {
        console.log("Still could not get user data:", error);
      }

      // Debug logging to help identify filtering issues
      console.log("🔍 Data Filtering Debug:");
      console.log("Current User:", currentUser);
      console.log("Total Opportunities:", opportunitiesData.length);
      console.log("Filtered Opportunities:", userOpps.length);
      console.log("Sample Opportunity:", opportunitiesData[0]);

      // Calculate automation insights from user's opportunities only
      const totalOpps = userOpps.length;
      const avgValue =
        totalOpps > 0
          ? userOpps.reduce((sum: number, opp: any) => sum + (opp.estimatedValue || 0), 0) /
            totalOpps
          : 0;
      const highValueOpps = userOpps.filter((opp: any) => (opp.estimatedValue || 0) > 50000).length;
      const followUpNeeded = userOpps.filter((opp: any) => {
        const stage = opp.stage || 0;
        const closeDate = opp.expectedCloseDate ? new Date(opp.expectedCloseDate) : null;
        const today = new Date();
        // Active stages (1-4) that need follow-up within 14 days
        return (
          [1, 2, 3, 4].includes(stage) &&
          closeDate &&
          closeDate > today &&
          closeDate.getTime() - today.getTime() <= 14 * 24 * 60 * 60 * 1000
        );
      }).length;

      // Removed insights cards - now using Key Metrics instead

      // Generate follow-ups and tasks from ALL opportunities (flipped as requested)
      await generateFollowUps(opportunitiesData);
      await generateTasks(opportunitiesData);
    } catch (error) {
      console.error("Error loading automation data:", error);
      message.error("Failed to load automation data");
    } finally {
      setLoading(false);
    }
  };

  const generateFollowUps = async (opps: any[]) => {
    const today = new Date();

    // Follow-up reminders are RULE-BASED (not AI)
    // Logic: Active opportunities (stages 1-4) closing within 14 days
    // Prioritization: Stage urgency + value
    const followUpOpps = opps.filter((opp: any) => {
      const stage = opp.stage || 0;
      const closeDate = opp.expectedCloseDate ? new Date(opp.expectedCloseDate) : null;
      // Active opportunities needing follow-up within 14 days
      return (
        [1, 2, 3, 4].includes(stage) &&
        closeDate &&
        closeDate > today &&
        closeDate.getTime() - today.getTime() <= 14 * 24 * 60 * 60 * 1000
      );
    });

    const prioritizedOpps = followUpOpps
      .sort((a: any, b: any) => {
        const aValue = a.estimatedValue || 0;
        const bValue = b.estimatedValue || 0;
        const aUrgency = a.stage === 4 ? 2 : a.stage === 3 ? 1 : 0;
        const bUrgency = b.stage === 4 ? 2 : b.stage === 3 ? 1 : 0;

        if (aUrgency !== bUrgency) return bUrgency - aUrgency;
        return bValue - aValue;
      })
      .slice(0, 10);

    const oldCount = followUps.length;
    setFollowUps(prioritizedOpps);

    // Show meaningful feedback
    const newCount = prioritizedOpps.length;
    if (newCount > oldCount) {
      message.success(`Found ${newCount} follow-ups (${newCount - oldCount} new)`);
    } else if (newCount < oldCount) {
      message.info(`Updated follow-ups: ${newCount} total`);
    } else {
      message.success(`Follow-ups refreshed: ${newCount} total`);
    }
  };

  const generateTasks = async (opps: any[]) => {
    const today = new Date();

    // Smart Tasks are RULE-BASED with AI-GENERATED CONTENT
    // Rule-based: Priority logic based on stage + timing + value
    // AI-generated: Task descriptions created by Groq AI
    const taskList = opps
      .filter((opp: any) => {
        const stage = opp.stage || 0;
        return [1, 2, 3, 4, 5].includes(stage);
      })
      .map((opp: any) => {
        const stage = opp.stage || 0;
        const daysUntilClose = opp.expectedCloseDate
          ? Math.ceil(
              (new Date(opp.expectedCloseDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
            )
          : null;

        let taskTitle = "";
        let priority = "medium";
        let dueDate = "";

        switch (stage) {
          case 1: // Lead
            taskTitle =
              daysUntilClose && daysUntilClose <= 3
                ? `Call ${opp.clientName} within 3 days to qualify lead`
                : `Research ${opp.clientName} background and prepare qualification questions`;
            priority = daysUntilClose && daysUntilClose <= 3 ? "high" : "medium";
            dueDate = daysUntilClose && daysUntilClose <= 3 ? "Today" : "This Week";
            break;
          case 2: // Qualified
            taskTitle =
              daysUntilClose && daysUntilClose <= 7
                ? `Schedule proposal meeting with ${opp.clientName}`
                : `Send follow-up email to ${opp.clientName} with additional information`;
            priority = daysUntilClose && daysUntilClose <= 7 ? "high" : "medium";
            dueDate = daysUntilClose && daysUntilClose <= 7 ? "This Week" : "Next Week";
            break;
          case 3: // Proposal
            taskTitle =
              daysUntilClose && daysUntilClose <= 14
                ? `Follow up on proposal status with ${opp.clientName}`
                : `Review proposal terms with ${opp.clientName}`;
            priority = daysUntilClose && daysUntilClose <= 14 ? "high" : "medium";
            dueDate = daysUntilClose && daysUntilClose <= 14 ? "This Week" : "Next Week";
            break;
          case 4: // Negotiation
            taskTitle =
              daysUntilClose && daysUntilClose <= 2
                ? `Schedule negotiation session with ${opp.clientName}`
                : `Finalize negotiation with ${opp.clientName}`;
            priority = daysUntilClose && daysUntilClose <= 2 ? "high" : "medium";
            dueDate = daysUntilClose && daysUntilClose <= 2 ? "Today" : "This Week";
            break;
          default:
            taskTitle = `Review opportunity ${opp.title} with ${opp.clientName}`;
            priority = "low";
            dueDate = "Next Week";
        }

        return {
          id: opp.id,
          title: taskTitle,
          clientName: opp.clientName,
          opportunityTitle: opp.title,
          value: opp.estimatedValue || 0,
          priority,
          dueDate,
          stage,
          completed: false, // Always start as false when generating new tasks
        };
      });

    // Preserve completion state for existing tasks and sort by priority
    const updatedTasks = taskList
      .map((newTask) => {
        const existingTask = tasks.find((t) => t.id === newTask.id);
        return existingTask ? { ...newTask, completed: existingTask.completed } : newTask;
      })
      .sort((a: any, b: any) => {
        // Sort by priority: High > Medium > Low
        const priorityOrder: { [key: string]: number } = { high: 0, medium: 1, low: 2 };
        return (priorityOrder[a.priority] || 999) - (priorityOrder[b.priority] || 999);
      });

    const oldCount = tasks.length;
    const completedCount = updatedTasks.filter((t) => t.completed).length;
    setTasks(updatedTasks);

    // Show meaningful feedback
    const newCount = updatedTasks.length;
    const newTasksCount = newCount - oldCount;
    if (newTasksCount > 0) {
      message.success(
        `Generated ${newCount} tasks (${newTasksCount} new, ${completedCount} completed)`,
      );
    } else {
      message.success(`Tasks updated: ${newCount} total (${completedCount} completed)`);
    }
  };

  const handleCreateOpportunity = async (values: any) => {
    try {
      setLoading(true);

      // AI enhancement for opportunity creation
      const prompt = `Based on client ${selectedClient?.name} and their history, suggest an opportunity with title "${values.title}" and value R${values.estimatedValue}. Consider their industry, past performance, and current needs. Provide your suggestion as ${currentUserName}. Use plain text format - no markdown, no bold, no italics, no asterisks.`;

      const aiSuggestion = await groqService.chat([{ role: "user", content: prompt }]);

      message.success(`Opportunity created with AI enhancement: ${aiSuggestion}`);
      setOpportunityModalVisible(false);
      opportunityForm.resetFields();
      await loadAllData();
    } catch (error) {
      message.error(`Error creating opportunity: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateEmail = async (values: any) => {
    try {
      setLoading(true);

      const selectedOpp = opportunities.find((o) => o.id === values.opportunityId);
      if (!selectedOpp) {
        message.error("Please select an opportunity");
        return;
      }

      const prompt = `Generate a professional email template for ${values.templateType} to ${selectedOpp.clientName} regarding opportunity "${selectedOpp.title}" worth R${selectedOpp.estimatedValue?.toLocaleString("en-ZA")}. Include specific details about the opportunity and next steps. Make it personalized and actionable. Use plain text format - no markdown, no bold, no italics, no asterisks. Use clean, simple text that renders well in email clients. Sign off as "${currentUserName}".`;

      const generatedEmail = await groqService.chat([{ role: "user", content: prompt }]);

      setEmailSubject(`Follow-up on ${selectedOpp.title}`);
      setEmailTemplate(generatedEmail);
      message.success("Email template generated successfully");
    } catch (error) {
      console.error("Error generating email:", error);
      message.error(`Error generating email: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailTemplate);
    message.success("Email template copied to clipboard");
  };

  const sendEmail = async () => {
    if (!emailTemplate || !selectedOpportunity) {
      message.error("No email to send");
      return;
    }

    if (!recipientEmail) {
      message.error("Please enter recipient email address");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      message.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      // Convert plain text email to HTML for better formatting
      const htmlContent = emailTemplate.replace(/\n/g, "<br>");

      // Send email via API route
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: recipientEmail,
          subject: emailSubject,
          htmlContent: htmlContent,
          textContent: emailTemplate,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        message.success(
          `Email successfully sent to ${recipientEmail} regarding ${selectedOpportunity.title}`,
        );
        setEmailModalVisible(false);
        emailForm.resetFields();
        setEmailTemplate("");
        setEmailSubject("");
        setRecipientEmail("");
      } else {
        throw new Error(result.error || "Failed to send email");
      }
    } catch (error) {
      console.error("Email send error:", error);
      message.error(`Failed to send email: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#ff4d4f";
      case "medium":
        return "#faad14";
      case "low":
        return "#52c41a";
      default:
        return "#d9d9d9";
    }
  };

  const getStageColor = (stage: number) => {
    switch (stage) {
      case 1:
        return "#1890ff"; // Lead
      case 2:
        return "#52c41a"; // Qualified
      case 3:
        return "#faad14"; // Proposal
      case 4:
        return "#ff4d4f"; // Negotiation
      case 5:
        return "#722ed1"; // Closed Won
      default:
        return "#d9d9d9";
    }
  };

  const followUpColumns = [
    {
      title: "Client",
      dataIndex: "clientName",
      key: "client",
      responsive: ["xs" as const, "sm" as const, "md" as const, "lg" as const],
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Opportunity",
      dataIndex: "title",
      key: "title",
      responsive: ["sm" as const, "md" as const, "lg" as const],
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: "Value",
      dataIndex: "estimatedValue",
      key: "value",
      responsive: ["md" as const, "lg" as const],
      render: (value: number) => <Text>R{value?.toLocaleString("en-ZA")}</Text>,
    },
    {
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
      responsive: ["lg" as const],
      render: (stage: number) => (
        <Tag color={getStageColor(stage)}>
          {stage === 1
            ? "Lead"
            : stage === 2
              ? "Qualified"
              : stage === 3
                ? "Proposal"
                : stage === 4
                  ? "Negotiation"
                  : "Closed"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      responsive: ["xs" as const, "sm" as const, "md" as const, "lg" as const],
      render: (record: any) => (
        <Space wrap>
          <Button
            type="primary"
            size="small"
            icon={<MailOutlined />}
            onClick={() => {
              setSelectedOpportunity(record);
              setEmailModalVisible(true);
              // Auto-prefill the form with this opportunity
              setTimeout(() => {
                emailForm.setFieldsValue({
                  templateType: "follow-up",
                  opportunityId: record.id,
                });
              }, 100);
            }}
          >
            Email
          </Button>
        </Space>
      ),
    },
  ];

  const taskColumns = [
    {
      title: "Task",
      dataIndex: "title",
      key: "title",
      responsive: ["xs" as const, "sm" as const, "md" as const, "lg" as const],
      render: (text: string, record: any) => (
        <div>
          <Checkbox
            checked={record.completed}
            onChange={(e) => {
              const updatedTasks = tasks.map((t) =>
                t.id === record.id ? { ...t, completed: e.target.checked } : t,
              );
              setTasks(updatedTasks);
            }}
          />
          <span className={styles.marginLeft}>{text}</span>
        </div>
      ),
    },
    {
      title: "Client",
      dataIndex: "clientName",
      key: "client",
      responsive: ["sm" as const, "md" as const, "lg" as const],
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      responsive: ["md" as const, "lg" as const],
      render: (value: number) => <Text>R{value?.toLocaleString("en-ZA")}</Text>,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      responsive: ["lg" as const],
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>{priority.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Due",
      dataIndex: "dueDate",
      key: "dueDate",
      responsive: ["md" as const, "lg" as const],
      render: (dueDate: string) => (
        <Tag
          color={dueDate === "Today" ? "#ff4d4f" : dueDate === "This Week" ? "#faad14" : "#52c41a"}
        >
          {dueDate}
        </Tag>
      ),
    },
  ];

  const stageMeta = [
    { stage: 1, label: "Lead", color: "#1890ff" },
    { stage: 2, label: "Qualified", color: "#52c41a" },
    { stage: 3, label: "Proposal", color: "#faad14" },
    { stage: 4, label: "Negotiation", color: "#ff4d4f" },
    { stage: 5, label: "Won", color: "#722ed1" },
    { stage: 6, label: "Lost", color: "#8c8c8c" },
  ];

  const pipelineByStage = stageMeta.map((item) => {
    const stageOpps = opportunities.filter((opp: any) => (opp.stage || 0) === item.stage);
    const value = stageOpps.reduce((sum: number, opp: any) => sum + (opp.estimatedValue || 0), 0);
    return {
      ...item,
      count: stageOpps.length,
      value,
    };
  });

  const maxStageValue = Math.max(...pipelineByStage.map((item) => item.value), 1);
  const salesPerformanceData: ISalesPerformance[] = Object.values(
    opportunities.reduce((acc: Record<string, ISalesPerformance>, opp: any) => {
      const repId =
        opp.assignedTo || opp.assignedUserId || opp.ownerId || opp.createdBy || "unassigned";
      const repName =
        opp.assignedToName ||
        opp.assignedUserName ||
        opp.ownerName ||
        opp.createdByName ||
        "Unassigned";

      if (!acc[repId]) {
        acc[repId] = {
          userId: String(repId),
          userName: String(repName),
          opportunitiesCount: 0,
          wonCount: 0,
          lostCount: 0,
          totalRevenue: 0,
          winRate: 0,
        };
      }

      acc[repId].opportunitiesCount += 1;

      const stage = opp.stage || 0;
      const value = opp.estimatedValue || 0;
      if (stage === 5) {
        acc[repId].wonCount += 1;
        acc[repId].totalRevenue += value;
      } else if (stage === 6) {
        acc[repId].lostCount += 1;
      }

      return acc;
    }, {}),
  )
    .map((item) => ({
      ...item,
      winRate: item.opportunitiesCount
        ? Math.round((item.wonCount / item.opportunitiesCount) * 100)
        : 0,
    }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue);

  const topSalesPerformanceData = salesPerformanceData.slice(0, 5);

  return (
    <div className={styles.container}>
      <Spin spinning={loading}>
        {/* Header */}
        <div className={styles.header}>
          <Title level={2} className={styles.title}>
            Smart Automation Dashboard
          </Title>
          <Text type="secondary" className={styles.subtitle}>
            Intelligent CRM automation to save time and improve efficiency
          </Text>
        </div>

        {/* Top Section: Quick Actions + Key Metrics + Follow-up Reminders */}
        <Row gutter={[16, 16]} className={styles.topSection}>
          {/* Quick Actions */}
          <Col xs={24} md={4}>
            <Card title="Quick Actions" size="small" className={styles.quickActionsCard}>
              <Space
                orientation="vertical"
                className={`${styles.fullWidth} ${styles.buttonContainer}`}
                size="small"
              >
                <Button
                  className={styles.quickActionButton}
                  type="primary"
                  size="small"
                  block
                  icon={<ClockCircleOutlined />}
                  onClick={async () => {
                    setLoading(true);
                    try {
                      await generateFollowUps(opportunities);
                    } catch (error) {
                      message.error("Failed to refresh follow-ups");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  loading={loading}
                >
                  Refresh Follow-ups
                </Button>
                <Button
                  className={styles.quickActionButton}
                  size="small"
                  block
                  icon={<CheckCircleOutlined />}
                  onClick={async () => {
                    setLoading(true);
                    try {
                      await generateTasks(opportunities);
                    } catch (error) {
                      message.error("Failed to regenerate tasks");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  loading={loading}
                >
                  Generate Tasks
                </Button>
                <Button
                  className={styles.quickActionButton}
                  size="small"
                  block
                  icon={<MailOutlined />}
                  onClick={() => {
                    if (opportunities.length === 0) {
                      message.warning("No opportunities available to generate email for");
                      return;
                    }
                    setEmailModalVisible(true);
                  }}
                >
                  Draft Email
                </Button>
              </Space>
            </Card>
          </Col>

          {/* Key Metrics */}
          <Col xs={24} md={4}>
            <Card title="Key Metrics" size="small" className={styles.keyMetricsCard}>
              <Space
                orientation="vertical"
                className={`${styles.fullWidth} ${styles.metricsContainer}`}
                size="small"
                align="center"
              >
                <div className={styles.metricItem}>
                  <Text type="secondary" className={styles.metricLabel}>
                    Total Pipeline Value
                  </Text>
                  <div className={`${styles.metricValue} ${styles.pipelineValue}`}>
                    R
                    {opportunities
                      .reduce((sum: number, opp: any) => sum + (opp.estimatedValue || 0), 0)
                      .toLocaleString("en-ZA")}
                  </div>
                </div>
                <div className={styles.metricItem}>
                  <Text type="secondary" className={styles.metricLabel}>
                    Active Opportunities
                  </Text>
                  <div className={`${styles.metricValue} ${styles.activeOppsValue}`}>
                    {
                      opportunities.filter((opp: any) => [1, 2, 3, 4].includes(opp.stage || 0))
                        .length
                    }
                  </div>
                </div>
                <div className={styles.metricItem}>
                  <Text type="secondary" className={styles.metricLabel}>
                    Conversion Rate
                  </Text>
                  <div className={`${styles.metricValue} ${styles.conversionRateValue}`}>
                    {opportunities.length > 0
                      ? Math.round(
                          (opportunities.filter((opp: any) => opp.stage === 5).length /
                            opportunities.length) *
                            100,
                        )
                      : 0}
                    %
                  </div>
                </div>
                <div className={styles.metricItem}>
                  <Text type="secondary" className={styles.metricLabel}>
                    Avg Deal Size
                  </Text>
                  <div className={`${styles.metricValue} ${styles.avgDealSizeValue}`}>
                    R
                    {opportunities.length > 0
                      ? Math.round(
                          opportunities.reduce(
                            (sum: number, opp: any) => sum + (opp.estimatedValue || 0),
                            0,
                          ) / opportunities.length,
                        ).toLocaleString("en-ZA")
                      : 0}
                  </div>
                </div>
              </Space>
            </Card>
          </Col>

          {/* Follow-up Reminders */}
          <Col xs={24} md={16}>
            <Card
              title="Follow-up Reminders"
              extra={<Badge count={followUps.length} />}
              size="small"
              className={styles.followUpsCard}
            >
              <Table
                dataSource={followUps}
                columns={followUpColumns}
                pagination={{ pageSize: 5, size: "small" }}
                size="small"
                scroll={{ x: 400, y: 300 }}
                className={styles.compactTable}
              />
            </Card>
          </Col>
        </Row>

        {/* Smart Tasks */}
        <Row gutter={[16, 16]} className={styles.middleSection}>
          <Col xs={24}>
            <Card
              title="Smart Tasks"
              extra={<Badge count={tasks.filter((t) => !t.completed).length} />}
              size="small"
              className={styles.tasksCard}
            >
              <Table
                columns={taskColumns}
                dataSource={tasks}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: false,
                  simple: true,
                }}
                scroll={{ x: 800, y: 400 }}
                size="small"
                className={styles.compactTable}
              />
            </Card>
          </Col>
        </Row>

        <div className={styles.bottomAnalyticsScroll}>
          <div className={styles.bottomAnalyticsRow}>
            <Card title="Pipeline by Stage" size="small" className={styles.pipelineCard}>
              <div className={styles.pipelineGraphScroll}>
                <div className={styles.pipelineBars}>
                  {pipelineByStage.map((item) => {
                    const barHeight = Math.max(
                      (item.value / maxStageValue) * 100,
                      item.count > 0 ? 8 : 0,
                    );

                    return (
                      <div key={item.stage} className={styles.pipelineBarItem}>
                        <Text className={styles.pipelineBarValue}>
                          R{item.value.toLocaleString("en-ZA")}
                        </Text>
                        <div className={styles.pipelineBarTrack}>
                          <div
                            className={styles.pipelineBarFill}
                            style={{ height: `${barHeight}%`, backgroundColor: item.color }}
                          />
                        </div>
                        <Text className={styles.pipelineBarLabel}>{item.label}</Text>
                        <Text className={styles.pipelineBarCount}>{item.count} opps</Text>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            {canViewSalesPerformance && (
              <Card title="Sales Performance" size="small" className={styles.salesPerformanceCard}>
                <DashboardSalesPerformance
                  salesPerformance={topSalesPerformanceData}
                  isLoading={loading}
                />
              </Card>
            )}
          </div>
        </div>

        {/* Create Opportunity Modal */}
        <Modal
          title={
            <span>
              <PlusOutlined className={styles.marginRight} />
              Create Opportunity
            </span>
          }
          open={opportunityModalVisible}
          onCancel={() => {
            setOpportunityModalVisible(false);
            opportunityForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form form={opportunityForm} layout="vertical" onFinish={handleCreateOpportunity}>
            <Form.Item
              label="Select Client"
              name="clientId"
              rules={[{ required: true, message: "Please select a client" }]}
            >
              <Select
                placeholder="Choose a client..."
                showSearch
                filterOption={(input, option) =>
                  String(option?.children || "")
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                onChange={(value) => {
                  const client = clients.find((c) => c.id === value);
                  setSelectedClient(client);
                }}
              >
                {clients.map((client) => (
                  <Option key={client.id} value={client.id}>
                    {client.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Opportunity Title"
              name="title"
              rules={[{ required: true, message: "Please enter opportunity title" }]}
            >
              <Input placeholder="Enter opportunity title..." />
            </Form.Item>

            <Form.Item
              label="Estimated Value (R)"
              name="estimatedValue"
              rules={[{ required: true, message: "Please enter estimated value" }]}
            >
              <Input type="number" placeholder="Enter estimated value..." prefix="R" />
            </Form.Item>

            <Form.Item label="Description" name="description">
              <TextArea rows={4} placeholder="Enter opportunity description..." />
            </Form.Item>

            <Form.Item>
              <Space className={styles.flexEnd}>
                <Button onClick={() => setOpportunityModalVisible(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Create Opportunity
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Email Template Modal */}
        <Modal
          title={
            <span>
              <MailOutlined className={styles.marginRight} />
              Email Template
            </span>
          }
          open={emailModalVisible}
          onCancel={() => {
            setEmailModalVisible(false);
            emailForm.resetFields();
            setEmailTemplate("");
            setEmailSubject("");
            setRecipientEmail("");
          }}
          footer={null}
          width={800}
        >
          <Form form={emailForm} layout="vertical" initialValues={{ templateType: "follow-up" }}>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Template Type"
                  name="templateType"
                  rules={[{ required: true, message: "Please select template type" }]}
                >
                  <Select>
                    <Option value="follow-up">Follow-up on Opportunity</Option>
                    <Option value="proposal">Proposal Reminder</Option>
                    <Option value="meeting">Meeting Preparation</Option>
                    <Option value="thank-you">Thank You / Closing</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Select Opportunity"
                  name="opportunityId"
                  rules={[{ required: true, message: "Please select an opportunity" }]}
                >
                  <Select
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children || "")
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={(value) => {
                      const opp = opportunities.find((o) => o.id === value);
                      setSelectedOpportunity(opp);
                    }}
                  >
                    {opportunities.map((opp) => (
                      <Option key={opp.id} value={opp.id}>
                        {opp.title} - {opp.clientName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Recipient Email"
              rules={[{ required: true, message: "Please enter recipient email" }]}
            >
              <Input
                placeholder="Enter recipient email address..."
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                prefix={<MailOutlined />}
              />
            </Form.Item>

            <Divider />

            <Form.Item>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  const values = emailForm.getFieldsValue();
                  if (!values.templateType || !values.opportunityId) {
                    message.warning("Please select template type and opportunity first");
                    return;
                  }
                  handleGenerateEmail(values);
                }}
                loading={loading}
                className={styles.fullWidth}
              >
                Generate Email Template
              </Button>
            </Form.Item>

            <Form.Item>
              <Space className={styles.spaceBetween}>
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => {
                    if (!emailTemplate) {
                      message.warning("Please generate an email first");
                      return;
                    }
                    message.info("Preview mode - Email displayed below");
                  }}
                >
                  Preview
                </Button>
                <Space>
                  <Button
                    icon={<CopyOutlined />}
                    onClick={() => {
                      if (!emailTemplate) {
                        message.warning("Please generate an email first");
                        return;
                      }
                      copyToClipboard();
                    }}
                    disabled={!emailTemplate}
                  >
                    Copy
                  </Button>
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={() => {
                      if (!emailTemplate) {
                        message.warning("Please generate an email first");
                        return;
                      }
                      sendEmail();
                    }}
                    disabled={!emailTemplate}
                    loading={loading}
                  >
                    Send Email
                  </Button>
                </Space>
              </Space>
            </Form.Item>

            {emailTemplate && (
              <div className={styles.emailContentContainer}>
                <Text strong>Subject (Editable):</Text>
                <Input
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className={styles.emailSubject}
                  placeholder="Edit email subject..."
                />

                <Text strong>Email Content (Editable):</Text>
                <TextArea
                  value={emailTemplate}
                  onChange={(e) => setEmailTemplate(e.target.value)}
                  rows={8}
                  className={styles.emailContent}
                  placeholder="Edit your email content here..."
                />
                <Text type="secondary" className={styles.characterCount}>
                  {emailTemplate.length} characters
                </Text>
              </div>
            )}
          </Form>
        </Modal>
      </Spin>
    </div>
  );
};
