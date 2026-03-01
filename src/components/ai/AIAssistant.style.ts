import { createStyles } from "antd-style";

const useStyles = createStyles(({ token, css }) => ({
  chatWindow: css`
    position: fixed;
    right: 24px;
    bottom: 90px;
    width: 380px;
    height: 600px;
    z-index: 1000;
    border-radius: ${token.borderRadiusLG}px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    border: 1px solid ${token.colorBorder};
    display: flex;
    flex-direction: column;
    
    @media (max-width: 480px) {
      width: calc(100vw - 32px);
      height: calc(100vh - 120px);
      right: 16px;
      bottom: 80px;
    }
  `,

  chatHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
  `,

  avatar: css`
    background: linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryBorder} 100%);
  `,

  title: css`
    margin: 0;
    line-height: 1.2;
  `,

  subtitle: css`
    font-size: 11px;
    line-height: 1;
  `,

  closeButton: css`
    &:hover {
      background-color: ${token.colorErrorBg};
      color: ${token.colorError};
    }
  `,

  clearButton: css`
    font-size: 11px;
    height: auto;
    padding: 2px 8px;
    
    &:hover {
      color: ${token.colorPrimary};
    }
  `,

  messagesContainer: css`
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: ${token.paddingSM}px;
    background: ${token.colorBgContainer};
    display: flex;
    flex-direction: column;
    
    &::-webkit-scrollbar {
      width: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background: ${token.colorBorder};
      border-radius: 2px;
    }
  `,

  welcomeMessage: css`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
  `,

  welcomeContent: css`
    text-align: center;
    max-width: 280px;
  `,

  welcomeIcon: css`
    font-size: 48px;
    color: ${token.colorPrimary};
    margin-bottom: ${token.marginLG}px;
  `,

  suggestions: css`
    margin-top: ${token.marginXL}px;
    text-align: left;
  `,

  suggestionButtons: css`
    display: flex;
    flex-direction: column;
    gap: ${token.marginSM}px;
    margin-top: ${token.marginMD}px;
  `,

  suggestionButton: css`
    text-align: left;
    height: auto;
    padding: 8px 12px;
    white-space: normal;
    font-size: 12px;
    
    &:hover {
      border-color: ${token.colorPrimary};
      color: ${token.colorPrimary};
    }
  `,

  messagesList: css`
    display: flex;
    flex-direction: column;
    gap: ${token.marginMD}px;
    flex: 1;
    min-height: 0;
  `,

  message: css`
    display: flex;
    gap: ${token.marginSM}px;
    align-items: flex-start;
    
    &.user {
      flex-direction: row-reverse;
    }
  `,

  messageAvatar: css`
    flex-shrink: 0;
  `,

  messageContent: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-width: 70%;
    font-size: 14px;
    line-height: 1.4;
    
    .user & {
      align-items: flex-end;
    }
    
    p {
      margin-bottom: 8px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    
    ul {
      margin: 4px 0;
      padding-left: 16px;
      
      li {
        margin-bottom: 4px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    
    strong {
      font-weight: 600;
      color: ${token.colorPrimary};
    }
    
    em {
      font-style: italic;
    }
  `,

  messageBubble: css`
    padding: 10px 14px;
    border-radius: 12px;
    background: ${token.colorBgContainer};
    border: 1px solid ${token.colorBorder};
    word-wrap: break-word;
    
    .user & {
      background: linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryBorder} 100%);
      border-color: ${token.colorPrimary};
      color: white;
    }
    
    .assistant & {
      background: ${token.colorBgContainer};
      border-color: ${token.colorBorder};
    }
  `,

  messageTime: css`
    font-size: 10px;
    opacity: 0.7;
  `,

  inputArea: css`
    padding: ${token.paddingSM}px;
    border-top: 1px solid ${token.colorBorder};
    background: ${token.colorBgContainer};
    flex-shrink: 0;
  `,

  messageInput: css`
    .ant-input {
      border-radius: 20px;
      border: 1px solid ${token.colorBorder};
      
      &:focus {
        border-color: ${token.colorPrimary};
        box-shadow: 0 0 0 2px ${token.colorPrimaryBg};
      }
    }
  `,

  sendButton: css`
    border-radius: 0 20px 20px 0;
    height: 32px;
    
    &:disabled {
      opacity: 0.6;
    }
  `,

  user: css`
    flex-direction: row-reverse;
  `,

  assistant: css`
    flex-direction: row;
  `,
}));

export default useStyles;
