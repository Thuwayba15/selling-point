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

  card: {
    background: colors.white,
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0.1)',
    marginBottom: '16px'
  },

  insight: {
    padding: '12px 16px',
    border: `1px solid #d9d9d9`,
    borderRadius: '6px'
  },

  insightTitle: {
    color: colors.text,
    marginBottom: '8px'
  },

  insightDescription: {
    color: colors.textSecondary,
    marginBottom: '4px'
  },

  insightValue: {
    marginTop: '4px'
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
  }
};
