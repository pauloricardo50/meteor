import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import colors from './colors';

const theme = createMuiTheme({
  overrides: {
    MuiInput: {
      underline: {
        '&:before': {
          transition: 'background-color 200ms ease, height 200ms ease',
        },
        '&:hover:not($disabled):before': {
          borderBottomColor: '#666',
        },
      },
      input: {
        // This logic shows the placeholder when the label is fixed
        'label + $formControl &': {
          '&::-webkit-input-placeholder': { opacity: 0.5 },
          '&::-moz-placeholder': { opacity: 0.5 }, // Firefox 19+
          '&:-ms-input-placeholder': { opacity: 0.5 }, // IE 11
          '&::-ms-input-placeholder': { opacity: 0.5 }, // Edge
        },
      },
    },
    MuiSelect: {
      select: {
        display: 'flex',
        alignItems: 'center',
      },
    },
    MuiToolbar: {
      root: {
        position: '',
      },
    },
    MuiButton: {
      root: {
        borderRadius: 8,
        color: colors.primary,
      },
      raised: {
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
        // border: `1px solid ${colors.primary}`,
        marginBottom: 8,
        boxShadow: '0 2px 60px 5px rgba(0, 0, 0, 0.05)',
        borderRadius: 16,
        '&:before': {
          backgroundColor: 'transparent',
        },
        '&:last-child': {
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        },
      },
    },
  },
  // direction: 'ltr',
  palette: {
    primary: {
      // light: '',
      main: colors.primary,
      dark: '#0048bb', // Darken 20%
      contrastText: '#fff',
    },
    secondary: {
      // light: '',
      main: colors.success,
      dark: '#1aa890', // Darken 20%
      contrastText: '#fff',
    },
    error: {
      main: colors.error,
      contrastText: '#fff',
    },
    warning: {
      main: colors.warning,
      contrastText: '#fff',
    },
    text: {
      primary: colors.title,
    },
    input: {
      bottomLine: colors.lightBorder,
      helperText: '#888',
      labelText: '#777',
      inputText: colors.body,
      disabled: '#999',
    },
    background: {
      default: '#fff',
    },
  },
  typography: {
    fontFamily: 'Source Sans Pro, sans-serif',
    fontSize: 16,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    button: {
      fontWeight: 400,
      // textTransform: '',
    },
  },
});

export default theme;
