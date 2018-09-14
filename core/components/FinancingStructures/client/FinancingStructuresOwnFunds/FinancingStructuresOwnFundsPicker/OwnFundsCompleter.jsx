// @flow
import React from 'react';

import T from '../../../../Translation';

import OwnFundsCompleterContainer from './OwnFundsCompleterContainer';
import { toMoney } from '../../../../../utils/conversionFunctions';

type OwnFundsCompleterProps = {};

const OwnFundsCompleter = ({ required, current }: OwnFundsCompleterProps) => (
  <div className="own-funds-completer">
    <h4>
      <T
        id="FinancingStructures.ownFundsCompleter"
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
