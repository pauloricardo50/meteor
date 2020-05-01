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

const getRefinancingOwnFundsTitle = props => {
  const pledgedOwnFunds = Calculator.getPledgedOwnFunds(props);
  const nonPledgedOwnFunds = Calculator.getNonPledgedOwnFunds(props);

  if (!pledgedOwnFunds && !nonPledgedOwnFunds) {
    return (
      <div className="calculated-value flex center-align">
        <span className="mr-4">-</span>
        <FinancingOwnFundsStatus
          value={Calculator.getMissingOwnFunds(props)}
          {...props}
        />
      </div>
    );
  }

  if (!nonPledgedOwnFunds) {
    return (
      <div className="calculated-value" style={{ flexDirection: 'column' }}>
        <div className="flex center-align">
          <span className="chf">CHF</span>
          {toMoney(Math.abs(pledgedOwnFunds))}
          <FinancingOwnFundsStatus
            value={Calculator.getMissingOwnFunds(props)}
            {...props}
          />
        </div>
        <div className="mt-8">
          <T id="FinancingOwnFundsTitle.pledge" />
        </div>
      </div>
    );
  }

  return (
    <div className="calculated-value">
      <span className="chf">CHF</span>
      {toMoney(Math.abs(nonPledgedOwnFunds))}
      <FinancingOwnFundsStatus
        value={Calculator.getMissingOwnFunds(props)}
        {...props}
      />
    </div>
  );
};

const FinancingOwnFundsTitle = props => {
  const {
    loan: { purchaseType },
  } = props;
  const isRefinancing = purchaseType === PURCHASE_TYPE.REFINANCING;

  if (isRefinancing) {
    const title = getRefinancingOwnFundsTitle(props);
    return (
      <div className="financing-ownFunds-summary ownFunds">
        <div className="flex-col center">{title}</div>
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
