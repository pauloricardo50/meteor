import React from 'react';
import PropTypes from 'prop-types';

import Recap from 'core/components/Recap';
import { toMoney } from 'core/utils/conversionFunctions';
import { getTotalUsed, getLoanValue } from 'core/utils/loanFunctions';

const getRecapArray = (props) => {
  const { loan } = props;
  const loanValue = getLoanValue(props);
  const totalUsed = getTotalUsed(props);

  return [
    {
      label: 'general.ownFunds',
      value: toMoney(totalUsed),
      hide: loan.general.insuranceFortuneUsed,
    },
    {
      label: 'Recap.ownFundsCash',
      value: toMoney(loan.general.fortuneUsed),
      hide: !loan.general.insuranceFortuneUsed,
    },
    {
      label: 'Recap.ownFundsInsurance',
      value: toMoney(loan.general.insuranceFortuneUsed),
      hide: !loan.general.insuranceFortuneUsed,
    },
    {
      label: 'general.mortgageLoan',
      value: toMoney(loanValue),
    },
  ];
};

const DashboardRecapFinancing = props => (
  <div>
    <Recap array={getRecapArray(props)} />
  </div>
);

DashboardRecapFinancing.propTypes = {};

export default DashboardRecapFinancing;
