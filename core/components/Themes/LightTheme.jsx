import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';

import colors from '../../config/colors';
import createTheme from '../../config/muiCustom';

const defaultTheme = createTheme({});

const borderColor = 'rgba(255,255,255,1.0)';
const borderColorDim = 'rgba(255,255,255,0.6)';

const LightTheme = ({ children }) => (
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
        MuiOutlinedInput: {
          root: {
            color: 'white',
            position: 'relative',
            '&:hover $notchedOutline': {
              borderColor,
            },
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
              '&:hover $notchedOutline': {
                borderColor,
              },
            },
            '&$focused $notchedOutline': {
              borderColor,
              borderWidth: 2,
            },
            '&$error $notchedOutline': {
              borderColor: colors.error,
            },
          },
          notchedOutline: {
            borderColor: borderColorDim,
          },
        },
        MuiTypography: {
          body1: {
            color: 'unset',
          },
        },
        MuiFormLabel: {
          root: {
            color: 'white',
            '&$focused': {
              color: 'white',
            },
          },
          asterisk: {
            '&$error': {
              color: 'white',
            },
          },
        },
        MuiInputBase: {
          input: {
            color: 'white',
          },
        },
        MuiInputAdornment: {
          root: {
            '&> p': {
              color: 'white',
              opacity: 0.54,
            },
          },
        },
        MuiFormHelperText: {
          root: {
            color: 'white',
            opacity: 0.54,
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
              backgroundColor: 'white',
            },
          },
        },
      },
    }}
  >
    {children}
  </MuiThemeProvider>
);

export default LightTheme;
