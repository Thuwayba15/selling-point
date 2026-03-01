"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Card, 
  Input, 
  Button, 
  Space, 
  Typography, 
  Avatar, 
  Spin, 
  message,
  FloatButton,
} from "antd";
import { 
  SendOutlined, 
  RobotOutlined, 
  UserOutlined, 
  CloseOutlined,
  MessageOutlined,
  BulbOutlined
} from "@ant-design/icons";
import { groqService } from "@/lib/ai/groq-service";
import { dataAwareAIService } from "@/lib/ai/data-aware-ai-service";
import useStyles from "./AIAssistant.style";

const { Text, Title } = Typography;

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQueries = [
  "Which opportunities are looking good?",
  "What's my current pipeline value?",
  "Show me my high-value opportunities (over R50,000)",
  "Which clients need follow-up?",
  "What's my win rate looking like?",
  "How many opportunities are closing soon?"
];

const formatMessageContent = (content: string) => {
    // Convert markdown-style formatting to HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>• $1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^(.+)$/gm, '<p>$1</p>')
      .replace(/<p><li>/g, '<ul><li>')
      .replace(/<\/li><\/p>/g, '</li></ul>')
      .replace(/<p><\/p>/g, '');
  };

export const AIAssistant = () => {
  const { styles } = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Use data-aware service for real data integration
      const response = await dataAwareAIService.chatWithRealData(input.trim());

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: formatMessageContent(response),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("AI Assistant error:", error);
      
      let errorMessage = "Sorry, I'm having trouble connecting. Please try again.";
      let fallbackResponse = "";
      
      if (error instanceof Error) {
        if (error.message.includes("API key not configured")) {
          errorMessage = "AI service not configured. Please add your Groq API key to continue.";
          fallbackResponse = "I'm your AI assistant for the Selling Point CRM! I can help you with:\n\n• Analyzing sales data and opportunities\n• Finding insights about your clients\n• Suggesting next steps for deals\n• Answering questions about your pipeline\n\nTo get started, please configure your Groq API key in the environment variables.";
        } else if (error.message.includes("model_decommissioned") || error.message.includes("decommissioned")) {
          errorMessage = "AI model updated. The service has been updated with a new model.";
          fallbackResponse = "I've been updated with a new AI model! Please try your question again. I'm here to help you with your CRM data, sales insights, and business questions.";
        } else if (error.message.includes("400")) {
          errorMessage = "Invalid request format. Please try rephrasing your question.";
          fallbackResponse = "I didn't quite understand that. Could you try rephrasing your question? For example, you could ask about your sales pipeline, client information, or opportunities.";
        } else if (error.message.includes("401")) {
          errorMessage = "Invalid API key. Please check your Groq API configuration.";
          fallbackResponse = "There's an issue with the API configuration. Please check your Groq API key and try again.";
        } else if (error.message.includes("429")) {
          errorMessage = "Too many requests. Please wait a moment and try again.";
          fallbackResponse = "I'm processing too many requests right now. Please wait a moment and try again.";
        } else if (error.message.includes("500")) {
          errorMessage = "AI service is temporarily unavailable. Please try again later.";
          fallbackResponse = "The AI service is temporarily unavailable. Please try again in a few moments.";
        } else {
          errorMessage = `Error: ${error.message}`;
          fallbackResponse = "I encountered an unexpected error. Please try again or contact support if the issue persists.";
        }
      }
      
      // Add fallback response
      if (fallbackResponse) {
        const fallbackMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: fallbackResponse,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, fallbackMessage]);
      }
      
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuery = (query: string) => {
    setInput(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setUnreadCount(0);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setUnreadCount(0);
  };

  return (
    <>
      {/* Floating Action Button */}
      <FloatButton
        icon={<MessageOutlined />}
        type="primary"
        style={{
          right: 24,
          bottom: 24,
          width: 56,
          height: 56,
        }}
        onClick={toggleOpen}
        badge={unreadCount > 0 ? { count: unreadCount } : undefined}
      />

      {/* Chat Window */}
      {isOpen && (
        <Card
          className={styles.chatWindow}
          styles={{ body: { padding: 0, height: '100%', display: 'flex', flexDirection: 'column' } }}
          title={
            <div className={styles.chatHeader}>
              <Space>
                <Avatar 
                  size="small" 
                  icon={<RobotOutlined />} 
                  className={styles.avatar}
                />
                <div>
                  <Title level={5} className={styles.title}>
                    AI Assistant
                  </Title>
                  <Text type="secondary" className={styles.subtitle}>
                    Your CRM Helper
                  </Text>
                </div>
              </Space>
              <Space>
                <Button
                  type="text"
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={toggleOpen}
                  className={styles.closeButton}
                />
              </Space>
            </div>
          }
          extra={
            <Button
              type="text"
              size="small"
              onClick={clearChat}
              className={styles.clearButton}
            >
              Clear
            </Button>
          }
        >
          {/* Messages Container */}
          <div className={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div className={styles.welcomeMessage}>
                <div className={styles.welcomeContent}>
                  <BulbOutlined className={styles.welcomeIcon} />
                  <Title level={4}>Hello! I'm your AI Assistant</Title>
                  <Text type="secondary">
                    I can help you with CRM guidance and provide insights based on your actual sales data, opportunities, and clients.
                  </Text>
                  
                  <div className={styles.suggestions}>
                    <Text strong>Try asking:</Text>
                    <div className={styles.suggestionButtons}>
                      {suggestedQueries.map((query: string, index: number) => (
                        <Button
                          key={index}
                          size="small"
                          type="dashed"
                          onClick={() => handleSuggestedQuery(query)}
                          className={styles.suggestionButton}
                        >
                          {query}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.messagesList}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`${styles.message} ${message.role === 'user' ? styles.user : styles.assistant}`}
                  >
                    <Avatar
                      size="small"
                      icon={message.role === "user" ? <UserOutlined /> : <RobotOutlined />}
                      className={styles.messageAvatar}
                    />
                    <div className={styles.messageContent}>
                      <div className={styles.messageBubble}>
                        <div 
                          dangerouslySetInnerHTML={{ __html: message.content }}
                          className={styles.messageContent}
                        />
                      </div>
                      <Text type="secondary" className={styles.messageTime}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Text>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className={`${styles.message} ${styles.assistant}`}>
                    <Avatar
                      size="small"
                      icon={<RobotOutlined />}
                      className={styles.messageAvatar}
                    />
                    <div className={styles.messageContent}>
                      <div className={styles.messageBubble}>
                        <Spin size="small" />
                        <Text type="secondary"> Thinking...</Text>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className={styles.inputArea}>
            <Space.Compact style={{ width: "100%" }}>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your CRM..."
                disabled={isLoading}
                className={styles.messageInput}
                suffix={
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    className={styles.sendButton}
                  />
                }
              />
            </Space.Compact>
          </div>
        </Card>
      )}
    </>
  );
};
