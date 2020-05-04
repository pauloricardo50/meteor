import React from 'react';
import PropTypes from 'prop-types';

import { PURCHASE_TYPE } from 'core/api/loans/loanConstants';
import Recap from 'core/components/Recap';
import T from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';
import { toMoney } from 'core/utils/conversionFunctions';

import DashboardRecapSum from './DashboardRecapSum';

const getRecapArray = (loan, isRefinancing) => {
  if (isRefinancing) {
    return [
      {
        label: 'Forms.newWantedLoan',
        value: toMoney(
          Calculator.selectStructureKey({ loan, key: 'wantedLoan' }),
        ),
      },
      {
        label: 'Forms.previousLoan',
        value: toMoney(Calculator.getPreviousLoanValue({ loan })),
      },
    ];
  }
  return [
    {
      label: 'Forms.value',
      value: toMoney(Calculator.selectPropertyValue({ loan })),
    },
    {
      label: 'general.notaryFees',
      value: toMoney(Calculator.getFees({ loan }).total),
    },
    {
      label: 'Recap.propertyWork',
      value: toMoney(Calculator.selectPropertyWork({ loan })),
    },
  ];
};

const DashboardRecapCost = ({ loan, total }) => {
  const { purchaseType } = loan;
  const isRefinancing = purchaseType === PURCHASE_TYPE.REFINANCING;
  return (
    <div className="dashboard-recap-cost">
      <Recap array={getRecapArray(loan, isRefinancing)} />
      {isRefinancing ? (
        <div className="dashboard-recap-sum fixed-size">
          <h4 className="label">
            <T
              id="Forms.refinancingTotal"
              values={{
                isLoanIncreased: Calculator.getLoanEvolution({ loan }) > 0,
              }}
            />
          </h4>
          <h3 className="value">
            {toMoney(Math.abs(Calculator.getLoanEvolution({ loan })))}
          </h3>
        </div>
      ) : (
        <DashboardRecapSum
          label={<T id="DashboardRecapCost.sumTitle" />}
          value={total}
        />
      )}
    </div>
  );
};

DashboardRecapCost.propTypes = {
  loan: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
};

export default DashboardRecapCost;
