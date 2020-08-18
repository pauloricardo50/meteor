import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';

import colors from '../../config/colors';
import createTheme from '../../config/muiCustom';

const defaultTheme = createTheme({});

const BlueTheme = ({ children }) => (
  <MuiThemeProvider
    theme={{
      ...defaultTheme,
      overrides: {
        ...defaultTheme.overrides,
      },
      palette: {
        ...defaultTheme.palette,
        // type: 'dark',
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
          default: colors.primary,
          paper: colors.primaryLight,
        },
      },
    }}
  >
    {children}
  </MuiThemeProvider>
);

export default BlueTheme;
