import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';

import colors from '../../config/colors';
import createTheme from '../../config/muiCustom';

const defaultTheme = createTheme({});
const theme = {
  ...defaultTheme,
  overrides: {
    ...defaultTheme.overrides,
    MuiFormLabel: {
      ...defaultTheme.overrides.MuiFormLabel,
      root: {},
    },
    MuiListItem: {
      ...defaultTheme.overrides.MuiListItem,
      root: {
        ...defaultTheme.overrides.MuiListItem.root,
        color: colors.body,
      },
    },
  },
  palette: {
    ...defaultTheme.palette,
    type: 'dark',
    primary: {
      main: colors.primaryLight,
      contrastText: 'white',
    },
    text: {
      primary: '#fff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
      hint: 'rgba(255, 255, 255, 0.5)',
      icon: 'rgba(255, 255, 255, 0.5)',
    },
    background: {
      default: 'black',
      paper: 'white',
    },
    action: {
      active: '#fff',
      hover: 'rgba(255, 255, 255, 0.08)',
      hoverOpacity: 0.08,
      selected: 'rgba(255, 255, 255, 0.16)',
      selectedOpacity: 0.16,
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
      disabledOpacity: 0.38,
      focus: 'rgba(255, 255, 255, 0.12)',
      focusOpacity: 0.12,
      activatedOpacity: 0.24,
    },
  },
};

const LightTheme = ({ children }) => (
  <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
);

export default LightTheme;
