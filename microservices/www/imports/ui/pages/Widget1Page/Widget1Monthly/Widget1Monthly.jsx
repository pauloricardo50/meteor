import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';
import DonutChart from 'core/components/charts/DonutChart';
import { toMoney } from 'core/utils/conversionFunctions';
import Widget1MonthlyContainer from './Widget1MonthlyContainer';
import Widget1MonthlyInterests from './Widget1MonthlyInterests';
import Widget1MonthlyMaintenance from './Widget1MonthlyMaintenance';

const Widget1Monthly = ({
  data,
  total,
  interestRate,
  setInterestRate,
  useMaintenance,
  setMaintenance,
}) => (
  <div className="card1 widget1-monthly">
    <h3>
      <T id="Widget1Monthly.title" />
    </h3>
    <span className="widget1-monthly-chart">
      <DonutChart
        data={data}
        intlPrefix="Widget1Monthly"
        config={{
          chart: { width: 300, spacingTop: 0, marginTop: 0 },
          plotOptions: {
            pie: {
              tooltip: {
                headerFormat: '<b>{point.key}</b><br />',
                pointFormat: 'CHF {point.y:,.0f}',
              },
            },
          },
        }}
        title={`${toMoney(total)} /mois`}
      />
    </span>
    <div className="card-bottom">
      <Widget1MonthlyInterests
        value={interestRate}
        onChange={setInterestRate}
      />
      <Widget1MonthlyMaintenance
        value={useMaintenance}
        onChange={setMaintenance}
      />
    </div>
  </div>
);

Widget1Monthly.propTypes = {
  data: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  interestRate: PropTypes.number.isRequired,
  setInterestRate: PropTypes.func.isRequired,
  useMaintenance: PropTypes.bool.isRequired,
  setMaintenance: PropTypes.func.isRequired,
};

export default Widget1MonthlyContainer(Widget1Monthly);
