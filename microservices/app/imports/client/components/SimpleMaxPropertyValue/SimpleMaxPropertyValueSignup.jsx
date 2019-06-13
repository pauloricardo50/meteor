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
      <div className="simple-max-property-value-signup">
        <h4 className="text-center secondary">
          Votre capacité d'achat a été calculée avec succès. Pour poursuivre,
          créez-vous un compte.
        </h4>
        <UserCreator
          buttonProps={{
            raised: true,
            secondary: true,
            label: 'Créez votre compte',
          }}
        />
      </div>
    </MuiThemeProvider>
  </div>
);

export default SimpleMaxPropertyValueSignup;
