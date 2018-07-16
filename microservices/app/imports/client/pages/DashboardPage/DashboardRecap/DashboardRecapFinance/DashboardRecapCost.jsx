import React from 'react';
import PropTypes from 'prop-types';

import Recap from 'core/components/Recap';
import { toMoney } from 'core/utils/conversionFunctions';
import { NOTARY_FEES } from 'core/config/financeConstants';
import T from 'core/components/Translation';

import DashboardRecapSum from './DashboardRecapSum';

const getRecapArray = (loan, property) => [
  {
    label: 'Recap.purchasePrice',
    value: toMoney(Math.round(property.value)),
  },
  {
    label: 'general.notaryFees',
    value: toMoney(Math.round(property.value * NOTARY_FEES)),
  },
  {
    label: 'Recap.propertyWork',
    value: toMoney(Math.round(loan.general.propertyWork)),
  },
];

const DashboardRecapCost = ({ loan,  total }) => (
  <React.Fragment>
    <Recap array={getRecapArray(loan, loan.property)} />
    <DashboardRecapSum
      label={<T id="DashboardRecapCost.sumTitle" />}
      value={total}
    />
  </React.Fragment>
);

DashboardRecapCost.propTypes = {
  loan: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
};

export default DashboardRecapCost;
