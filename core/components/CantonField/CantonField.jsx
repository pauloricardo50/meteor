//
import React from 'react';
import { injectIntl } from 'react-intl';

import T from '../Translation';
import AutoFormTextInput from '../AutoForm/AutoFormTextInput';
import { CANTONS } from '../../api/constants';

const CantonField = ({ canton, intl: { formatMessage } }) => (
  <AutoFormTextInput
    inputProps={{
      currentValue:
        CANTONS[canton] || formatMessage({ id: 'Forms.canton.placeholder' }),
      label: <T id="Forms.canton" />,
      style: { width: '100%', maxWidth: '400px' },
      readOnly: true,
      required: true,
      todo: !canton,
      multiline: true,
    }}
    saveOnChange
    showValidIconOnChange
    updateFunc={() => Promise.resolve()}
  />
);

export default injectIntl(CantonField);
