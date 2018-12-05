// @flow
import React from 'react';
import InterestRatesTable from './InterestRatesTable';
import InterestRatesPageContainer from './InterestRatesPageContainer';
import { InsertInterestRatesDialogForm } from './InterestRatesDialogForm';

type InterestRatesPageProps = {
  interestRates: Array<Object>,
};

const InterestRatesPage = ({ interestRates }: InterestRatesPageProps) => (
  <div className="card1 card-top interest-rates-page">
    <h1>Taux d'intérêt</h1>
    <InsertInterestRatesDialogForm />
    <InterestRatesTable interestRates={interestRates} />
  </div>
);

export default InterestRatesPageContainer(InterestRatesPage);
