import React from 'react';

import { OWN_FUNDS_ROUNDING_AMOUNT } from '../../../../../config/financeConstants';
import { toMoney } from '../../../../../utils/conversionFunctions';
import T from '../../../../Translation';
import OwnFundsCompleterContainer from './OwnFundsCompleterContainer';

const OwnFundsCompleter = ({ required, current }) => {
  const isSuccess = Math.abs(required - current) <= OWN_FUNDS_ROUNDING_AMOUNT;

  return (
    <div className="own-funds-completer">
      <h4>
        <T
          values={{
            current: (
              <span
                className={
                  isSuccess
                    ? 'success'
                    : current < required
                    ? 'primary'
                    : 'error'
                }
              >
                {toMoney(current)}
              </span>
            ),
            required: <span className="secondary">{toMoney(required)}</span>,
          }}
          defaultMessage="{current} / {required} alloués"
        />
      </h4>
    </div>
  );
};

export default OwnFundsCompleterContainer(OwnFundsCompleter);
