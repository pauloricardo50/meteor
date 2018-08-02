import React from 'react';
import PropTypes from 'prop-types';

import Recap from 'core/components/Recap';
import { toMoney } from 'core/utils/conversionFunctions';
import T from 'core/components/Translation';
import { PURCHASE_TYPE } from 'core/api/constants';
import Calculator from 'core/utils/Calculator';
import DashboardRecapSum from './DashboardRecapSum';

const getRecapArray = loan => [
  {
    label:
      loan.general.purchaseType === PURCHASE_TYPE.ACQUISITION
        ? 'Recap.purchasePrice'
        : 'Recap.propertyValue',
    value: toMoney(Calculator.selectPropertyValue({ loan })),
  },
  {
    label: 'general.notaryFees',
    value: toMoney(Calculator.getFees({ loan })),
  },
  {
    label: 'Recap.propertyWork',
    value: toMoney(Calculator.selectPropertyWork({ loan })),
  },
];

const DashboardRecapCost = ({ loan, total }) => (
  <div className="dashboard-recap-cost">
    <Recap array={getRecapArray(loan)} />
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
