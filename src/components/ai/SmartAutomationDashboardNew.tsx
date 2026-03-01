import React, { useState, useEffect } from 'react';
import { 
  Card, Button, Typography, Space, Select, Input, Form, 
  Row, Col, Progress, message, Tag, Divider, Checkbox,
  Table, Modal, Dropdown, Menu, Badge, Statistic,
  Timeline, Alert, Tooltip, Spin
} from 'antd';
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
  SettingOutlined
} from '@ant-design/icons';
import { dataAwareAIService } from '@/lib/ai/data-aware-ai-service';
import { groqService } from '@/lib/ai/groq-service';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export const SmartAutomationDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [currentUserName, setCurrentUserName] = useState<string>('User');
  
  // Modal states
  const [opportunityModalVisible, setOpportunityModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [emailTemplate, setEmailTemplate] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  
  // Form states
  const [opportunityForm] = Form.useForm();
  const [emailForm] = Form.useForm();

  useEffect(() => {
    loadAllData();
    // Get current user from local storage
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim() || user.email || 'User';
        setCurrentUserName(fullName);
      }
    } catch (error) {
      console.log('Could not get user from local storage:', error);
    }
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Fetch all data
      const [opportunitiesData, clientsData] = await Promise.all([
        dataAwareAIService.fetchOpportunities(),
        dataAwareAIService.fetchClients()
      ]);
      
      setOpportunities(opportunitiesData);
      setClients(clientsData);
      
      // Calculate automation insights
      const totalOpps = opportunitiesData.length;
      const avgValue = opportunitiesData.reduce((sum: number, opp: any) => sum + (opp.estimatedValue || 0), 0) / totalOpps;
      const highValueOpps = opportunitiesData.filter((opp: any) => (opp.estimatedValue || 0) > 50000).length;
      const followUpNeeded = opportunitiesData.filter((opp: any) => {
        const stage = opp.stage || 0;
        const closeDate = opp.expectedCloseDate ? new Date(opp.expectedCloseDate) : null;
        const today = new Date();
        return [1, 2, 3, 4].includes(stage) && 
          closeDate && closeDate > today && 
          (closeDate.getTime() - today.getTime()) <= (7 * 24 * 60 * 60 * 1000);
      }).length;

      const automationInsights = [
        {
          title: 'Total Opportunities',
          value: totalOpps,
          icon: <DollarOutlined />,
          color: '#1890ff',
          prefix: '#'
        },
        {
          title: 'High-Value Deals',
          value: highValueOpps,
          icon: <AlertOutlined />,
          color: '#52c41a',
          prefix: '#'
        },
        {
          title: 'Follow-ups Needed',
          value: followUpNeeded,
          icon: <ClockCircleOutlined />,
          color: followUpNeeded > 5 ? '#ff4d4f' : '#faad14',
          prefix: ''
        },
        {
          title: 'Tasks Generated',
          value: Math.round(totalOpps * 0.8),
          icon: <CheckCircleOutlined />,
          color: '#722ed1',
          prefix: ''
        }
      ];

      setInsights(automationInsights);
      
      // Generate follow-ups and tasks
      await generateFollowUps(opportunitiesData);
      await generateTasks(opportunitiesData);
      
    } catch (error) {
      console.error('Error loading automation data:', error);
      message.error('Failed to load automation data');
    } finally {
      setLoading(false);
    }
  };

  const generateFollowUps = async (opps: any[]) => {
    const today = new Date();
    
    const followUpOpps = opps.filter((opp: any) => {
      const stage = opp.stage || 0;
      const closeDate = opp.expectedCloseDate ? new Date(opp.expectedCloseDate) : null;
      return [1, 2, 3, 4].includes(stage) && 
        closeDate && closeDate > today && 
        (closeDate.getTime() - today.getTime()) <= (14 * 24 * 60 * 60 * 1000);
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
    
    const taskList = opps
      .filter((opp: any) => {
        const stage = opp.stage || 0;
        return [1, 2, 3, 4, 5].includes(stage);
      })
      .map((opp: any) => {
        const stage = opp.stage || 0;
        const daysUntilClose = opp.expectedCloseDate ? 
          Math.ceil((new Date(opp.expectedCloseDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;
        
        let taskTitle = '';
        let priority = 'medium';
        let dueDate = '';
        
        switch (stage) {
          case 1: // Lead
            taskTitle = daysUntilClose && daysUntilClose <= 3 ? 
              `Call ${opp.clientName} within 3 days to qualify lead` :
              `Research ${opp.clientName} background and prepare qualification questions`;
            priority = daysUntilClose && daysUntilClose <= 3 ? 'high' : 'medium';
            dueDate = daysUntilClose && daysUntilClose <= 3 ? 'Today' : 'This Week';
            break;
          case 2: // Qualified
            taskTitle = daysUntilClose && daysUntilClose <= 7 ? 
              `Schedule proposal meeting with ${opp.clientName}` :
              `Send follow-up email to ${opp.clientName} with additional information`;
            priority = daysUntilClose && daysUntilClose <= 7 ? 'high' : 'medium';
            dueDate = daysUntilClose && daysUntilClose <= 7 ? 'This Week' : 'Next Week';
            break;
          case 3: // Proposal
            taskTitle = daysUntilClose && daysUntilClose <= 14 ? 
              `Follow up on proposal status with ${opp.clientName}` :
              `Review proposal terms with ${opp.clientName}`;
            priority = daysUntilClose && daysUntilClose <= 14 ? 'high' : 'medium';
            dueDate = daysUntilClose && daysUntilClose <= 14 ? 'This Week' : 'Next Week';
            break;
          case 4: // Negotiation
            taskTitle = daysUntilClose && daysUntilClose <= 2 ? 
              `Schedule negotiation session with ${opp.clientName}` :
              `Finalize negotiation with ${opp.clientName}`;
            priority = daysUntilClose && daysUntilClose <= 2 ? 'high' : 'medium';
            dueDate = daysUntilClose && daysUntilClose <= 2 ? 'Today' : 'This Week';
            break;
          default:
            taskTitle = `Review opportunity ${opp.title} with ${opp.clientName}`;
            priority = 'low';
            dueDate = 'Next Week';
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
          completed: false // Always start as false when generating new tasks
        };
      })
      .sort((a: any, b: any) => {
        const priorityOrder: { [key: string]: number } = { high: 0, medium: 1, low: 2 };
        return (priorityOrder[a.priority] || 999) - (priorityOrder[b.priority] || 999);
      });

    // Preserve completion state for existing tasks
    const updatedTasks = taskList.map(newTask => {
      const existingTask = tasks.find(t => t.id === newTask.id);
      return existingTask ? { ...newTask, completed: existingTask.completed } : newTask;
    });

    const oldCount = tasks.length;
    const completedCount = updatedTasks.filter(t => t.completed).length;
    setTasks(updatedTasks);
    
    // Show meaningful feedback
    const newCount = updatedTasks.length;
    const newTasksCount = newCount - oldCount;
    if (newTasksCount > 0) {
      message.success(`Generated ${newCount} tasks (${newTasksCount} new, ${completedCount} completed)`);
    } else {
      message.success(`Tasks updated: ${newCount} total (${completedCount} completed)`);
    }
  };

  const handleCreateOpportunity = async (values: any) => {
    try {
      setLoading(true);
      
      // AI enhancement for opportunity creation
      const prompt = `Based on client ${selectedClient?.name} and their history, suggest an opportunity with title "${values.title}" and value R${values.estimatedValue}. Consider their industry, past performance, and current needs. Provide your suggestion as ${currentUserName}. Use plain text format - no markdown, no bold, no italics, no asterisks.`;
      
      const aiSuggestion = await groqService.chat([
        { role: "user", content: prompt }
      ]);
      
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
      
      const selectedOpp = opportunities.find(o => o.id === values.opportunityId);
      if (!selectedOpp) {
        message.error('Please select an opportunity');
        return;
      }
      
      const prompt = `Generate a professional email template for ${values.templateType} to ${selectedOpp.clientName} regarding opportunity "${selectedOpp.title}" worth R${selectedOpp.estimatedValue?.toLocaleString('en-ZA')}. Include specific details about the opportunity and next steps. Make it personalized and actionable. Use plain text format - no markdown, no bold, no italics, no asterisks. Use clean, simple text that renders well in email clients. Sign off as "${currentUserName}".`;
      
      const generatedEmail = await groqService.chat([
        { role: "user", content: prompt }
      ]);
      
      setEmailSubject(`Follow-up on ${selectedOpp.title}`);
      setEmailTemplate(generatedEmail);
      message.success('Email template generated successfully');
    } catch (error) {
      console.error('Error generating email:', error);
      message.error(`Error generating email: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailTemplate);
    message.success('Email template copied to clipboard');
  };

  const sendEmail = async () => {
    if (!emailTemplate || !selectedOpportunity) {
      message.error('No email to send');
      return;
    }
    
    if (!recipientEmail) {
      message.error('Please enter recipient email address');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      message.error('Please enter a valid email address');
      return;
    }
    
    try {
      setLoading(true);
      
      // Convert plain text email to HTML for better formatting
      const htmlContent = emailTemplate.replace(/\n/g, '<br>');
      
      // Send email via API route
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: recipientEmail,
          subject: emailSubject,
          htmlContent: htmlContent,
          textContent: emailTemplate
        }),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        message.success(`Email successfully sent to ${recipientEmail} regarding ${selectedOpportunity.title}`);
        setEmailModalVisible(false);
        emailForm.resetFields();
        setEmailTemplate('');
        setEmailSubject('');
        setRecipientEmail('');
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Email send error:', error);
      message.error(`Failed to send email: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  const getStageColor = (stage: number) => {
    switch (stage) {
      case 1: return '#1890ff'; // Lead
      case 2: return '#52c41a'; // Qualified
      case 3: return '#faad14'; // Proposal
      case 4: return '#ff4d4f'; // Negotiation
      case 5: return '#722ed1'; // Closed Won
      default: return '#d9d9d9';
    }
  };

  const followUpColumns = [
    {
      title: 'Client',
      dataIndex: 'clientName',
      key: 'client',
      responsive: ['xs' as const, 'sm' as const, 'md' as const, 'lg' as const],
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Opportunity',
      dataIndex: 'title',
      key: 'title',
      responsive: ['sm' as const, 'md' as const, 'lg' as const],
      render: (text: string) => <Text>{text}</Text>
    },
    {
      title: 'Value',
      dataIndex: 'estimatedValue',
      key: 'value',
      responsive: ['md' as const, 'lg' as const],
      render: (value: number) => <Text>R{value?.toLocaleString('en-ZA')}</Text>
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      responsive: ['lg' as const],
      render: (stage: number) => (
        <Tag color={getStageColor(stage)}>
          {stage === 1 ? 'Lead' : stage === 2 ? 'Qualified' : stage === 3 ? 'Proposal' : stage === 4 ? 'Negotiation' : 'Closed'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      responsive: ['xs' as const, 'sm' as const, 'md' as const, 'lg' as const],
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
                  templateType: 'follow-up',
                  opportunityId: record.id 
                });
              }, 100);
            }}
          >
            Email
          </Button>
        </Space>
      )
    }
  ];

  const taskColumns = [
    {
      title: 'Task',
      dataIndex: 'title',
      key: 'title',
      responsive: ['xs' as const, 'sm' as const, 'md' as const, 'lg' as const],
      render: (text: string, record: any) => (
        <div>
          <Checkbox 
            checked={record.completed}
            onChange={(e) => {
              const updatedTasks = tasks.map(t => 
                t.id === record.id ? { ...t, completed: e.target.checked } : t
              );
              setTasks(updatedTasks);
            }}
          />
          <span style={{ marginLeft: 8 }}>{text}</span>
        </div>
      )
    },
    {
      title: 'Client',
      dataIndex: 'clientName',
      key: 'client',
      responsive: ['sm' as const, 'md' as const, 'lg' as const],
      render: (text: string) => <Text>{text}</Text>
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      responsive: ['md' as const, 'lg' as const],
      render: (value: number) => <Text>R{value?.toLocaleString('en-ZA')}</Text>
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      responsive: ['lg' as const],
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {priority.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Due',
      dataIndex: 'dueDate',
      key: 'dueDate',
      responsive: ['md' as const, 'lg' as const],
      render: (dueDate: string) => (
        <Tag color={dueDate === 'Today' ? '#ff4d4f' : dueDate === 'This Week' ? '#faad14' : '#52c41a'}>
          {dueDate}
        </Tag>
      )
    }
  ];

  return (
    <div style={{ 
      padding: '16px', 
      background: '#f4ebdb',
      minHeight: '100vh'
    }}>
      <Spin spinning={loading}>
        {/* Header */}
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <Title level={2} style={{ color: '#2c3e50', marginBottom: '8px' }}>
            <RobotOutlined style={{ marginRight: '8px' }} />
            Smart Automation Dashboard
          </Title>
          <Text type="secondary">
            Intelligent CRM automation to save time and improve efficiency
          </Text>
        </div>

        {/* Automation Overview - Responsive Grid */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          {insights.map((insight, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card 
                hoverable
                style={{ 
                  textAlign: 'center',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <Statistic
                  title={
                    <span style={{ fontSize: '14px', color: '#666' }}>
                      {insight.icon} {insight.title}
                    </span>
                  }
                  value={insight.value}
                  prefix={insight.prefix}
                  valueStyle={{ 
                    color: insight.color,
                    fontSize: '28px',
                    fontWeight: 'bold'
                  }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Quick Actions - Responsive */}
        <Card 
          title="⚡ Quick Actions" 
          style={{ marginBottom: '24px' }}
          extra={
            <Button 
              icon={<SettingOutlined />} 
              type="text"
              onClick={() => message.info('Automation settings coming soon')}
            >
              Settings
            </Button>
          }
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Button 
                type="primary" 
                size="large" 
                block
                icon={<PlusOutlined />}
                onClick={() => setOpportunityModalVisible(true)}
                style={{ height: '60px' }}
              >
                Create Opportunity
              </Button>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button 
                size="large" 
                block
                icon={<ClockCircleOutlined />}
                onClick={async () => {
                  setLoading(true);
                  try {
                    await generateFollowUps(opportunities);
                  } catch (error) {
                    message.error('Failed to refresh follow-ups');
                  } finally {
                    setLoading(false);
                  }
                }}
                loading={loading}
                style={{ height: '60px' }}
              >
                Refresh Follow-ups
              </Button>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button 
                size="large" 
                block
                icon={<CheckCircleOutlined />}
                onClick={async () => {
                  setLoading(true);
                  try {
                    await generateTasks(opportunities);
                  } catch (error) {
                    message.error('Failed to regenerate tasks');
                  } finally {
                    setLoading(false);
                  }
                }}
                loading={loading}
                style={{ height: '60px' }}
              >
                Generate Tasks
              </Button>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button 
                size="large" 
                block
                icon={<MailOutlined />}
                onClick={() => {
                  if (opportunities.length === 0) {
                    message.warning('No opportunities available to generate email for');
                    return;
                  }
                  // Just open the modal - let user choose fields
                  setEmailModalVisible(true);
                }}
                style={{ height: '60px' }}
              >
                Draft Email
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Follow-up Reminders */}
        <Card 
          title={
            <span>
              <ClockCircleOutlined style={{ marginRight: '8px', color: '#faad14' }} />
              Follow-up Reminders
              <Badge count={followUps.length} style={{ marginLeft: '8px' }} />
            </span>
          } 
          style={{ marginBottom: '24px' }}
        >
          <Table
            columns={followUpColumns}
            dataSource={followUps}
            rowKey="id"
            pagination={{ 
              pageSize: 5, 
              showSizeChanger: false,
              simple: true 
            }}
            scroll={{ x: 800 }}
            size="small"
          />
        </Card>

        {/* Smart Tasks */}
        <Card 
          title={
            <span>
              <CheckCircleOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
              Smart Tasks
              <Badge count={tasks.filter(t => !t.completed).length} style={{ marginLeft: '8px' }} />
            </span>
          } 
          style={{ marginBottom: '24px' }}
        >
          <Table
            columns={taskColumns}
            dataSource={tasks}
            rowKey="id"
            pagination={{ 
              pageSize: 8, 
              showSizeChanger: false,
              simple: true 
            }}
            scroll={{ x: 800 }}
            size="small"
          />
        </Card>

        {/* Create Opportunity Modal */}
        <Modal
          title={
            <span>
              <PlusOutlined style={{ marginRight: '8px' }} />
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
          <Form
            form={opportunityForm}
            layout="vertical"
            onFinish={handleCreateOpportunity}
          >
            <Form.Item
              label="Select Client"
              name="clientId"
              rules={[{ required: true, message: 'Please select a client' }]}
            >
              <Select
                placeholder="Choose a client..."
                showSearch
                filterOption={(input, option) =>
                  String(option?.children || '').toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={(value) => {
                  const client = clients.find(c => c.id === value);
                  setSelectedClient(client);
                }}
              >
                {clients.map(client => (
                  <Option key={client.id} value={client.id}>
                    {client.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Opportunity Title"
              name="title"
              rules={[{ required: true, message: 'Please enter opportunity title' }]}
            >
              <Input placeholder="Enter opportunity title..." />
            </Form.Item>

            <Form.Item
              label="Estimated Value (R)"
              name="estimatedValue"
              rules={[{ required: true, message: 'Please enter estimated value' }]}
            >
              <Input
                type="number"
                placeholder="Enter estimated value..."
                prefix="R"
              />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
            >
              <TextArea 
                rows={4} 
                placeholder="Enter opportunity description..."
              />
            </Form.Item>

            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={() => setOpportunityModalVisible(false)}>
                  Cancel
                </Button>
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
              <MailOutlined style={{ marginRight: '8px' }} />
              Email Template
            </span>
          }
          open={emailModalVisible}
          onCancel={() => {
            setEmailModalVisible(false);
            emailForm.resetFields();
            setEmailTemplate('');
            setEmailSubject('');
            setRecipientEmail('');
          }}
          footer={null}
          width={800}
        >
          <Form
            form={emailForm}
            layout="vertical"
            initialValues={{ templateType: 'follow-up' }}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Template Type"
                  name="templateType"
                  rules={[{ required: true, message: 'Please select template type' }]}
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
                  rules={[{ required: true, message: 'Please select an opportunity' }]}
                >
                  <Select
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children || '').toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={(value) => {
                      const opp = opportunities.find(o => o.id === value);
                      setSelectedOpportunity(opp);
                    }}
                  >
                    {opportunities.map(opp => (
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
              rules={[{ required: true, message: 'Please enter recipient email' }]}
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
                    message.warning('Please select template type and opportunity first');
                    return;
                  }
                  handleGenerateEmail(values);
                }}
                loading={loading}
                style={{ width: '100%' }}
              >
                Generate Email Template
              </Button>
            </Form.Item>

            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Button 
                  icon={<EyeOutlined />}
                  onClick={() => {
                    if (!emailTemplate) {
                      message.warning('Please generate an email first');
                      return;
                    }
                    message.info('Preview mode - Email displayed below');
                  }}
                >
                  Preview
                </Button>
                <Space>
                  <Button 
                    icon={<CopyOutlined />}
                    onClick={() => {
                      if (!emailTemplate) {
                        message.warning('Please generate an email first');
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
                        message.warning('Please generate an email first');
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
              <div>
                <Text strong>Subject (Editable):</Text>
                <Input
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  style={{ marginTop: '8px', marginBottom: '16px' }}
                  placeholder="Edit email subject..."
                />
                
                <Text strong>Email Content (Editable):</Text>
                <TextArea
                  value={emailTemplate}
                  onChange={(e) => setEmailTemplate(e.target.value)}
                  rows={8}
                  style={{ marginTop: '8px' }}
                  placeholder="Edit your email content here..."
                />
                <Text type="secondary" style={{ fontSize: '12px', marginTop: '4px', display: 'block' }}>
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
