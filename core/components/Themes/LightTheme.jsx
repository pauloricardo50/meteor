import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';

import createTheme from '../../config/muiCustom';

const defaultTheme = createTheme({});

const LightTheme = ({ children }) => (
  <MuiThemeProvider
    theme={{
      ...defaultTheme,
      overrides: {
        ...defaultTheme.overrides,
      },
      palette: {
        // type: 'dark',
        text: {
          primary: '#fff',
          secondary: 'rgba(255, 255, 255, 0.7)',
          disabled: 'rgba(255, 255, 255, 0.5)',
          hint: 'rgba(255, 255, 255, 0.5)',
          icon: 'rgba(255, 255, 255, 0.5)',
        },
      },
    }}
  >
    {children}
  </MuiThemeProvider>
);

export default LightTheme;
