// @flow
import React from 'react';

import T, { Percent, Money } from '../Translation';
import CommissionRatesViewerList from './CommissionRatesViewerList';

type CommissionRatesViewerProps = {};

export const getCurrentRate = (commissionRates, referredRevenues) => {
  if (commissionRates.length === 1) {
    return commissionRates[0].rate;
  }

  let index = 0;
  commissionRates.some(({ threshold }, i) => {
    if (threshold > referredRevenues) {
      index = i - 1;
      return true;
    }

    index = i;
    return false;
  });
  return commissionRates[index].rate;
};

const CommissionRatesViewer = ({
  commissionRates = [],
  referredRevenues = 0,
}: CommissionRatesViewerProps) => {
  const currentRate = getCurrentRate(commissionRates, referredRevenues);

  return (
    <div>
      <h3 className="secondary">
        <T id="CommissionRatesViewer.currentRate" />
      </h3>
      <h1>
        <Percent value={currentRate} />
      </h1>
      <h3 className="secondary">
        <T id="CommissionRatesViewer.referredRevenues" />
      </h3>
      <h1>
        <Money value={referredRevenues} />
      </h1>
      {commissionRates.length > 1 && (
        <CommissionRatesViewerList commissionRates={commissionRates} />
      )}
    </div>
  );
};

export default CommissionRatesViewer;
