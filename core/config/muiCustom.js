import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

import colors from './colors';

const createTheme = ({ fontSize = 14 }) => {
  const theme = createMuiTheme({
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
      MuiListItem: {
        root: {
          margin: 4,
          width: 'calc(100% - 8px)',
          borderRadius: 4,
          '&$focusVisible': {
            backgroundColor: colors.primary,
            color: 'white',
            '& .MuiListItemText-primary, & .MuiListItemText-secondary, & .MuiListItemIcon-root': {
              color: 'white',
            },
          },
          '&$selected, &$selected:hover': {
            backgroundColor: colors.primary,
            color: 'white',
            '& .MuiListItemText-primary, & .MuiListItemText-secondary, & .MuiListItemIcon-root': {
              color: 'white',
            },
          },
        },
        button: {
          '&:hover': {
            backgroundColor: colors.primary,
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
            backgroundColor: colors.primary,
            color: 'white',
            '& .MuiListItemIcon-root, & .MuiListItemText-primary, & .MuiListItemText-secondary, & .MuiListItemIcon-root': {
              color: 'white',
            },
          },
          '&:focus': {
            backgroundColor: colors.primary,
            color: 'white',
            '& .MuiListItemIcon-root, & .MuiListItemText-primary, & .MuiListItemText-secondary, & .MuiListItemIcon-root': {
              color: 'white',
            },
          },
          '&.Mui-selected': {
            backgroundColor: colors.mui.darkPrimary,
            color: 'white',
            '& .MuiListItemIcon-root, & .MuiListItemText-primary, & .MuiListItemText-secondary, & .MuiListItemIcon-root': {
              color: 'white',
            },
            '&:hover': {
              backgroundColor: colors.mui.darkPrimary,
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
      MuiListItemIcon: {
        root: {},
      },
      MuiDivider: {
        root: {
          width: 'calc(100% - 8px)',
          margin: '0 auto',
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

  // You need the theme object to change transitions
  theme.overrides.MuiListItem.button.transition = theme.transitions.create(
    ['background-color', 'color'],
    { duration: theme.transitions.duration.shortest },
  );
  theme.overrides.MuiListItemIcon.root.transition = theme.transitions.create(
    'color',
    { duration: theme.transitions.duration.shortest },
  );

  return theme;
};

export default createTheme;
