// @flow
import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { withState, withProps, compose } from 'recompose';

import T from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';
import useMedia from 'core/hooks/useMedia';
import createTheme from 'core/config/muiCustom';
import { LightTheme } from 'core/components/Themes';
import SimpleMaxPropertyValue from '../../components/SimpleMaxPropertyValue';
import DashboardProgressBar from '../DashboardPage/DashboardProgress/DashboardProgressBar';
import Properties from './Properties';
import SimpleDashboardPageCTAs from './SimpleDashboardPageCTAs';
import BorrowersCard from './BorrowersCard/BorrowersCard';
import SimpleMaxPropertyValueSticky from '../../components/SimpleMaxPropertyValue/SimpleMaxPropertyValueSticky';

type SimpleDashboardPageProps = {};

const SimpleDashboardPage = (props: SimpleDashboardPageProps) => {
  const { loan, currentUser, openBorrowersForm, progress } = props;

  const isMobile = useMedia({ maxWidth: 1200 });

  return (
    <div className="simple-dashboard-page animated fadeIn">
      <div className="simple-dashboard-page-content">
        <DashboardProgressBar loan={loan} variant="light" />
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
              <LightTheme>
                <SimpleMaxPropertyValue blue {...props} />
              </LightTheme>
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

export default compose(
  withProps(({ loan }) => ({
    progress: Calculator.personalInfoPercentSimple({ loan }),
  })),
  withState('openBorrowersForm', 'setOpenBorrowersForm', ({ progress = 0 }) =>
    progress === 0 ? 0 : false,
  ),
)(SimpleDashboardPage);
