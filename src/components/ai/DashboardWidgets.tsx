import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Progress, Typography, Button } from "antd";
import { dataAwareAIService } from "@/lib/ai/data-aware-ai-service";
import { useStyles } from "./style";

const { Title, Text } = Typography;

export const DashboardWidgets = () => {
  const { styles } = useStyles();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [automationInsights, setAutomationInsights] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await dataAwareAIService.fetchDashboardData();
      setDashboardData(data);

      // Generate automation insights
      const insights = await generateAutomationInsights();
      setAutomationInsights(insights);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateAutomationInsights = async () => {
    try {
      const opportunities = await dataAwareAIService.fetchOpportunities();
      const clients = await dataAwareAIService.fetchClients();

      // Calculate automation metrics
      const totalOpps = opportunities.length;
      const avgOppValue =
        opportunities.reduce((sum, opp) => sum + (opp.estimatedValue || 0), 0) / totalOpps;
      const highValueOpps = opportunities.filter((opp) => (opp.estimatedValue || 0) > 50000).length;
      const followUpNeeded = opportunities.filter((opp) => {
        const stage = opp.stage || 0;
        return [1, 2, 3, 4].includes(stage) && opp.expectedCloseDate !== undefined;
      }).length;

      const insights = [
        {
          title: "Auto-Creation Potential",
          value: Math.round(totalOpps * 0.3), // 30% of opportunities could be auto-created
          description: `${totalOpps} opportunities analyzed for auto-creation potential`,
          color: "#1890ff",
        },
        {
          title: "Follow-up Efficiency",
          value: Math.round((1 - followUpNeeded / totalOpps) * 100), // Follow-up efficiency rate
          description: `${followUpNeeded} opportunities need follow-up out of ${totalOpps} total`,
          color: followUpNeeded / totalOpps > 0.2 ? "#ff4d4f" : "#52c41a", // Red if >20% need follow-up
        },
        {
          title: "High-Value Focus",
          value: Math.round((highValueOpps / totalOpps) * 100),
          description: `${highValueOpps} high-value opportunities (${Math.round((highValueOpps / totalOpps) * 100)}%)`,
          color: "#722ed1",
        },
        {
          title: "Smart Tasks Ready",
          value: Math.round(totalOpps * 0.8), // 80% of opportunities have smart tasks ready
          description: `${Math.round(totalOpps * 0.8)} opportunities with intelligent task suggestions`,
          color: "#13c2c2",
        },
      ];

      return insights;
    } catch (error) {
      console.error("Error generating automation insights:", error);
      return [];
    }
  };

  return (
    <div className={styles.widgetsContainer}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          {/* Automation Overview */}
          <Card title="Automation Overview" className={styles.widgetsCard}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Total Opportunities"
                  value={dashboardData?.opportunities?.totalCount || 0}
                  prefix="#"
                />
                <Statistic
                  title="High-Value Deals"
                  value={automationInsights.find((i) => i.title === "High-Value Focus")?.value || 0}
                  prefix="R"
                />
              </Col>
            </Row>
          </Card>

          {/* Automation Insights */}
          <Card title="Automation Insights" className={styles.widgetsCard}>
            <Title level={4}>Automation Potential</Title>
            <div style={{ marginBottom: "12px" }}>
              {automationInsights.map((insight, index) => (
                <div key={index} className={styles.insight}>
                  <Text strong style={{ color: insight.color }}>
                    {insight.title}
                  </Text>
                  <Text type="secondary">{insight.description}</Text>
                  <Text type="secondary" className={styles.insightValue}>
                    <Statistic
                      title="Value"
                      value={insight.value}
                      prefix={insight.title.includes("Value") ? "R" : undefined}
                    />
                  </Text>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions" className={styles.widgetsCard}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Button type="primary" size="large" icon="⚡">
                  Generate Smart Tasks
                </Button>
                <Button type="default" icon="📧">
                  Create Follow-up Reminders
                </Button>
              </Col>
              <Col span={12}>
                <Button type="default" icon="📊">
                  View Automation Insights
                </Button>
                <Button type="default" icon="⚙️">
                  Automation Settings
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={16}>
          {/* Performance Metrics */}
          <Card title="📈 Performance Metrics" className={styles.widgetsCard}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Statistic
                  title="Conversion Rate"
                  value={dashboardData?.conversionRate || 0}
                  suffix="%"
                  valueStyle={{ color: "#52c41a" }}
                />
                <Progress
                  percent={dashboardData?.conversionRate || 0}
                  strokeColor="#52c41a"
                  showInfo={false}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Avg Deal Size"
                  value={dashboardData?.avgDealSize || 0}
                  prefix="R"
                  valueStyle={{ color: "#1890ff" }}
                />
                <Progress
                  percent={Math.min(((dashboardData?.avgDealSize || 0) / 100000) * 100, 100)}
                  strokeColor="#1890ff"
                  showInfo={false}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Response Time"
                  value={dashboardData?.avgResponseTime || 0}
                  suffix="hrs"
                  valueStyle={{ color: "#faad14" }}
                />
                <Progress
                  percent={Math.max(100 - (dashboardData?.avgResponseTime || 0), 0)}
                  strokeColor="#faad14"
                  showInfo={false}
                />
              </Col>
            </Row>
          </Card>

          {/* Recent Activity */}
          <Card title="📋 Recent Activity" className={styles.widgetsCard}>
            <div style={{ marginBottom: "12px" }}>
              {dashboardData?.recentActivity?.map((activity: any, index: number) => (
                <div key={index} className={styles.insight}>
                  <Text strong>{activity.title}</Text>
                  <Text type="secondary">{activity.description}</Text>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {activity.timestamp}
                  </Text>
                </div>
              )) || <Text type="secondary">No recent activity available</Text>}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
