import React from 'react';
import { Helmet } from 'react-helmet';

import { INTEREST_RATES_COLLECTION } from 'core/api/interestRates/interestRatesConstants';
import collectionIcons from 'core/arrays/collectionIcons';
import Icon from 'core/components/Icon';
import Tabs from 'core/components/Tabs';

import InterestRatesChart from './InterestRatesChart/InterestRatesChart';
import { InsertInterestRatesDialogForm } from './InterestRatesDialogForm';
import InterestRatesPageContainer from './InterestRatesPageContainer';
import InterestRatesTable from './InterestRatesTable';
import { InsertIrs10yDialogForm } from './Irs10yDialogForm';
import Irs10yTable from './Irs10yTable/Irs10yTable';

const InterestRatesPage = ({
  interestRates,
  irs10y,
  currentInterestRates: { rates: currentRates },
}) => (
  <div className="interest-rates-page">
    <Helmet>
      <title>Taux d'intérêt</title>
    </Helmet>
    <h1 className="flex center-align">
      <Icon
        type={collectionIcons[INTEREST_RATES_COLLECTION]}
        style={{ marginRight: 8 }}
        size={32}
      />
      <span>Taux d'intérêt</span>
    </h1>
    <InterestRatesChart
      interestRates={[...interestRates].reverse()}
      irs10y={[...irs10y].reverse()}
    />
    <Tabs
      id="tabs"
      tabs={[
        {
          label: "Taux d'intérêt",
          content: (
            <>
              <InsertInterestRatesDialogForm
                currentInterestRates={currentRates}
              />
              <InterestRatesTable interestRates={interestRates} />
            </>
          ),
        },
        {
          label: 'IRS 10 ans',
          content: (
            <>
              <InsertIrs10yDialogForm />
              <Irs10yTable irs10y={irs10y} />
            </>
          ),
        },
      ]}
    />
  </div>
);

export default InterestRatesPageContainer(InterestRatesPage);
