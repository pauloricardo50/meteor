// @flow
import React from 'react';
import InterestRatesTable from './InterestRatesTable';
import InterestRatesPageContainer from './InterestRatesPageContainer';
import { InsertInterestRatesDialogForm } from './InterestRatesDialogForm';
import InterestRatesChart from './InterestRatesChart/InterestRatesChart';
import InsertIrs10yDialogForm from './Irs10yDialogForm/InsertIrs10yDialogForm';

type InterestRatesPageProps = {
  interestRates: Array<Object>,
  irs10y: Array<Object>,
};

const InterestRatesPage = ({
  interestRates,
  irs10y,
}: InterestRatesPageProps) => (
  <div className="card1 card-top interest-rates-page">
    {console.log('irs10y', irs10y)}
    <h1>Taux d'intérêt</h1>
    <InterestRatesChart
      interestRates={[...interestRates].reverse()}
      irs10y={[...irs10y].reverse()}
    />
    <InsertInterestRatesDialogForm />
    <InsertIrs10yDialogForm />
    <InterestRatesTable interestRates={interestRates} />
  </div>
);

export default InterestRatesPageContainer(InterestRatesPage);
