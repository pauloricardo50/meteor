import React from 'react';
import { FormattedMessage } from 'react-intl';

import Icon from '../Icon';
import Tooltip from '../Material/Tooltip';
import defaultIntlValues from './defaultIntlValues';
import { Consumer } from './withTranslationContext';

export default ({ values = {}, tooltip, ...props }) => (
  <Consumer>
    {(translationValues = {}) => {
      const finalValues = {
        ...defaultIntlValues,
        ...translationValues,
        ...values,
      };

      return (
        <>
          <FormattedMessage {...props} values={finalValues} />
          {tooltip && (
            <Tooltip title={tooltip}>
              <Icon
                type="help"
                style={{ margin: '0 4px', fontSize: 'inherit' }}
              />
            </Tooltip>
          )}
        </>
      );
    }}
  </Consumer>
);
