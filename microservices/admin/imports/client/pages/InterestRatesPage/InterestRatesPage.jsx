// @flow
import React from 'react';
import Tabs from 'imports/core/components/Tabs/Tabs';
import InterestRatesTable from './InterestRatesTable';
import InterestRatesPageContainer from './InterestRatesPageContainer';
import { InsertInterestRatesDialogForm } from './InterestRatesDialogForm';
import InterestRatesChart from './InterestRatesChart/InterestRatesChart';
import { InsertIrs10yDialogForm } from './Irs10yDialogForm';
import Irs10yTable from './Irs10yTable/Irs10yTable';
import Irs10yChart from './Irs10yChart/Irs10yChart';

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
    <h1>Taux d'intérêt</h1>

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
                key="interest-rates-chart"
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
              <Irs10yChart irs10y={[...irs10y].reverse()} key="irs10y-chart" />
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
