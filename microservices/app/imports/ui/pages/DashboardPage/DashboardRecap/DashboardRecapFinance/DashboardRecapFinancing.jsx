import React from 'react';
import PropTypes from 'prop-types';

import Recap from 'core/components/Recap';
import { toMoney } from 'core/utils/conversionFunctions';
import { getTotalUsed, getLoanValue } from 'core/utils/loanFunctions';
import { T } from 'core/components/Translation';

import DashboardRecapSum from './DashboardRecapSum';

const getRecapArray = (props) => {
  const { loan: { general: { insuranceFortuneUsed, fortuneUsed } } } = props;
  const loanValue = getLoanValue(props);
  const totalUsed = getTotalUsed(props);

  return [
    {
      label: 'general.ownFunds',
      value: toMoney(totalUsed),
      hide: insuranceFortuneUsed,
    },
    {
      label: 'Recap.ownFundsCash',
      value: toMoney(fortuneUsed),
      hide: !insuranceFortuneUsed,
    },
    {
      label: 'Recap.ownFundsInsurance',
      value: toMoney(insuranceFortuneUsed),
      hide: !insuranceFortuneUsed,
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
    <DashboardRecapSum
      label={<T id="DashboardRecapFinancing.sumTitle" />}
      value={props.total}
    />
  </div>
);

DashboardRecapFinancing.propTypes = {
  total: PropTypes.number.isRequired,
  loan: PropTypes.object.isRequired,
};

export default DashboardRecapFinancing;
