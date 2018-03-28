import React from 'react';
import PropTypes from 'prop-types';

import Recap from 'core/components/Recap';
import { toMoney } from 'core/utils/conversionFunctions';
import constants from 'core/config/constants';
import { T } from 'core/components/Translation';

import DashboardRecapSum from './DashboardRecapSum';

const getRecapArray = ({ loan, property }) => [
  {
    label: 'Recap.purchasePrice',
    value: toMoney(Math.round(property.value)),
  },
  {
    label: 'general.notaryFees',
    value: toMoney(Math.round(property.value * constants.notaryFees)),
  },
  {
    label: 'Recap.propertyWork',
    value: toMoney(Math.round(loan.general.propertyWork)),
  },
];

const DashboardRecapCost = props => (
  <div>
    <Recap array={getRecapArray(props)} />
    <DashboardRecapSum
      label={<T id="DashboardRecapCost.sumTitle" />}
      value={props.total}
    />
  </div>
);

DashboardRecapCost.propTypes = {
  total: PropTypes.number.isRequired,
};

export default DashboardRecapCost;
