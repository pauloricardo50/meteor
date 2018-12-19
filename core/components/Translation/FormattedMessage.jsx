import React from 'react';
import { FormattedMessage } from 'react-intl';

import { PURCHASE_TYPE } from '../../api/constants';
import { Consumer } from './withTranslationContext';

// For some "select" strings that need a default value
const defaultTranslationValues = {
  purchaseType: PURCHASE_TYPE.ACQUISITION,
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
