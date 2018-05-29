import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';
import DonutChart from 'core/components/charts/DonutChart';
import { toMoney } from 'core/utils/conversionFunctions';
import Widget1MonthlyContainer from './Widget1MonthlyContainer';
import Widget1MonthlyInterests from './Widget1MonthlyInterests';

const Widget1Monthly = ({ data, total, interestRate, setInterestRate }) => (
  <div className="card1 widget1-monthly">
    <h3>
      <T id="Widget1Monthly.title" />
    </h3>
    <DonutChart
      data={data}
      intlPrefix="Widget1Monthly"
      // 300 width - 2*32 padding
      config={{
        chart: { width: 236, spacingTop: 0, marginTop: 0 },
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
    <Widget1MonthlyInterests value={interestRate} onChange={setInterestRate} />
  </div>
);

Widget1Monthly.propTypes = {
  data: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  interestRate: PropTypes.number.isRequired,
  setInterestRate: PropTypes.func.isRequired,
};

export default Widget1MonthlyContainer(Widget1Monthly);
