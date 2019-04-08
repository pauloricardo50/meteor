// @flow
import React from 'react';

import SimpleMaxPropertyValue from '../../components/SimpleMaxPropertyValue';
import SimpleMaxPropertyValueLightTheme from '../../components/SimpleMaxPropertyValue/SimpleMaxPropertyValueLightTheme';
import DashboardProgressBar from '../DashboardPage/DashboardProgress/DashboardProgressBar';
import BorrowersProgress from './BorrowersProgress';
import Properties from './Properties';

type SimpleDashboardPageProps = {};

const SimpleDashboardPage = (props: SimpleDashboardPageProps) => (
  <div className="simple-dashboard-page animated fadeIn">
    <DashboardProgressBar currentStep={props.loan.step} variant="light" />
    <div className="simple-dashboard-page-borrowers card1">
      <BorrowersProgress {...props} />
      <SimpleMaxPropertyValueLightTheme>
        <SimpleMaxPropertyValue {...props} />
      </SimpleMaxPropertyValueLightTheme>
    </div>
    <Properties loan={props.loan} />
  </div>
);

export default SimpleDashboardPage;
