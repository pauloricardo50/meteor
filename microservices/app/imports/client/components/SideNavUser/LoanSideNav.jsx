// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { withProps } from 'recompose';

import T from 'core/components/Translation';
import { createRoute } from 'core/utils/routerUtils';
import * as ROUTES from '../../../startup/client/appRoutes';

type linksType = Array<{| id: string, to: string, exact?: boolean |}>;
const sideNavLinks: linksType = [
  { id: 'DashboardPage', to: ROUTES.DASHBOARD_PAGE, exact: true },
  { id: 'FilesPage', to: ROUTES.FILES_PAGE },
  { id: 'ClosingPage', to: ROUTES.CLOSING_PAGE },
  { id: 'BorrowersPage', to: ROUTES.BORROWERS_PAGE },
  { id: 'FinancingPage', to: ROUTES.FINANCING_PAGE },
  { id: 'PropertiesPage', to: ROUTES.PROPERTIES_PAGE },
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
      .map(({ to, id, ...otherProps }) => (
        <NavLink
          key={to}
          to={to}
          className="loan-side-nav-link"
          {...otherProps}
        >
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
