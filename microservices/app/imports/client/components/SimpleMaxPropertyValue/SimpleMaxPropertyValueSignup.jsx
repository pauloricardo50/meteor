// @flow
import React from 'react';
import cx from 'classnames';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/pro-light-svg-icons/faCheckCircle';

import T from 'core/components/Translation';
import createTheme from 'core/config/muiCustom';
import UserCreatorForm from '../UserCreator/UserCreatorForm';

type SimpleMaxPropertyValueSignupProps = {};

const SimpleMaxPropertyValueSignup = ({
  fixed,
}: SimpleMaxPropertyValueSignupProps) => (
  <div className="simple-max-property-value">
    <h2>
      <T id="MaxPropertyValue.signup.title" />
    </h2>
    <MuiThemeProvider theme={createTheme()}>
      <div className="simple-max-property-value-signup">
        <FontAwesomeIcon icon={faCheckCircle} className="icon success" />
        <h4 className="text-center">
          <T id="MaxPropertyValue.signup.description" />
        </h4>
        <UserCreatorForm
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
