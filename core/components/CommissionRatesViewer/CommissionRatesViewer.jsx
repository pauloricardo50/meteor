import React from 'react';

import { COMMISSION_RATES_TYPE } from '../../api/commissionRates/commissionRateConstants';
import { getCurrentRate } from '../../api/organisations/helpers';
import T, { Money, Percent } from '../Translation';
import CommissionRatesViewerContainer from './CommissionRatesViewerContainer';
import CommissionRatesViewerList from './CommissionRatesViewerList';

const CommissionRatesViewer = ({
  commissionRates: { rates = [], type } = {},
  generatedRevenues = 0,
  generatedProductions = 0,
}) => {
  const currentRate =
    type === COMMISSION_RATES_TYPE.COMMISSIONS
      ? getCurrentRate(rates, generatedRevenues)
      : getCurrentRate(rates, generatedProductions);

  return (
    <div>
      <h3 className="secondary">
        <T id="CommissionRatesViewer.currentRate" />
      </h3>
      <h1>
        <Percent value={currentRate} />
      </h1>
      {rates.length > 1 && (
        <>
          <h3 className="secondary">
            <T id="CommissionRatesViewer.referredRevenues" />
          </h3>
          <h1>
            <Money
              value={
                type === COMMISSION_RATES_TYPE.COMMISSIONS
                  ? generatedRevenues
                  : generatedProductions
              }
            />
          </h1>
          <CommissionRatesViewerList commissionRates={rates} />
        </>
      )}
    </div>
  );
};

export default CommissionRatesViewerContainer(CommissionRatesViewer);
