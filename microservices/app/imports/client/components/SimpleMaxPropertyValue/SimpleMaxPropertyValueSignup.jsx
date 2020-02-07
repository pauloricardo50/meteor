import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/pro-light-svg-icons/faCheckCircle';

import T from 'core/components/Translation';
import UserCreatorForm from '../UserCreator/UserCreatorForm';

const SimpleMaxPropertyValueSignup = ({ fixed }) => (
  <div className="max-property-value">
    <h2>
      <T id="MaxPropertyValue.signup.title" />
    </h2>
    <div className="max-property-value-signup">
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
        omitValues={['firstName', 'lastName', 'phoneNumber']}
        submitFieldProps={{ label: <T id="general.continue" />, size: 'large' }}
        ctaId="maxPropertyValue"
      />
    </div>
  </div>
);

export default SimpleMaxPropertyValueSignup;
