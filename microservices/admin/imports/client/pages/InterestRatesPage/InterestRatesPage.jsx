// @flow
import React from 'react';
import LineChart from 'core/components/charts/LineChart';
import InterestRatesTable from './InterestRatesTable';
import InterestRatesPageContainer from './InterestRatesPageContainer';
import { InsertInterestRatesDialogForm } from './InterestRatesDialogForm';
import InterestRatesChart from './InterestRatesChart/InterestRatesChart';

type InterestRatesPageProps = {
  interestRates: Array<Object>,
};

const InterestRatesPage = ({ interestRates }: InterestRatesPageProps) => (
  <div className="card1 card-top interest-rates-page">
    <h1>Taux d'intérêt</h1>
    <InterestRatesChart interestRates={[...interestRates].reverse()} />
    <InsertInterestRatesDialogForm />
    <InterestRatesTable interestRates={interestRates} />
  </div>
);

export default InterestRatesPageContainer(InterestRatesPage);
