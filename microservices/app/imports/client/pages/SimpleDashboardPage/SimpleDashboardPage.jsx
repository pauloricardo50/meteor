import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { compose, withProps, withState } from 'recompose';

import { PURCHASE_TYPE } from 'core/api/loans/loanConstants';
import { LightTheme } from 'core/components/Themes';
import T from 'core/components/Translation';
import createTheme from 'core/config/muiCustom';
import useMedia from 'core/hooks/useMedia';
import Calculator from 'core/utils/Calculator';

import SimpleMaxPropertyValue from '../../components/SimpleMaxPropertyValue';
import SimpleMaxPropertyValueSticky from '../../components/SimpleMaxPropertyValue/SimpleMaxPropertyValueSticky';
import DashboardProgressBar from '../DashboardPage/DashboardProgress/DashboardProgressBar';
import BorrowersCard from './BorrowersCard/BorrowersCard';
import Properties from './Properties';
import SimpleDashboardPageCTAs from './SimpleDashboardPageCTAs';
import SimpleDashboardPagePropertyAdder from './SimpleDashboardPagePropertyAdder';

const defaultTheme = createTheme({});

const SimpleDashboardPage = props => {
  const { loan, currentUser } = props;
  const {
    _id: loanId,
    name,
    customName,
    maxPropertyValue,
    purchaseType,
    properties,
  } = loan;

  const isMobile = useMedia({ maxWidth: 1200 });

  return (
    <div className="simple-dashboard-page animated fadeIn">
      <div className="simple-dashboard-page-content">
        <DashboardProgressBar loan={loan} variant="light" />
        <SimpleDashboardPageCTAs
          loanId={loanId}
          currentUser={currentUser}
          withReturnToDashboard={false}
          maxPropertyValue={maxPropertyValue}
        />
        <div className="simple-dashboard-page-borrowers">
          <div className="simple-dashboard-page-borrowers-left">
            {purchaseType === PURCHASE_TYPE.REFINANCING &&
              !properties.length && (
                <SimpleDashboardPagePropertyAdder loanId={loanId} />
              )}
            <BorrowersCard {...props} />
          </div>

          <div className="simple-dashboard-page-borrowers-right">
            {isMobile ? (
              <MuiThemeProvider theme={defaultTheme}>
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
          <T id="LoanSelector.name" values={{ name }} />
        </span>
        <span className="secondary">{customName}</span>
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
