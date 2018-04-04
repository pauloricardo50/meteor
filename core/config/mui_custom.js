import createMuiTheme from 'material-ui/styles/createMuiTheme';
import colors from './colors';

const theme = createMuiTheme({
  overrides: {
    MuiInput: {
      underline: {
        '&:before': {
          transition: 'background-color 200ms ease, height 200ms ease',
        },
        '&:hover:not($disabled):before': {
          backgroundColor: '#666',
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
    MuiTableCell: {
      dense: {
        paddingRight: 8, // default is 3x spacing = 24px
        paddingLeft: 8,
      },
    },
    MuiToolbar: {
      root: {
        position: '',
      },
    },
  },
  // direction: 'ltr',
  palette: {
    primary: {
      // light: '',
      main: '#4288df',
      dark: '#397dda',
      contrastText: '#fff',
    },
    secondary: {
      // light: '',
      main: '#6ed2b1',
      dark: '#5bc7a1',
      contrastText: '#fff',
    },
    error: {
      main: '#B73E25',
      contrastText: '#fff',
    },
    warning: {
      main: '#F3AF50',
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
    fontSize: '1em',
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    button: {
      fontWeight: 400,
      textTransform: '',
    },
  },
});

export default theme;
