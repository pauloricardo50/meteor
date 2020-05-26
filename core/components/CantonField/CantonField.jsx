import React from 'react';
import { useIntl } from 'react-intl';

import { CANTONS } from '../../api/loans/loanConstants';
import AutoFormTextInput from '../AutoForm/AutoFormTextInput';
import T from '../Translation';

const CantonField = ({ canton }) => {
  const { formatMessage } = useIntl();

  return (
    <AutoFormTextInput
      InputProps={{
        currentValue:
          CANTONS[canton] || formatMessage({ id: 'Forms.canton.placeholder' }),
        label: <T id="Forms.canton" />,
        style: { width: '100%', maxWidth: '400px' },
        readOnly: true,
        required: true,
        todo: !canton,
        multiline: true,
        id: 'canton',
      }}
      saveOnChange
      showValidIconOnChange
      updateFunc={() => Promise.resolve()}
    />
  );
};

export default CantonField;
