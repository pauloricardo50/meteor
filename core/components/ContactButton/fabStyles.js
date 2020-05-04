import colors from '../../config/colors';

export const styles = {
  success: {
    color: 'white',
    backgroundColor: colors.success,
    '&:hover': {
      backgroundColor: colors.mui.darkSuccess,
    },
  },
  error: {
    color: 'white',
    backgroundColor: colors.error,
    '&:hover': {
      backgroundColor: colors.mui.darkError,
    },
  },
};
