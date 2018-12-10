import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Consumer } from './withTranslationContext';

export default ({ values = {}, ...props }) => (
  <Consumer>
    {(translationValues = {}) => (
      <FormattedMessage
        {...props}
        values={{ ...translationValues, ...values }}
      />
    )}
  </Consumer>
);
