// @flow
import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';

import T from 'core/components/Translation';
import createTheme from 'core/config/muiCustom';
import UserCreator from '../UserCreator';

type SimpleMaxPropertyValueSignupProps = {};

const SimpleMaxPropertyValueSignup = (props: SimpleMaxPropertyValueSignupProps) => (
  <div>
    <h2>
      <T id="MaxPropertyValue.title" />
    </h2>
    <MuiThemeProvider theme={createTheme()}>
      <UserCreator
        buttonProps={{
          raised: true,
          secondary: true,
          label: 'Créez votre compte',
        }}
      />
    </MuiThemeProvider>
  </div>
);

export default SimpleMaxPropertyValueSignup;
