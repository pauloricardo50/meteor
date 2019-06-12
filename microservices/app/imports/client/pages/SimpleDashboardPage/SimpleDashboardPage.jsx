// @flow
import React from 'react';

import T from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';
import BorrowersAdder from 'imports/client/components/BorrowersAdder/BorrowersAdder';
import SimpleMaxPropertyValue from '../../components/SimpleMaxPropertyValue';
import SimpleMaxPropertyValueLightTheme from '../../components/SimpleMaxPropertyValue/SimpleMaxPropertyValueLightTheme';
import DashboardProgressBar from '../DashboardPage/DashboardProgress/DashboardProgressBar';
import BorrowersProgress from './BorrowersProgress';
import Properties from './Properties';
import SimpleDashboardPageCTAs from './SimpleDashboardPageCTAs';

type SimpleDashboardPageProps = {};

const SimpleDashboardPage = (props: SimpleDashboardPageProps) => {
  const { loan, currentUser } = props;
  const { borrowers = [] } = loan;

  if (!borrowers.length) {
    return <BorrowersAdder loanId={loan._id} />;
  }

  const progress = Calculator.personalInfoPercentSimple({ loan });

  return (
    <div className="simple-dashboard-page animated fadeIn">
      <div className="simple-dashboard-page-content">
        <DashboardProgressBar currentStep={loan.step} variant="light" />
        <div className="simple-dashboard-page-borrowers card1">
          <BorrowersProgress {...props} progress={progress} />
          <SimpleMaxPropertyValueLightTheme>
            <SimpleMaxPropertyValue blue {...props} />
          </SimpleMaxPropertyValueLightTheme>
        </div>
        <Properties loan={loan} />
        <SimpleDashboardPageCTAs
          loanId={loan._id}
          progress={progress}
          currentUser={currentUser}
        />
      </div>
      <div className="simple-dashboard-page-footer">
        <span>
          <T id="LoanSelector.name" values={{ name: loan.name }} />
        </span>
        <span className="secondary">{loan.customName}</span>
      </div>
    </div>
  );
};

export default SimpleDashboardPage;
