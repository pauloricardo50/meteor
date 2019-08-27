// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/pro-light-svg-icons/faCheckCircle';

import T from 'core/components/Translation';
import UserCreatorForm from '../UserCreator/UserCreatorForm';

type SimpleMaxPropertyValueSignupProps = {};

const SimpleMaxPropertyValueSignup = ({
  fixed,
}: SimpleMaxPropertyValueSignupProps) => (
  <div className="simple-max-property-value">
    <h2>
      <T id="MaxPropertyValue.signup.title" />
    </h2>
    <div className="simple-max-property-value-signup">
      <FontAwesomeIcon icon={faCheckCircle} className="icon success" />
      <h4 className="text-center">
        <T id="MaxPropertyValue.signup.description" />
      </h4>
      <UserCreatorForm
        buttonProps={{
          raised: true,
          secondary: true,
          label: <T id="MaxPropertyValue.signup.cta" />,
        }}
      />
    </div>
  </div>
);

export default SimpleMaxPropertyValueSignup;
