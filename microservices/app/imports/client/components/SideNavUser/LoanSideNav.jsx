import React from 'react';
import { faChartBar } from '@fortawesome/pro-light-svg-icons/faChartBar';
import { faFolderOpen } from '@fortawesome/pro-light-svg-icons/faFolderOpen';
import { faHome } from '@fortawesome/pro-light-svg-icons/faHome';
// import { faCalculator } from '@fortawesome/pro-light-svg-icons/faCalculator';
import { faScroll } from '@fortawesome/pro-light-svg-icons/faScroll';
import { faTachometer } from '@fortawesome/pro-light-svg-icons/faTachometer';
import { faUsdCircle } from '@fortawesome/pro-light-svg-icons/faUsdCircle';
import { faUsers } from '@fortawesome/pro-light-svg-icons/faUsers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { withProps } from 'recompose';

import { SUCCESS } from 'core/api/constants';
import { PURCHASE_TYPE } from 'core/api/loans/loanConstants';
import { PROPERTY_CATEGORY } from 'core/api/properties/propertyConstants';
import PercentWithStatus from 'core/components/PercentWithStatus/PercentWithStatus';
import T from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';
import { createRoute } from 'core/utils/routerUtils';

import APP_ROUTES from '../../../startup/client/appRoutes';

const isOnProProperty = loan => {
  // If there's only one property, don't show the percentage
  if (loan.properties && loan.properties.length === 1) {
    return loan.properties[0].category === PROPERTY_CATEGORY.PRO;
  }

  // Else: show the percentage if the selected structure is not a pro property
  return (
    Calculator.selectPropertyKey({ loan, key: 'category' }) ===
    PROPERTY_CATEGORY.PRO
  );
};

const sideNavLinks = [
  {
    id: 'DashboardPage',
    to: APP_ROUTES.DASHBOARD_PAGE.path,
    exact: true,
    icon: faTachometer,
  },
  { id: 'FinancingPage', to: APP_ROUTES.FINANCING_PAGE.path, icon: faChartBar },
  // { id: 'AppWidget1Page', to: APP_ROUTES.APP_WIDGET1_PAGE, icon: faCalculator },
  { id: 'SolvencyPage', to: APP_ROUTES.SOLVENCY_PAGE.path, icon: faScroll },
  { id: 'divider', Component: () => <Divider className="divider" /> },
  {
    id: 'RefinancingPage',
    to: APP_ROUTES.REFINANCING_PAGE.path,
    icon: faUsdCircle,
    percent: loan => Calculator.refinancingPercent({ loan }),
    condition: loan => loan.purchaseType === PURCHASE_TYPE.REFINANCING,
  },
  {
    id: 'BorrowersPage',
    to: APP_ROUTES.BORROWERS_PAGE_NO_TAB.path,
    icon: faUsers,
    percent: loan => Calculator.personalInfoPercent({ loan }),
  },
  {
    id: 'PropertiesPage',
    to: APP_ROUTES.PROPERTIES_PAGE.path,
    icon: faHome,
    percent: loan =>
      !loan.hasPromotion &&
      !isOnProProperty(loan) &&
      Calculator.propertyPercent({ loan }),
  },
  {
    id: 'FilesPage',
    to: APP_ROUTES.FILES_PAGE.path,
    icon: faFolderOpen,
    percent: loan => Calculator.filesProgress({ loan }).percent,
  },
];

export const LoanSideNav = ({ loan, links, closeDrawer }) => (
  <ul className="loan-side-nav">
    {links
      .filter(({ condition }) => (condition ? condition(loan) : true))
      .map(link =>
        link.Component
          ? link
          : {
              ...link,
              to: createRoute(link.to, {
                loanId: loan._id,
                borrowerId: loan.borrowers.length && loan.borrowers[0]._id,
              }),
            },
      )
      .map(({ Component, to, id, icon, percent, condition, ...otherProps }) => {
        if (Component) {
          return <Component key={id} />;
        }

        const progress = percent && percent(loan);

        return (
          <NavLink
            key={to}
            to={to}
            className="loan-side-nav-link"
            onClick={closeDrawer}
            {...otherProps}
          >
            <FontAwesomeIcon icon={icon} className="icon" />
            <span className="text">
              <T id={`${id}.title`} />
              {percent && progress !== false && (
                <span className="progress">
                  <PercentWithStatus
                    value={progress}
                    status={progress >= 1 ? SUCCESS : null}
                    rounded
                  />
                </span>
              )}
            </span>
          </NavLink>
        );
      })}
  </ul>
);

LoanSideNav.propTypes = {
  closeDrawer: PropTypes.func.isRequired,
  links: PropTypes.arrayOf(PropTypes.object).isRequired,
  loan: PropTypes.object.isRequired,
};

export default withProps({ links: sideNavLinks })(LoanSideNav);
