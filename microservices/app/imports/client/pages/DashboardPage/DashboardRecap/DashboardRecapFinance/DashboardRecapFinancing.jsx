import React from 'react';
import PropTypes from 'prop-types';

import { PURCHASE_TYPE } from 'core/api/loans/loanConstants';
import Recap from 'core/components/Recap';
import T from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';
import { toMoney } from 'core/utils/conversionFunctions';

import DashboardRecapSum from './DashboardRecapSum';

const getRecapArray = ({ loan, isRefinancing }) => {
  if (isRefinancing) {
    return [
      {
        label: 'Forms.reimbursementPenalty',
        value: toMoney(Calculator.selectReimbursementPenalty({ loan })),
      },
      {
        label: 'general.notaryFees',
        value: toMoney(Calculator.getFees({ loan }).total),
      },
    ];
  }
  const loanValue = Calculator.selectLoanValue({ loan });
  const ownFunds = Calculator.getNonPledgedOwnFunds({ loan });
  const ownFundsPledged = Calculator.getTotalPledged({ loan });

  return [
    { label: 'Recap.ownFunds', value: toMoney(ownFunds) },
    { label: 'Recap.ownFundsPledged', value: toMoney(ownFundsPledged) },
    { label: 'general.mortgageLoan', value: toMoney(loanValue) },
  ];
};

const DashboardRecapFinancing = props => {
  const { loan } = props;
  const { purchaseType } = loan;
  const isRefinancing = purchaseType === PURCHASE_TYPE.REFINANCING;

  return (
    <div className="dashboard-recap-financing">
      <Recap array={getRecapArray({ ...props, isRefinancing })} />
      {isRefinancing ? (
        <div className="dashboard-recap-sum fixed-size">
          <h4 className="label">
            <T
              id="Financing.reimbursementRequiredOwnFunds.description"
              values={{
                isMissingOwnFunds:
                  Calculator.getReimbursementRequiredOwnFunds({ loan }) > 0,
              }}
            />
          </h4>
          <h3 className="value">
            {toMoney(
              Math.abs(Calculator.getReimbursementRequiredOwnFunds({ loan })),
            )}
          </h3>
        </div>
      ) : (
        <DashboardRecapSum
          label={<T id="DashboardRecapFinancing.sumTitle" />}
          value={props.total}
        />
      )}
    </div>
  );
};

DashboardRecapFinancing.propTypes = {
  loan: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
};

export default DashboardRecapFinancing;
