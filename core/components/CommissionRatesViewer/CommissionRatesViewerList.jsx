import React from 'react';
import moment from 'moment';

import T, { Money, Percent } from '../Translation';

const CommissionRatesViewerList = ({ commissionRates }) => (
  <div>
    <h3 className="secondary">
      <T id="CommissionRatesViewer.commissionRatesList" />
    </h3>
    {commissionRates.map(({ rate, threshold, startDate }) => (
      <div key={rate}>
        <h4 className="secondary">
          <T
            id="CommissionRatesViewer.fromThreshold"
            values={{
              value: <Money value={threshold} />,
              startDate: moment(startDate).format('D MMM'),
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
