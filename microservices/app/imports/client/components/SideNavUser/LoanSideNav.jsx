// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { withProps } from 'recompose';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometer,
  faFolderOpen,
  faHome,
  faChartBar,
  faUsers,
  faCalculator,
} from '@fortawesome/pro-light-svg-icons';
import Divider from '@material-ui/core/Divider';

import T from 'core/components/Translation';
import { createRoute } from 'core/utils/routerUtils';
import { SUCCESS } from 'core/api/constants';
import Calculator from 'core/utils/Calculator';
import * as ROUTES from '../../../startup/client/appRoutes';
import PercentWithStatus from '../../../core/components/PercentWithStatus/PercentWithStatus';

type linksType = Array<{|
  id: string,
  to?: string,
  exact?: boolean,
  icon?: Object,
  Component?: React.Node,
  percent?: Function,
|}>;
const sideNavLinks: linksType = [
  {
    id: 'DashboardPage',
    to: ROUTES.DASHBOARD_PAGE,
    exact: true,
    icon: faTachometer,
  },
  { id: 'FinancingPage', to: ROUTES.FINANCING_PAGE, icon: faChartBar },
  { id: 'AppWidget1Page', to: ROUTES.APP_WIDGET1_PAGE, icon: faCalculator },
  { id: 'divider', Component: () => <Divider className="divider" /> },
  {
    id: 'BorrowersPage',
    to: ROUTES.BORROWERS_PAGE_NO_TAB,
    icon: faUsers,
    percent: loan =>
      Calculator.personalInfoPercent({ borrowers: loan.borrowers }),
  },
  {
    id: 'PropertiesPage',
    to: ROUTES.PROPERTIES_PAGE,
    icon: faHome,
    percent: loan => Calculator.propertyPercent({ loan }),
  },
  {
    id: 'FilesPage',
    to: ROUTES.FILES_PAGE,
    icon: faFolderOpen,
    percent: loan => Calculator.filesProgress({ loan }),
  },
];

export const LoanSideNav = ({
  loan,
  links,
}: {
  loan: any,
  links: linksType,
}) => (
  <ul className="loan-side-nav">
    {links
      .map(link =>
        (link.Component
          ? link
          : {
            ...link,
            to: createRoute(link.to, {
              ':loanId': loan._id,
              ':borrowerId': loan.borrowers[0]._id,
              ':propertyId': loan.properties[0]._id,
            }),
          }))
      .map(({ Component, to, id, icon, percent, ...otherProps }) => {
        if (Component) {
          return <Component key={id} />;
        }

        const progress = percent && percent(loan);

        return (
          <NavLink
            key={to}
            to={to}
            className="loan-side-nav-link"
            {...otherProps}
          >
            <FontAwesomeIcon icon={icon} className="icon" />
            <span className="text">
              <T id={`${id}.title`} />
              {percent && (
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
  links: PropTypes.arrayOf(PropTypes.object).isRequired,
  loan: PropTypes.object.isRequired,
};

export default withProps({ links: sideNavLinks })(LoanSideNav);
