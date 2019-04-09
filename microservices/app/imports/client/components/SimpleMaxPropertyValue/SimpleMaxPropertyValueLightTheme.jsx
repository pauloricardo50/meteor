// @flow
import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';

import createTheme from 'core/config/muiCustom';

type SimpleMaxPropertyValueLightThemeProps = {};

const defaultTheme = createTheme();

const SimpleMaxPropertyValueLightTheme = ({
  children,
}: SimpleMaxPropertyValueLightThemeProps) => (
  <MuiThemeProvider
    theme={{
      ...defaultTheme,
      overrides: {
        ...defaultTheme.overrides,
        MuiSelect: {
          select: {
            color: 'white',
          },
          icon: {
            color: 'white',
          },
        },
        MuiInput: {
          input: {
            root: {
              color: 'white',
            },
          },
          underline: {
            '&:before': {
              borderBottom: '1px solid white',
            },
            '&:hover:not($disabled):not($focused):not($error):before': {
              borderBottom: '2px solid white',
              // Reset on touch devices, it doesn't add specificity
              '@media (hover: none)': {
                borderBottom: '1px solid white',
              },
            },
          },
        },
        MuiTypography: {
          body1: {
            color: 'unset',
          },
        },
      },
    }}
  >
    {children}
  </MuiThemeProvider>
);

export default SimpleMaxPropertyValueLightTheme;
