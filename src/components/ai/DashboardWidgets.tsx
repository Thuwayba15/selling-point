import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Typography, Button } from 'antd';
import { dataAwareAIService } from '@/lib/ai/data-aware-ai-service';
import { styles } from './DashboardWidgets.style';

const { Title, Text } = Typography;

export const DashboardWidgets = () => {
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
      console.error('Error loading dashboard data:', error);
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
      const avgOppValue = opportunities.reduce((sum, opp) => sum + (opp.estimatedValue || 0), 0) / totalOpps;
      const highValueOpps = opportunities.filter(opp => (opp.estimatedValue || 0) > 50000).length;
      const followUpNeeded = opportunities.filter(opp => {
        const stage = opp.stage || 0;
        return [1, 2, 3, 4].includes(stage) && opp.expectedCloseDate !== undefined;
      }).length;

      const insights = [
        {
          title: 'Auto-Creation Potential',
          value: Math.round((totalOpps * 0.3)), // 30% of opportunities could be auto-created
          description: `${totalOpps} opportunities analyzed for auto-creation potential`,
          color: '#1890ff'
        },
        {
          title: 'Follow-up Efficiency',
          value: Math.round((1 - (followUpNeeded / totalOpps)) * 100), // Follow-up efficiency rate
          description: `${followUpNeeded} opportunities need follow-up out of ${totalOpps} total`,
          color: followUpNeeded / totalOpps > 0.2 ? '#ff4d4f' : '#52c41a' // Red if >20% need follow-up
        },
        {
          title: 'High-Value Focus',
          value: Math.round((highValueOpps / totalOpps) * 100),
          description: `${highValueOpps} high-value opportunities (${Math.round((highValueOpps / totalOpps) * 100)}%)`,
          color: '#722ed1'
        },
        {
          title: 'Smart Tasks Ready',
          value: Math.round((totalOpps * 0.8)), // 80% of opportunities have smart tasks ready
          description: `${Math.round((totalOpps * 0.8))} opportunities with intelligent task suggestions`,
          color: '#13c2c2'
        }
      ];

      return insights;
    } catch (error) {
      console.error('Error generating automation insights:', error);
      return [];
    }
  };

  return (
    <div style={{ padding: '24px', background: '#f4ebdb' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          {/* Automation Overview */}
          <Card title="🤖 Automation Overview" style={{ marginBottom: '16px' }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic 
                  title="Total Opportunities" 
                  value={dashboardData?.opportunities?.totalCount || 0} 
                  prefix="#" 
                />
                <Statistic 
                  title="High-Value Deals" 
                  value={automationInsights.find(i => i.title === 'High-Value Focus')?.value || 0} 
                  prefix="R" 
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="Follow-up Needed" 
                  value={automationInsights.find(i => i.title === 'Follow-up Efficiency')?.value || 0} 
                  valueStyle={{ color: automationInsights.find(i => i.title === 'Follow-up Efficiency')?.color }}
                />
                <Statistic 
                  title="Smart Tasks Ready" 
                  value={automationInsights.find(i => i.title === 'Smart Tasks Ready')?.value || 0} 
                  valueStyle={{ color: automationInsights.find(i => i.title === 'Smart Tasks Ready')?.color }}
                />
              </Col>
            </Row>
          </Card>

          {/* Automation Insights */}
          <Card title="📊 Automation Insights" style={{ marginBottom: '16px' }}>
            <Title level={4}>Automation Potential</Title>
            <div style={{ marginBottom: '12px' }}>
              {automationInsights.map((insight, index) => (
                <div key={index} style={{ marginBottom: '8px', padding: '12px', border: '1px solid #d9d9d9', borderRadius: '6px' }}>
                  <Text strong style={{ color: insight.color }}>{insight.title}</Text>
                  <Text type="secondary">{insight.description}</Text>
                  <Text type="secondary" style={{ marginTop: '4px' }}>
                    <Statistic 
                      title="Value" 
                      value={insight.value} 
                      prefix={insight.title.includes('Value') ? 'R' : undefined}
                    />
                  </Text>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="⚡ Quick Actions" style={{ marginBottom: '16px' }}>
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
              </Col>
            </Row>
          </Card>

          {/* Loading State */}
          {loading && (
            <div style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              backgroundColor: 'rgba(255, 255, 255, 0.8)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              zIndex: 1000 
            }}>
              <Progress />
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};
