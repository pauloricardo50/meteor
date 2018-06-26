// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { withProps } from 'recompose';

import T from 'core/components/Translation';
import { createRoute } from 'core/utils/routerUtils';
import * as ROUTES from '../../../startup/client/appRoutes';

const links = [
  { id: 'dashboard', to: ROUTES.DASHBOARD_PAGE, exact: true },
  { id: 'files', to: ROUTES.FILES_PAGE },
  { id: 'closing', to: ROUTES.CLOSING_PAGE },
  { id: 'borrowers', to: ROUTES.BORROWERS_PAGE },
  { id: 'financing', to: ROUTES.FINANCING_PAGE },
  { id: 'properties', to: ROUTES.PROPERTIES_PAGE },
];

export const LoanSideNav = ({ loan, links }) => (
  <ul className="loan-side-nav">
    {links
      .map(link => ({
        ...link,
        to: createRoute(link.to, {
          ':loanId': loan._id,
          ':borrowerId': loan.borrowers[0]._id,
          ':propertyId': loan.property._id,
        }),
      }))
      .map(({ to, id, ...otherProps }) => (
        <NavLink
          key={to}
          to={to}
          className="loan-side-nav-link"
          {...otherProps}
        >
          <T id={`LoanSideNav.${id}`} />
        </NavLink>
      ))}
  </ul>
);

LoanSideNav.propTypes = {
  links: PropTypes.arrayOf(PropTypes.object).isRequired,
  loan: PropTypes.object.isRequired,
};

export default withProps({ links })(LoanSideNav);
