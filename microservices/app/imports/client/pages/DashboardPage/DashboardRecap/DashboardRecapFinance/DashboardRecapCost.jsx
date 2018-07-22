import React from 'react';
import PropTypes from 'prop-types';

import Recap from 'core/components/Recap';
import { toMoney } from 'core/utils/conversionFunctions';
import { NOTARY_FEES } from 'core/config/financeConstants';
import T from 'core/components/Translation';
import { PURCHASE_TYPE } from 'core/api/constants';
import DashboardRecapSum from './DashboardRecapSum';

const getRecapArray = (loan, property) => [
  {
    label:
      loan.general.purchaseType === PURCHASE_TYPE.ACQUISITION
        ? 'Recap.purchasePrice'
        : 'Recap.propertyValue',
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

const DashboardRecapCost = ({ loan, total }) => (
  <div className="dashboard-recap-cost">
    <Recap array={getRecapArray(loan, loan.property)} />
    <DashboardRecapSum
      label={<T id="DashboardRecapCost.sumTitle" />}
      value={total}
    />
  </div>
);

DashboardRecapCost.propTypes = {
  loan: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
};

export default DashboardRecapCost;
