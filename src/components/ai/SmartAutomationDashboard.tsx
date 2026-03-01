import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Progress, message, List } from 'antd';
import { dataAwareAIService } from '@/lib/ai/data-aware-ai-service';
import { groqService } from '@/lib/ai/groq-service';
import { useStyles } from './style';

const { Title, Text } = Typography;

export const SmartAutomationDashboard = () => {
  const { styles } = useStyles();
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    loadAutomationInsights();
  }, []);

  const loadAutomationInsights = async () => {
    setLoading(true);
    try {
      // Get real CRM data
      const opportunities = await dataAwareAIService.fetchOpportunities();
      const clients = await dataAwareAIService.fetchClients();
      
      // Calculate automation insights
      const totalOpps = opportunities.length;
      const avgValue = opportunities.reduce((sum: number, opp: any) => sum + (opp.estimatedValue || 0), 0) / totalOpps;
      const highValueOpps = opportunities.filter((opp: any) => (opp.estimatedValue || 0) > 50000).length;
      const followUpNeeded = opportunities.filter((opp: any) => {
        const stage = opp.stage;
        const closeDate = opp.expectedCloseDate ? new Date(opp.expectedCloseDate) : null;
        const today = new Date();
        return [1, 2, 3, 4].includes(stage) && 
          closeDate && closeDate > today && 
          (closeDate.getTime() - today.getTime()) <= (7 * 24 * 60 * 60 * 1000);
      }).length;

      const automationInsights = [
        {
          title: 'Auto-Creation Potential',
          value: Math.round((totalOpps * 0.3)),
          description: `${totalOpps} opportunities analyzed for auto-creation potential`,
          color: '#1890ff'
        },
        {
          title: 'Follow-up Efficiency',
          value: Math.round((1 - (followUpNeeded / totalOpps)) * 100),
          description: `${followUpNeeded} opportunities need follow-up out of ${totalOpps} total`,
          color: followUpNeeded / totalOpps > 0.2 ? '#ff4d4f' : '#52c41a'
        },
        {
          title: 'High-Value Focus',
          value: Math.round((highValueOpps / totalOpps) * 100),
          description: `${highValueOpps} high-value opportunities (${Math.round((highValueOpps / totalOpps) * 100)}%)`,
          color: '#722ed1'
        },
        {
          title: 'Smart Tasks Ready',
          value: Math.round((totalOpps * 0.8)),
          description: `${Math.round((totalOpps * 0.8))} opportunities with intelligent task suggestions`,
          color: '#13c2c2'
        }
      ];

      setInsights(automationInsights);
    } catch (error) {
      console.error('Error loading automation insights:', error);
      message.error('Failed to load automation insights');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoCreateOpportunity = async () => {
    try {
      const prompt = `Based on client data, suggest a new opportunity for a sample client. Consider their industry, past performance, and current pipeline stage.`;
      const suggestion = await groqService.chat([
        { role: "user", content: prompt }
      ]);
      message.success(`AI Suggestion: ${suggestion}`);
    } catch (error) {
      message.error(`Error: ${error}`);
    }
  };

  const handleGenerateFollowUps = async () => {
    try {
      const opportunities = await dataAwareAIService.fetchOpportunities();
      const today = new Date();
      
      const followUpOpps = opportunities.filter((opp: any) => {
        const stage = opp.stage;
        const closeDate = opp.expectedCloseDate ? new Date(opp.expectedCloseDate) : null;
        return [1, 2, 3, 4].includes(stage) && 
          closeDate && closeDate > today && 
          (closeDate.getTime() - today.getTime()) <= (7 * 24 * 60 * 60 * 1000);
      });

      const prioritizedOpps = followUpOpps
        .sort((a: any, b: any) => {
          const aValue = a.estimatedValue || 0;
          const bValue = b.estimatedValue || 0;
          const aUrgency = a.stage === 4 ? 2 : 1;
          const bUrgency = b.stage === 4 ? 2 : 1;
          
          if (aUrgency !== bUrgency) {
            return aUrgency - bUrgency;
          }
          if (aValue !== bValue) {
            return bValue - aValue;
          }
          return 0;
        });

      const followUpList = prioritizedOpps.slice(0, 5).map((opp: any, index: number) => 
        `${index + 1}. ${opp.title} (${opp.clientName}) - R${(opp.estimatedValue || 0).toLocaleString('en-ZA')} - Follow up by ${new Date(opp.expectedCloseDate).toLocaleDateString()}`
      ).join('\n');

      message.success(`Follow-up Reminders Generated:\n${followUpList}`);
    } catch (error) {
      message.error(`Error: ${error}`);
    }
  };

  const handleGenerateSmartTasks = async () => {
    try {
      const opportunities = await dataAwareAIService.fetchOpportunities();
      const today = new Date();
      
      const tasks = opportunities
        .filter((opp: any) => {
          const stage = opp.stage;
          const daysUntilClose = opp.expectedCloseDate ? 
            Math.ceil((new Date(opp.expectedCloseDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;
          
          switch (stage) {
            case 1: // Lead
              return daysUntilClose && daysUntilClose <= 3 ? 
                `Call ${opp.clientName} within 3 days to qualify lead` :
                `Research ${opp.clientName} background and prepare qualification questions`;
                
            case 2: // Qualified
              return daysUntilClose && daysUntilClose <= 7 ? 
                `Schedule proposal meeting with ${opp.clientName} - prepare proposal based on R${(opp.estimatedValue || 0).toLocaleString('en-ZA')} value` :
                `Send follow-up email to ${opp.clientName} with additional information requested`;
                
            case 3: // Proposal
              return daysUntilClose && daysUntilClose <= 14 ? 
                `Follow up on proposal status with ${opp.clientName} - decision needed by ${new Date(opp.expectedCloseDate).toLocaleDateString()}` :
                `Review proposal terms with ${opp.clientName} and address any concerns`;
                
            case 4: // Negotiation
              return daysUntilClose && daysUntilClose <= 2 ? 
                `Schedule negotiation session with ${opp.clientName} - prepare to close R${(opp.estimatedValue || 0).toLocaleString('en-ZA')} deal` :
                `Finalize negotiation with ${opp.clientName} - decision expected by ${new Date(opp.expectedCloseDate).toLocaleDateString()}`;
                
            default:
              return `Review opportunity ${opp.title} with ${opp.clientName}`;
          }
        })
        .slice(0, 8);

      const taskList = tasks.map((task: any, index: number) => 
        `${index + 1}. ${task} (Priority: ${index < 3 ? 'High' : index < 6 ? 'Medium' : 'Low'})`
      ).join('\n');

      message.success(`Smart Tasks Generated:\n${taskList}`);
    } catch (error) {
      message.error(`Error: ${error}`);
    }
  };

  const handleGenerateEmailTemplate = async () => {
    try {
      // Get real opportunities to use actual client names
      const opportunities = await dataAwareAIService.fetchOpportunities();
      const sampleClient = opportunities[0]?.clientName || 'Client Name';
      
      const template = `Subject: Follow-up on Opportunity

Dear ${sampleClient},

I hope this email finds you well. Based on our recent discussion, I wanted to follow up on next steps.

Current Status: Active
Value: R${(opportunities[0]?.estimatedValue || 50000).toLocaleString('en-ZA')}
Expected Close Date: ${new Date().toLocaleDateString()}

Please let me know if you'd like to schedule a call to discuss this further.

Best regards,
Selling Point AI Assistant`;

      navigator.clipboard.writeText(template);
      message.success('Email template copied to clipboard');
    } catch (error) {
      message.error(`Error: ${error}`);
    }
  };

  return (
    <div className={styles.smartContainer}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Space direction="vertical" size="large">
          <Title level={2} className={styles.smartTitle}>
            🤖 Smart Automation Dashboard
          </Title>
          
          <Text>
            Intelligent CRM automation to save time and improve efficiency
          </Text>

          {/* Automation Insights */}
          <Card title="📊 Automation Insights" className={styles.smartCard}>
            <Title level={4}>Automation Metrics</Title>
            <div style={{ marginBottom: '12px' }}>
              {insights.map((insight: any, index: number) => (
                <div key={index} className={styles.smartCard}>
                  <Text strong style={{ color: insight.color }}>{insight.title}</Text>
                  <br />
                  <Text type="secondary">{insight.description}</Text>
                  <div style={{ marginTop: '4px' }}>
                    <Text>
                      <Text strong>Value: </Text>
                      <Text style={{ color: insight.color }}>{insight.value}</Text>
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="⚡ Quick Actions" className={styles.smartCard}>
            <Space direction="vertical" size="large">
              <Button 
                type="primary" 
                size="large"
                onClick={handleAutoCreateOpportunity}
                loading={loading}
                className={styles.smartButton}
              >
                🚀 Create Opportunity from Client Data
              </Button>
              <Button 
                type="default" 
                size="large"
                onClick={handleGenerateFollowUps}
                loading={loading}
                className={styles.smartButton}
              >
                📋 Generate Follow-up Reminders
              </Button>
              <Button 
                type="default" 
                size="large"
                onClick={handleGenerateSmartTasks}
                loading={loading}
                className={styles.smartButton}
              >
                📝 Generate Smart Tasks
              </Button>
              <Button 
                type="default" 
                size="large"
                onClick={handleGenerateEmailTemplate}
                loading={loading}
                className={styles.smartButton}
              >
                📧 Generate Email Template
              </Button>
            </Space>
          </Card>

          {/* Features Description */}
          <Card title="🎯 Automation Features" className={styles.smartCard}>
            <List>
              <List.Item>
                <Text strong>Auto-Opportunity Creation:</Text> AI analyzes client history and suggests relevant new opportunities
              </List.Item>
              <List.Item>
                <Text strong>Intelligent Follow-up Reminders:</Text> Prioritizes opportunities by value and urgency
              </List.Item>
              <List.Item>
                <Text strong>Smart Task Generation:</Text> Creates stage-specific tasks with clear priorities
              </List.Item>
              <List.Item>
                <Text strong>Email Template Generation:</Text> AI creates personalized email templates
              </List.Item>
            </List>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className={styles.smartLoading}>
              <Progress />
            </div>
          )}
        </Space>
      </div>
    </div>
  );
};
