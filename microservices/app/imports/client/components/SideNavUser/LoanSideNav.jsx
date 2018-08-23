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
} from '@fortawesome/pro-light-svg-icons';

import T from 'core/components/Translation';
import { createRoute } from 'core/utils/routerUtils';
import * as ROUTES from '../../../startup/client/appRoutes';

type linksType = Array<{|
  id: string,
  to: string,
  exact?: boolean,
  icon: Object,
|}>;
const sideNavLinks: linksType = [
  {
    id: 'DashboardPage',
    to: ROUTES.DASHBOARD_PAGE,
    exact: true,
    icon: faTachometer,
  },
  { id: 'BorrowersPage', to: ROUTES.BORROWERS_PAGE_NO_TAB, icon: faUsers },
  { id: 'PropertiesPage', to: ROUTES.PROPERTIES_PAGE, icon: faHome },
  { id: 'FinancingPage', to: ROUTES.FINANCING_PAGE, icon: faChartBar },
  { id: 'FilesPage', to: ROUTES.FILES_PAGE, icon: faFolderOpen },
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
      .map(link => ({
        ...link,
        to: createRoute(link.to, {
          ':loanId': loan._id,
          ':borrowerId': loan.borrowers[0]._id,
          ':propertyId': loan.properties[0]._id,
        }),
      }))
      .map(({ to, id, icon, ...otherProps }) => (
        <NavLink
          key={to}
          to={to}
          className="loan-side-nav-link"
          {...otherProps}
        >
          <FontAwesomeIcon icon={icon} className="icon" />
          <T id={`${id}.title`} />
        </NavLink>
      ))}
  </ul>
);

LoanSideNav.propTypes = {
  links: PropTypes.arrayOf(PropTypes.object).isRequired,
  loan: PropTypes.object.isRequired,
};

export default withProps({ links: sideNavLinks })(LoanSideNav);
