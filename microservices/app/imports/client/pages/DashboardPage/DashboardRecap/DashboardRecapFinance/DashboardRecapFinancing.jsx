import React from 'react';
import PropTypes from 'prop-types';

import Recap from 'core/components/Recap';
import { toMoney } from 'core/utils/conversionFunctions';
import Calculator from 'core/utils/Calculator';
import T from 'core/components/Translation';

import DashboardRecapSum from './DashboardRecapSum';

const getRecapArray = ({ loan }) => {
  const loanValue = Calculator.selectLoanValue({ loan });
  const fortuneUsed = Calculator.getCashUsed({ loan });
  const insuranceWithdrawn = Calculator.getInsuranceWithdrawn({ loan });

  return [
    { label: 'Recap.ownFundsCash', value: toMoney(fortuneUsed) },
    { label: 'Recap.ownFundsInsurance', value: toMoney(insuranceWithdrawn) },
    { label: 'general.mortgageLoan', value: toMoney(loanValue) },
  ];
};

const DashboardRecapFinancing = props => (
  <div className="dashboard-recap-financing">
    <Recap array={getRecapArray(props)} />
    <DashboardRecapSum
      label={<T id="DashboardRecapFinancing.sumTitle" />}
      value={props.total}
    />
  </div>
);

DashboardRecapFinancing.propTypes = {
  loan: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
};

export default DashboardRecapFinancing;
