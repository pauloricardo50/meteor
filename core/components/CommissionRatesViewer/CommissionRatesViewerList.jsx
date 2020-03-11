import React from 'react';
import moment from 'moment';

import T, { Percent, Money } from '../Translation';

const CommissionRatesViewerList = ({ commissionRates }) => (
  <div>
    <h3 className="secondary">
      <T id="CommissionRatesViewer.commissionRatesList" />
    </h3>
    {commissionRates.map(({ rate, threshold, date }) => (
      <div key={rate}>
        <h4 className="secondary">
          <T
            id="CommissionRatesViewer.fromThreshold"
            values={{
              value: <Money value={threshold} />,
              date: moment(date).format('D MMM'),
            }}
          />
        </h4>
        <h3>
          <Percent value={rate} />
        </h3>
      </div>
    ))}
  </div>
);

export default CommissionRatesViewerList;
