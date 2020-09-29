import React from 'react';

import { OWN_FUNDS_USAGE_TYPES } from '../../../../../api/loans/loanConstants';
import { toMoney } from '../../../../../utils/conversionFunctions';
import Icon from '../../../../Icon';
import T from '../../../../Translation';
import { getMaxPledge } from './FinancingOwnFundsPickerHelpers';

const FinancingOwnFundsPledgeWarning = props => {
  if (props.usageType === OWN_FUNDS_USAGE_TYPES.PLEDGE) {
    const maxPledge = getMaxPledge(props);
    return (
      <p className="financing-pledge-warning primary">
        <Icon type="info" className="icon" />
        <T
          id="FinancingOwnFundsPledgeWarning.description"
          values={{
            maxPledge: (
              <b style={{ color: 'black' }}>
                &nbsp;
                {toMoney(maxPledge)}
                &nbsp;
              </b>
            ),
          }}
        />
      </p>
    );
  }

  return null;
};

export default FinancingOwnFundsPledgeWarning;
