//
import React from 'react';

import { getCurrentRate } from '../../api/organisations/helpers';
import T, { Percent, Money } from '../Translation';
import CommissionRatesViewerList from './CommissionRatesViewerList';
import CommissionRatesViewerContainer from './CommissionRatesViewerContainer';

const CommissionRatesViewer = ({
  commissionRates = [],
  generatedRevenues = 0,
}) => {
  const currentRate = getCurrentRate(commissionRates, generatedRevenues);

  return (
    <div>
      <h3 className="secondary">
        <T id="CommissionRatesViewer.currentRate" />
      </h3>
      <h1>
        <Percent value={currentRate} />
      </h1>
      {commissionRates.length > 1 && (
        <>
          <h3 className="secondary">
            <T id="CommissionRatesViewer.referredRevenues" />
          </h3>
          <h1>
            <Money value={generatedRevenues} />
          </h1>
          <CommissionRatesViewerList commissionRates={commissionRates} />
        </>
      )}
    </div>
  );
};

export default CommissionRatesViewerContainer(CommissionRatesViewer);
