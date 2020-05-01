import React from 'react';

import { PURCHASE_TYPE } from '../../../../api/loans/loanConstants';
import Calculator from '../../../../utils/Calculator';
import { toMoney } from '../../../../utils/conversionFunctions';
import Tooltip from '../../../Material/Tooltip';
import T from '../../../Translation';
import { CalculatedValue } from '../FinancingSection';
import { FORMATS } from '../FinancingSection/components/CalculatedValue';
import FinancingOwnFundsStatus from './FinancingOwnFundsStatus';

const feesTooltip = props => {
  const value = Calculator.getNotaryFeesTooltipValue(props);

  if (value) {
    return (
      <Tooltip title={`Frais de notaire: CHF ${toMoney(value)}`}>
        <span>&nbsp;+ frais</span>
      </Tooltip>
    );
  }

  return null;
};

const FinancingOwnFundsTitle = props => {
  const {
    loan: { purchaseType },
  } = props;
  const isRefinancing = purchaseType === PURCHASE_TYPE.REFINANCING;

  if (isRefinancing) {
    return (
      <div className="financing-ownFunds-summary ownFunds">
        <CalculatedValue
          value={Calculator.getRefinancingRequiredOwnFunds}
          {...props}
        >
          {value => (
            <div className="flex-col center">
              <span style={{ color: '#444444', marginBottom: 8 }}>
                <T
                  id="Financing.reimbursementRequiredOwnFunds.description"
                  values={{ isMissingOwnFunds: value < 0 }}
                />
              </span>
              <span>
                <span className="chf">CHF</span>
                {toMoney(Math.abs(value))}
              </span>
            </div>
          )}
        </CalculatedValue>
      </div>
    );
  }

  return (
    <div className="financing-ownFunds-summary ownFunds">
      <CalculatedValue value={Calculator.getNonPledgedOwnFunds} {...props} />
      <div className="flex-row center">
        <CalculatedValue
          value={Calculator.getOwnFundsRatio}
          format={FORMATS.PERCENT}
          {...props}
        />
        {feesTooltip(props)}
        <FinancingOwnFundsStatus
          value={Calculator.getMissingOwnFunds(props)}
          {...props}
        />
      </div>
    </div>
  );
};

export default FinancingOwnFundsTitle;
