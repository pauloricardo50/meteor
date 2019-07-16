// @flow
import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { withState } from 'recompose';

import T from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';
import SimpleMaxPropertyValue from '../../components/SimpleMaxPropertyValue';
import SimpleMaxPropertyValueLightTheme from '../../components/SimpleMaxPropertyValue/SimpleMaxPropertyValueLightTheme';
import DashboardProgressBar from '../DashboardPage/DashboardProgress/DashboardProgressBar';
import Properties from './Properties';
import SimpleDashboardPageCTAs from './SimpleDashboardPageCTAs';
import useMedia from 'core/hooks/useMedia';
import BorrowersCard from './BorrowersCard/BorrowersCard';
import createTheme from 'core/config/muiCustom';
import SimpleMaxPropertyValueSticky from '../../components/SimpleMaxPropertyValue/SimpleMaxPropertyValueSticky';

type SimpleDashboardPageProps = {};

const SimpleDashboardPage = (props: SimpleDashboardPageProps) => {
  const { loan, currentUser, openBorrowersForm } = props;

  const progress = Calculator.personalInfoPercentSimple({ loan });
  const isMobile = useMedia({ maxWidth: 1200 });

  return (
    <div className="simple-dashboard-page animated fadeIn">
      <div className="simple-dashboard-page-content">
        <DashboardProgressBar currentStep={loan.step} variant="light" />
        <SimpleDashboardPageCTAs
          loanId={loan._id}
          progress={progress}
          currentUser={currentUser}
          withReturnToDashboard={false}
        />
        <div className="simple-dashboard-page-borrowers">
          <BorrowersCard {...props} />
          <div className="simple-dashboard-page-borrowers-right">
            {isMobile ? (
              <MuiThemeProvider theme={createTheme()}>
                <SimpleMaxPropertyValueSticky {...props} />
              </MuiThemeProvider>
            ) : (
              <SimpleMaxPropertyValueLightTheme>
                <SimpleMaxPropertyValue blue {...props} />
              </SimpleMaxPropertyValueLightTheme>
            )}
            <Properties loan={loan} />
          </div>
        </div>
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

export default withState('openBorrowersForm', 'setOpenBorrowersForm', false)(
  SimpleDashboardPage,
);
