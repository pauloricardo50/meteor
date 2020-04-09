import React from 'react';

import { toMoney } from '../../../../../utils/conversionFunctions';
import T from '../../../../Translation';
import OwnFundsCompleterContainer from './OwnFundsCompleterContainer';

const OwnFundsCompleter = ({ required, current }) => (
  <div className="own-funds-completer">
    <h4>
      <T
        id="Financing.ownFundsCompleter"
        values={{
          current: (
            <span
              className={
                current === required
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
      />
    </h4>
  </div>
);

export default OwnFundsCompleterContainer(OwnFundsCompleter);
