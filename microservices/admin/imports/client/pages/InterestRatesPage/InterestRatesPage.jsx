// @flow
import React from 'react';

import Tabs from 'core/components/Tabs/Tabs';
import Icon from 'core/components/Icon/Icon';
import collectionIcons from 'core/arrays/collectionIcons';
import { INTEREST_RATES_COLLECTION } from 'core/api/constants';
import InterestRatesChart from './InterestRatesChart/InterestRatesChart';
import Irs10yTable from './Irs10yTable/Irs10yTable';
import Irs10yChart from './Irs10yChart/Irs10yChart';
import { InsertIrs10yDialogForm } from './Irs10yDialogForm';
import InterestRatesTable from './InterestRatesTable';
import InterestRatesPageContainer from './InterestRatesPageContainer';
import { InsertInterestRatesDialogForm } from './InterestRatesDialogForm';

type InterestRatesPageProps = {
  interestRates: Array<Object>,
  irs10y: Array<Object>,
  currentInterestRates: Object,
};

const InterestRatesPage = ({
  interestRates,
  irs10y,
  currentInterestRates: { rates: currentRates },
}: InterestRatesPageProps) => (
  <div className="card1 card-top interest-rates-page">
    <h1 className="flex center-align">
      <Icon
        type={collectionIcons[INTEREST_RATES_COLLECTION]}
        style={{ marginRight: 8 }}
        size={32}
      />
      <span>Taux d'intérêt</span>
    </h1>
    <Tabs
      id="tabs"
      tabs={[
        {
          label: "Taux d'intérêt",
          content: (
            <>
              <InterestRatesChart
                interestRates={[...interestRates].reverse()}
                irs10y={[...irs10y].reverse()}
              />
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
              <Irs10yChart irs10y={[...irs10y].reverse()} />
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
