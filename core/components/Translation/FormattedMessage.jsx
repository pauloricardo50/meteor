import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Consumer } from './withTranslationContext';

// For some "select" strings that need a default value
const defaultTranslationValues = {
  purchaseType: 'ACQUISITION',
};

export default ({ values = {}, ...props }) => (
  <Consumer>
    {(translationValues = {}) => (
      <FormattedMessage
        {...props}
        values={{
          ...defaultTranslationValues,
          ...translationValues,
          ...values,
        }}
      />
    )}
  </Consumer>
);
