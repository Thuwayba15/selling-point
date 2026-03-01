import { colors } from '@/theme/colors';

export const styles = {
  container: {
    padding: '24px',
    background: colors.bgLayout,
    minHeight: '100vh'
  },
  
  header: {
    marginBottom: '24px',
    color: colors.text
  },

  title: {
    color: colors.text,
    marginBottom: '16px'
  },

  card: {
    background: colors.white,
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0.1)',
    marginBottom: '16px'
  },

  cardHeader: {
    background: colors.secondary,
    padding: '12px 16px',
    borderRadius: '8px 8px 0px',
    color: colors.white
  },

  cardBody: {
    padding: '16px'
  },

  button: {
    marginRight: '8px'
  },

  tag: {
    display: 'inline-block',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500'
  },

  list: {
    '& .ant-list-item': {
      padding: '8px 0',
      borderBottom: '1px solid #d9d9d9'
    }
  },

  text: {
    color: colors.text,
    lineHeight: '1.5'
  },

  textSecondary: {
    color: colors.textSecondary
  },

  loading: {
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
  },

  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '24px',
    borderRadius: '8px',
    zIndex: 1000,
    maxHeight: '400px',
    overflowY: 'auto'
  },

  divider: {
    margin: '16px 0'
  }
};
