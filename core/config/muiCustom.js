import { frFR } from '@material-ui/core/locale';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import merge from 'lodash/merge';

import colors from './colors';

// initialize with default MUI breakpoints
const breakpoints = createBreakpoints({});
// TODO: override MUI breakpoints with e-Potek settings
// https://material-ui.com/customization/breakpoints/#default-breakpoints

const defaultTheme = fontSize => ({
  props: {
    MuiTextField: {
      variant: 'outlined',
    },
    MuiTooltip: {
      arrow: true,
    },
  },
  overrides: {
    MuiToolbar: {
      root: {
        position: '',
      },
    },
    MuiButton: {
      root: {
        borderRadius: 4,
      },
      contained: {
        backgroundColor: 'white',
        color: colors.primary,
      },
      containedPrimary: {
        backgroundImage: colors.primaryGradient,
        color: 'white',
        '&$disabled': {
          backgroundImage: 'unset',
        },
      },
      containedSecondary: {
        backgroundImage: colors.secondaryGradient,
        color: 'white',
        '&$disabled': {
          backgroundImage: 'unset',
        },
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
    MuiAccordion: {
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
    MuiListItem: {
      root: {
        margin: 4,
        width: 'calc(100% - 8px)',
        borderRadius: 4,
        '&$focusVisible': {
          background: colors.primaryGradient,
          color: 'white',
          '& .MuiListItemText-primary, & .MuiListItemText-secondary, & .MuiListItemIcon-root': {
            color: 'white',
          },
          containedSecondary: {
            backgroundImage: colors.secondaryGradient,
            color: 'white',
          },
        },
        '&$selected, &$selected:hover': {
          background: colors.primaryGradient,
          color: 'white',
          '& .MuiListItemText-primary, & .MuiListItemText-secondary, & .MuiListItemIcon-root': {
            color: 'white',
          },
        },
      },
      button: {
        '&:hover': {
          background: colors.primaryGradient,
          color: 'white',
          '& .MuiListItemText-primary, & .MuiListItemText-secondary, & .MuiListItemIcon-root': {
            color: 'white',
          },
        },
      },
    },
    MuiList: {
      padding: {
        paddingTop: 0,
        paddingBottom: 0,
      },
    },
    MuiListItemText: {
      secondary: { lineHeight: 'unset', opacity: 0.8 },
    },
    MuiMenuItem: {
      root: {
        '&:hover': {
          background: colors.primaryGradient,
          color: 'white',
          '& .MuiListItemIcon-root, & .MuiListItemText-primary, & .MuiListItemText-secondary, & .MuiListItemIcon-root': {
            color: 'white',
          },
        },
        '&:focus': {
          background: colors.primaryGradient,
          color: 'white',
          '& .MuiListItemIcon-root, & .MuiListItemText-primary, & .MuiListItemText-secondary, & .MuiListItemIcon-root': {
            color: 'white',
          },
        },
        '&.Mui-selected': {
          background: colors.primaryGradientDark,
          color: 'white',
          '& .MuiListItemIcon-root, & .MuiListItemText-primary, & .MuiListItemText-secondary, & .MuiListItemIcon-root': {
            color: 'white',
          },
          '&:hover': {
            background: colors.primaryGradientDark,
            color: 'white',
            '& .MuiListItemIcon-root, & .MuiListItemText-primary, & .MuiListItemText-secondary, & .MuiListItemIcon-root': {
              color: 'white',
            },
          },
        },
      },
    },
    MuiListSubheader: {
      root: {
        lineHeight: '2em',
        color: colors.title,
      },
    },
    MuiDivider: {
      root: {
        width: 'calc(100% - 8px)',
        margin: '0 auto',
      },
    },
    MuiIconButton: {
      root: {
        border: `solid 1px ${colors.borderGreyLight}`,
      },
    },
    MuiSwitch: {
      switchBase: {
        border: 'none',
      },
      colorPrimary: {
        color: 'white',
        '&$checked': {
          color: 'white',
        },
        '&$checked + $track': {
          backgroundImage: colors.primaryGradient,
        },
      },
    },
    MuiRadio: {
      root: {
        border: 'none',
      },
    },
    MuiCheckbox: {
      root: {
        border: 'none',
      },
    },
    MuiDialogContent: {
      root: {
        '&:first-child': {
          // dialog without title fix. it does not work when you wrap
          // content in a form tag for example
          // https://github.com/mui-org/material-ui/issues/21894
          paddingTop: 8,
        },
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

const createTheme = ({ fontSize = 14, overrideTheme } = {}) => {
  const theme = createMuiTheme(
    merge({}, defaultTheme(fontSize), overrideTheme),
    frFR,
  );

  // You need the theme object to change transitions
  // theme.overrides.MuiListItem.button.transition = theme.transitions.create(
  //   ['background-color', 'color', 'background-image'],
  //   { duration: theme.transitions.duration.shortest },
  // );
  // theme.overrides.MuiListItemIcon.root.transition = theme.transitions.create(
  //   'color',
  //   { duration: theme.transitions.duration.shortest },
  // );

  return theme;
};

export default createTheme;
