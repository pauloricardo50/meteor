import createMuiTheme from 'material-ui/styles/createMuiTheme';
import createPalette from 'material-ui/styles/createPalette';
import colors from './colors';

// Commented parts are the defaults, non-commented are edited
const theme = createMuiTheme({
  overrides: {
    MuiButton: {
      raised: {
        backgroundColor: 'white',
      },
    },
    MuiInput: {
      underline: {
        '&:before': {
          transition: 'background-color 200ms ease, height 200ms ease',
        },
        '&:hover:not($disabled):before': {
          backgroundColor: '#666',
        },
      },
      inkbar: {
        '&:after': {
          backgroundColor: colors.primary,
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
    // common: {
    //   black: '#000',
    //   white: '#fff',
    //   transparent: 'rgba(0, 0, 0, 0)',
    //   fullBlack: 'rgba(0, 0, 0, 1)',
    //   darkBlack: 'rgba(0, 0, 0, 0.87)',
    //   lightBlack: 'rgba(0, 0, 0, 0.54)',
    //   minBlack: 'rgba(0, 0, 0, 0.26)',
    //   faintBlack: 'rgba(0, 0, 0, 0.12)',
    //   fullWhite: 'rgba(255, 255, 255, 1)',
    //   darkWhite: 'rgba(255, 255, 255, 0.87)',
    //   lightWhite: 'rgba(255, 255, 255, 0.54)',
    // },
    // type: 'light',
    // primary: {
    //   50: '#e9f2fc',
    //   100: '#c8def6',
    //   200: '#a4c8f1',
    //   300: '#80b1eb',
    //   400: '#64a1e6',
    //   500: '#4990e2',
    //   600: '#4288df',
    //   700: '#397dda',
    //   800: '#3173d6',
    //   900: '#2161cf',
    //   A100: '#ffffff',
    //   A200: '#d4e3ff',
    //   A400: '#a1c1ff',
    //   A700: '#88b0ff',
    //   contrastDefaultColor: 'light',
    // },
    // secondary: {
    //   50: '#eefaf6',
    //   100: '#d4f2e8',
    //   200: '#b7e9d8',
    //   300: '#9ae0c8',
    //   400: '#84d9bd',
    //   500: '#6ed2b1',
    //   600: '#66cdaa',
    //   700: '#5bc7a1',
    //   800: '#51c198',
    //   900: '#3fb688',
    //   A100: '#ffffff',
    //   A200: '#6ed2b1',
    //   A400: '#5bc7a1',
    //   A700: '#87ffcf',
    //   contrastDefaultColor: 'light',
    // },
    // error: {
    //   50: '#f6e8e5',
    //   100: '#e9c5be',
    //   200: '#db9f92',
    //   300: '#cd7866',
    //   400: '#c25b46',
    //   500: '#b73e25',
    //   600: '#b03821',
    //   700: '#a7301b',
    //   800: '#9f2816',
    //   900: '#901b0d',
    //   A100: '#ffc5c0',
    //   A200: '#ff968d',
    //   A400: '#ff675a',
    //   A700: '#ff5041',
    //   contrastDefaultColor: 'light',
    // },
    // grey: {
    //   50: '#fafafa',
    //   100: '#f5f5f5',
    //   200: '#eeeeee',
    //   300: '#e0e0e0',
    //   400: '#bdbdbd',
    //   500: '#9e9e9e',
    //   600: '#757575',
    //   700: '#616161',
    //   800: '#424242',
    //   900: '#212121',
    //   A100: '#d5d5d5',
    //   A200: '#aaaaaa',
    //   A400: '#303030',
    //   A700: '#616161',
    //   contrastDefaultColor: 'dark',
    // },
    // shades: {
    //   dark: {
    //     text: {
    //       primary: 'rgba(255, 255, 255, 1)',
    //       secondary: 'rgba(255, 255, 255, 0.7)',
    //       disabled: 'rgba(255, 255, 255, 0.5)',
    //       hint: 'rgba(255, 255, 255, 0.5)',
    //       icon: 'rgba(255, 255, 255, 0.5)',
    //       divider: 'rgba(255, 255, 255, 0.12)',
    //       lightDivider: 'rgba(255, 255, 255, 0.075)',
    //     },
    //     input: {
    //       bottomLine: 'rgba(255, 255, 255, 0.7)',
    //       helperText: 'rgba(255, 255, 255, 0.7)',
    //       labelText: 'rgba(255, 255, 255, 0.7)',
    //       inputText: 'rgba(255, 255, 255, 1)',
    //       disabled: 'rgba(255, 255, 255, 0.5)',
    //     },
    //     action: {
    //       active: 'rgba(255, 255, 255, 1)',
    //       disabled: 'rgba(255, 255, 255, 0.3)',
    //     },
    //     background: {
    //       default: '#303030',
    //       paper: '#424242',
    //       appBar: '#212121',
    //       contentFrame: '#212121',
    //       status: '#000',
    //     },
    //   },
    //   light: {
    //     text: {
    //       primary: 'rgba(0, 0, 0, 0.87)',
    //       secondary: 'rgba(0, 0, 0, 0.54)',
    //       disabled: 'rgba(0, 0, 0, 0.38)',
    //       hint: 'rgba(0, 0, 0, 0.38)',
    //       icon: 'rgba(0, 0, 0, 0.38)',
    //       divider: 'rgba(0, 0, 0, 0.12)',
    //       lightDivider: 'rgba(0, 0, 0, 0.075)',
    //     },
    //     input: {
    //       bottomLine: 'rgba(0, 0, 0, 0.42)',
    //       helperText: 'rgba(0, 0, 0, 0.54)',
    //       labelText: 'rgba(0, 0, 0, 0.54)',
    //       inputText: 'rgba(0, 0, 0, 0.87)',
    //       disabled: 'rgba(0, 0, 0, 0.42)',
    //     },
    //     action: {
    //       active: 'rgba(0, 0, 0, 0.54)',
    //       disabled: 'rgba(0, 0, 0, 0.26)',
    //     },
    //     background: {
    //       default: '#fafafa',
    //       paper: '#fff',
    //       appBar: '#f5f5f5',
    //       contentFrame: '#eeeeee',
    //     },
    //   },
    // },
    text: {
      primary: colors.title,
      //   secondary: 'rgba(0, 0, 0, 0.54)',
      //   disabled: 'rgba(0, 0, 0, 0.38)',
      //   hint: 'rgba(0, 0, 0, 0.38)',
      //   icon: 'rgba(0, 0, 0, 0.38)',
      //   divider: 'rgba(0, 0, 0, 0.12)',
      //   lightDivider: 'rgba(0, 0, 0, 0.075)',
    },
    // input: {
    //   bottomLine: 'rgba(0, 0, 0, 0.42)',
    //   helperText: 'rgba(0, 0, 0, 0.54)',
    //   labelText: 'rgba(0, 0, 0, 0.54)',
    //   inputText: 'rgba(0, 0, 0, 0.87)',
    //   disabled: 'rgba(0, 0, 0, 0.42)',
    // },
    input: {
      bottomLine: colors.lightBorder,
      helperText: '#888',
      labelText: '#777',
      inputText: colors.body,
      disabled: '#999',
    },
    // action: {
    //   active: 'rgba(0, 0, 0, 0.54)',
    //   disabled: 'rgba(0, 0, 0, 0.26)',
    // },
    background: {
      default: '#fff',
      //   paper: '#fff',
      //   appBar: '#f5f5f5',
      //   contentFrame: '#eeeeee',
    },
  },
  typography: {
    fontFamily: 'Source Sans Pro, sans-serif',
    fontSize: '1em',
    // fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    // display4: {
    //   fontSize: 112,
    //   fontWeight: 300,
    //   fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    //   letterSpacing: '-.04em',
    //   lineHeight: 1,
    //   color: 'rgba(0, 0, 0, 0.54)',
    // },
    // display3: {
    //   fontSize: 56,
    //   fontWeight: 400,
    //   fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    //   letterSpacing: '-.02em',
    //   lineHeight: 1.35,
    //   color: 'rgba(0, 0, 0, 0.54)',
    // },
    // display2: {
    //   fontSize: 45,
    //   fontWeight: 400,
    //   fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    //   lineHeight: '48px',
    //   color: 'rgba(0, 0, 0, 0.54)',
    // },
    // display1: {
    //   fontSize: 34,
    //   fontWeight: 400,
    //   fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    //   lineHeight: '40px',
    //   color: 'rgba(0, 0, 0, 0.54)',
    // },
    // headline: {
    //   fontSize: 24,
    //   fontWeight: 400,
    //   fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    //   lineHeight: '32px',
    //   color: 'rgba(0, 0, 0, 0.87)',
    // },
    // title: {
    //   fontSize: 21,
    //   fontWeight: 500,
    //   fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    //   lineHeight: 1,
    //   color: 'rgba(0, 0, 0, 0.87)',
    // },
    // subheading: {
    //   fontSize: 16,
    //   fontWeight: 400,
    //   fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    //   lineHeight: '24px',
    //   color: 'rgba(0, 0, 0, 0.87)',
    // },
    // body2: {
    //   fontSize: 14,
    //   fontWeight: 500,
    //   fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    //   lineHeight: '24px',
    //   color: 'rgba(0, 0, 0, 0.87)',
    // },
    // body1: {
    //   fontSize: 14,
    //   fontWeight: 400,
    //   fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    //   lineHeight: '20px',
    //   color: 'rgba(0, 0, 0, 0.87)',
    // },
    // caption: {
    //   fontSize: 12,
    //   fontWeight: 400,
    //   fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    //   lineHeight: 1,
    //   color: 'rgba(0, 0, 0, 0.54)',
    // },
    button: {
      fontWeight: 400,
      textTransform: '',
      // textTransform: 'capitalize', // Remove the 'uppercase' transform
      // fontSize: 14,
      // fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
  // mixins: {
  //   toolbar: {
  //     minHeight: 56,
  //     '@media (min-width:0px) and (orientation: landscape)': {
  //       minHeight: 48,
  //     },
  //     '@media (min-width:600px)': {
  //       minHeight: 64,
  //     },
  //   },
  // },
  // breakpoints: {
  //   keys: ['xs', 'sm', 'md', 'lg', 'xl'],
  //   values: {
  //     xs: 360,
  //     sm: 600,
  //     md: 960,
  //     lg: 1280,
  //     xl: 1920,
  //   },
  // },
  // shadows: [
  //   'none',
  //   '0px 1px 3px 0px rgba(0, 0, 0, 0.2),0px 1px 1px 0px rgba(0, 0, 0, 0.14),0px 2px 1px -1px rgba(0, 0, 0, 0.12)',
  //   '0px 1px 5px 0px rgba(0, 0, 0, 0.2),0px 2px 2px 0px rgba(0, 0, 0, 0.14),0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
  //   '0px 1px 8px 0px rgba(0, 0, 0, 0.2),0px 3px 4px 0px rgba(0, 0, 0, 0.14),0px 3px 3px -2px rgba(0, 0, 0, 0.12)',
  //   '0px 2px 4px -1px rgba(0, 0, 0, 0.2),0px 4px 5px 0px rgba(0, 0, 0, 0.14),0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
  //   '0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 5px 8px 0px rgba(0, 0, 0, 0.14),0px 1px 14px 0px rgba(0, 0, 0, 0.12)',
  //   '0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 6px 10px 0px rgba(0, 0, 0, 0.14),0px 1px 18px 0px rgba(0, 0, 0, 0.12)',
  //   '0px 4px 5px -2px rgba(0, 0, 0, 0.2),0px 7px 10px 1px rgba(0, 0, 0, 0.14),0px 2px 16px 1px rgba(0, 0, 0, 0.12)',
  //   '0px 5px 5px -3px rgba(0, 0, 0, 0.2),0px 8px 10px 1px rgba(0, 0, 0, 0.14),0px 3px 14px 2px rgba(0, 0, 0, 0.12)',
  //   '0px 5px 6px -3px rgba(0, 0, 0, 0.2),0px 9px 12px 1px rgba(0, 0, 0, 0.14),0px 3px 16px 2px rgba(0, 0, 0, 0.12)',
  //   '0px 6px 6px -3px rgba(0, 0, 0, 0.2),0px 10px 14px 1px rgba(0, 0, 0, 0.14),0px 4px 18px 3px rgba(0, 0, 0, 0.12)',
  //   '0px 6px 7px -4px rgba(0, 0, 0, 0.2),0px 11px 15px 1px rgba(0, 0, 0, 0.14),0px 4px 20px 3px rgba(0, 0, 0, 0.12)',
  //   '0px 7px 8px -4px rgba(0, 0, 0, 0.2),0px 12px 17px 2px rgba(0, 0, 0, 0.14),0px 5px 22px 4px rgba(0, 0, 0, 0.12)',
  //   '0px 7px 8px -4px rgba(0, 0, 0, 0.2),0px 13px 19px 2px rgba(0, 0, 0, 0.14),0px 5px 24px 4px rgba(0, 0, 0, 0.12)',
  //   '0px 7px 9px -4px rgba(0, 0, 0, 0.2),0px 14px 21px 2px rgba(0, 0, 0, 0.14),0px 5px 26px 4px rgba(0, 0, 0, 0.12)',
  //   '0px 8px 9px -5px rgba(0, 0, 0, 0.2),0px 15px 22px 2px rgba(0, 0, 0, 0.14),0px 6px 28px 5px rgba(0, 0, 0, 0.12)',
  //   '0px 8px 10px -5px rgba(0, 0, 0, 0.2),0px 16px 24px 2px rgba(0, 0, 0, 0.14),0px 6px 30px 5px rgba(0, 0, 0, 0.12)',
  //   '0px 8px 11px -5px rgba(0, 0, 0, 0.2),0px 17px 26px 2px rgba(0, 0, 0, 0.14),0px 6px 32px 5px rgba(0, 0, 0, 0.12)',
  //   '0px 9px 11px -5px rgba(0, 0, 0, 0.2),0px 18px 28px 2px rgba(0, 0, 0, 0.14),0px 7px 34px 6px rgba(0, 0, 0, 0.12)',
  //   '0px 9px 12px -6px rgba(0, 0, 0, 0.2),0px 19px 29px 2px rgba(0, 0, 0, 0.14),0px 7px 36px 6px rgba(0, 0, 0, 0.12)',
  //   '0px 10px 13px -6px rgba(0, 0, 0, 0.2),0px 20px 31px 3px rgba(0, 0, 0, 0.14),0px 8px 38px 7px rgba(0, 0, 0, 0.12)',
  //   '0px 10px 13px -6px rgba(0, 0, 0, 0.2),0px 21px 33px 3px rgba(0, 0, 0, 0.14),0px 8px 40px 7px rgba(0, 0, 0, 0.12)',
  //   '0px 10px 14px -6px rgba(0, 0, 0, 0.2),0px 22px 35px 3px rgba(0, 0, 0, 0.14),0px 8px 42px 7px rgba(0, 0, 0, 0.12)',
  //   '0px 11px 14px -7px rgba(0, 0, 0, 0.2),0px 23px 36px 3px rgba(0, 0, 0, 0.14),0px 9px 44px 8px rgba(0, 0, 0, 0.12)',
  //   '0px 11px 15px -7px rgba(0, 0, 0, 0.2),0px 24px 38px 3px rgba(0, 0, 0, 0.14),0px 9px 46px 8px rgba(0, 0, 0, 0.12)',
  // ],
  // transitions: {
  //   easing: {
  //     easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  //     easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
  //     easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  //     sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  //   },
  //   duration: {
  //     shortest: 150,
  //     shorter: 200,
  //     short: 250,
  //     standard: 300,
  //     complex: 375,
  //     enteringScreen: 225,
  //     leavingScreen: 195,
  //   },
  // },
  // spacing: {
  //   unit: 8,
  // },
  // zIndex: {
  //   mobileStepper: 900,
  //   menu: 1000,
  //   appBar: 1100,
  //   drawerOverlay: 1200,
  //   navDrawer: 1300,
  //   dialogOverlay: 1400,
  //   dialog: 1500,
  //   layer: 2000,
  //   popover: 2100,
  //   snackbar: 2900,
  //   tooltip: 3000,
  // },
});

export default theme;
