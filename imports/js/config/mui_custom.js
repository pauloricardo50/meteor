import createMuiTheme from 'material-ui/styles/createMuiTheme';
import createPalette from 'material-ui/styles/createPalette';
import colors from './colors';

const muiCustom = {
  // spacing: Spacing.default,
  fontFamily: 'Source Sans Pro, sans-serif',
  fontWeight: 400,
  palette: {
    primary1Color: colors.primary,
    // primary2Color: '#50A1FF',
    // primary3Color: muiColors.grey600,
    accent1Color: colors.secondary,
    // accent2Color: muiColors.grey100,
    // accent3Color: muiColors.grey500,
    // textColor: muiColors.darkBlack,
    // secondaryTextColor: (0, ColorManipulator.fade)(muiColors.darkBlack, 0.54),
    // alternateTextColor: muiColors.white,
    // canvasColor: muiColors.white,
    // borderColor: muiColors.grey300,
    // disabledColor: (0, ColorManipulator.fade)(muiColors.darkBlack, 0.3),
    // pickerHeaderColor: muiColors.cyan500,
    // clockCircleColor: (0, ColorManipulator.fade)(muiColors.darkBlack, 0.07),
    // shadowColor: muiColors.fullBlack,
  },
  raisedButton: {
    // color: palette.alternateTextColor,
    // textColor: colors.primary,
    // primaryColor: colors.primary,
    // primaryTextColor: colors.primary,
    // secondaryColor: palette.accent1Color,
    // secondaryTextColor: palette.alternateTextColor,
    // disabledColor: darken(palette.alternateTextColor, 0.1),
    // disabledTextColor: fade(palette.textColor, 0.3),
    // fontSize: typography.fontStyleButtonFontSize,
    // fontWeight: typography.fontWeightMedium,
  },
  slider: {
    trackSize: 2,
    handleSize: 20,
    handleSizeDisabled: 15,
    handleSizeActive: 30,
  },
};

const theme = createMuiTheme({
  palette: {
    primary: {
      50: '#e9f2fc',
      100: '#c8def6',
      200: '#a4c8f1',
      300: '#80b1eb',
      400: '#64a1e6',
      500: '#4990e2',
      600: '#4288df',
      700: '#397dda',
      800: '#3173d6',
      900: '#2161cf',
      A100: '#ffffff',
      A200: '#d4e3ff',
      A400: '#a1c1ff',
      A700: '#88b0ff',
      contrastDefaultColor: 'light',
    },
    secondary: {
      50: '#eefaf6',
      100: '#d4f2e8',
      200: '#b7e9d8',
      300: '#9ae0c8',
      400: '#84d9bd',
      500: '#6ed2b1',
      600: '#66cdaa',
      700: '#5bc7a1',
      800: '#51c198',
      900: '#3fb688',
      A100: '#ffffff',
      A200: '#d4ffee',
      A400: '#a1ffd9',
      A700: '#87ffcf',
      contrastDefaultColor: 'dark',
    },
    error: colors.error,
  },
  typography: {
    fontFamily: 'Source Sans Pro, sans-serif',
    fontSize: '1em',
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    button: {
      fontWeight: 400,
      textTransform: 'capitalize', // Remove the 'uppercase' transform
    },
  },
});

export default theme;
