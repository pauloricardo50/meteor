import React from 'react';
import { FormattedMessage } from 'react-intl';

import Icon from '../Icon';
import Tooltip from '../Material/Tooltip';
import { Consumer } from './withTranslationContext';

// For some "select" strings that need a default value
const defaultTranslationValues = {
  purchaseType: 'ACQUISITION',
};

export default ({ values = {}, tooltip, ...props }) => (
  <Consumer>
    {(translationValues = {}) => (
      <>
        <FormattedMessage
          {...props}
          values={{
            ...defaultTranslationValues,
            ...translationValues,
            ...values,
          }}
        />
        {tooltip && (
          <Tooltip title={tooltip}>
            <Icon
              type="help"
              style={{ margin: '0 4px', fontSize: 'inherit' }}
            />
          </Tooltip>
        )}
      </>
    )}
  </Consumer>
);
