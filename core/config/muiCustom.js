import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

import colors from './colors';

const createTheme = ({ fontSize = 14 }) =>
  createMuiTheme({
    overrides: {
      MuiInput: {},
      MuiSelect: {},
      MuiListItemText: {},
      MuiToolbar: {
        root: {
          position: '',
        },
      },
      MuiButton: {
        root: {
          borderRadius: 4,
        },
        containedPrimary: {},
        contained: {
          backgroundColor: 'white',
          color: colors.primary,
        },
      },
      MuiFormLabel: {
        root: {
          color: colors.body,
        },
        asterisk: {
          color: colors.error,
        },
      },
      MuiExpansionPanel: {
        root: {
          border: 'none',
          marginBottom: 8,
          boxShadow: '0 2px 60px 5px rgba(0, 0, 0, 0.05)',
          '&:before': {
            backgroundColor: 'transparent',
          },
        },
        rounded: {
          borderRadius: 8,
          '&:last-child': {
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          },
        },
      },
      MuiChip: {
        colorSecondary: {
          backgroundColor: 'red',
        },
      },
      MuiListItemIcon: {
        root: {
          minWidth: 40,
        },
      },
    },
    palette: {
      primary: {
        main: colors.primary,
        dark: colors.mui.darkPrimary, // Darken 20%
        contrastText: colors.mui.contrastText,
      },
      secondary: {
        main: colors.success,
        dark: colors.mui.darkSuccess, // Darken 20%
        contrastText: colors.mui.contrastText,
      },
      error: {
        main: colors.error,
        contrastText: colors.mui.contrastText,
      },
      warning: {
        main: colors.warning,
        contrastText: colors.mui.contrastText,
      },
      text: {
        primary: colors.title,
      },
      background: {
        default: colors.mui.background,
      },
    },
    typography: {
      fontFamily: 'Eina04-Regular, Helvetica',
      htmlFontSize: fontSize,
      letterSpacing: '0.048em',
      fontWeightRegular: 400,
      fontWeightMedium: 600,
      button: {
        fontWeight: 400,
        textTransform: '',
      },
    },
  });

export default createTheme;
