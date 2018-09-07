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
            <span className={current === required ? 'success' : 'error'}>
              {toMoney(current)}
            </span>
          ),
          required: toMoney(required),
        }}
      />
    </h4>
  </div>
);

export default OwnFundsCompleterContainer(OwnFundsCompleter);
