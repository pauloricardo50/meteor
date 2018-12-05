// @flow
import React from 'react';
import InterestRatesPageContainer from './InterestRatesPageContainer';
import { InsertInterestRatesDialogForm } from './InterestRatesDialogForm';

type InterestRatesPageProps = {};

const InterestRatesPage = (props: InterestRatesPageProps) => (
  <div className="card1 card-top interest-rates-page">
    <h1>Taux d'intérêt</h1>
    <InsertInterestRatesDialogForm />
  </div>
);

export default InterestRatesPageContainer(InterestRatesPage);
