import React from 'react';
import PropTypes from 'prop-types';

import Recap from 'core/components/Recap';
import { toMoney } from 'core/utils/conversionFunctions';
import constants from 'core/config/constants';

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
  </div>
);

DashboardRecapCost.propTypes = {};

export default DashboardRecapCost;
