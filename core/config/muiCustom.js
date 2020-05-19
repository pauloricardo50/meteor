import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

import colors from './colors';

// initialize with default MUI breakpoints
const breakpoints = createBreakpoints({});
// TODO: override MUI breakpoints with e-Potek settings
// https://material-ui.com/customization/breakpoints/#default-breakpoints

const createTheme = ({ fontSize = 14 }) =>
  createMuiTheme({
    overrides: {
      MuiInput: {},
      MuiSelect: {},
      MuiToolbar: {
        root: {
          position: '',
        },
      },
      MuiButton: {
        root: {
          borderRadius: 5,
          padding: '7px 6px 8px',
          fontSize: '16px',
          fontWeight: 'normal',
          fontStyle: 'normal',
          lineHeight: 1.44,
          letterSpacing: 'normal',
          textAlign: 'center',
          [breakpoints.up('md')]: {
            padding: '15px 12px 16px',
            fontSize: '16px',
            fontWeight: 'bold',
            fontStyle: 'normal',
            lineHeight: 1.44,
            letterSpacing: '0.85px',
          },
        },
        contained: {
          backgroundColor: 'white',
          color: colors.primary,
        },
        containedPrimary: {
          backgroundImage: colors.primaryGradient,
          color: 'white',
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
          boxShadow: 'none',
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
      MuiExpansionPanelSummary: {
        root: {
          borderBottom: `1px solid ${colors.bodyLight}`,
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
      MuiListItem: {
        root: {
          margin: 4,
          width: 'calc(100% - 8px)',
          borderRadius: 4,
        },
      },
      MuiList: {
        padding: {
          paddingTop: 0,
          paddingBottom: 0,
        },
      },
      MuiListItemText: {
        secondary: { lineHeight: 'unset' },
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
      fontFamily: 'Manrope-variable, Helvetica, sans-serif',
      // htmlFontSize: fontSize, // FIXME: This prop messes up our input labels, no idea why
      fontSize,
      fontWeightRegular: 300,
      fontWeightMedium: 400,
      button: {
        fontWeight: 400,
        textTransform: '',
      },
    },
  });

export default createTheme;
