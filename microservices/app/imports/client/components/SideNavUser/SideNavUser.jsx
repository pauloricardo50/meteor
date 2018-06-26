import React from 'react';
import PropTypes from 'prop-types';
import { matchPath } from 'react-router-dom';

import classnames from 'classnames';

import LoanSelector from './LoanSelector';
import DrawerHeader from '../AppTopNav/DrawerHeader';
import LoanSideNav from './LoanSideNav';

const SideNavUser = ({ loans, style, fixed, toggleDrawer, history }) => {
  // Return an empty side nav if there is no loan
  if (loans.length <= 0) {
    return (
      <nav className="side-nav-user hidden-xs">
        <DrawerHeader permanent />
      </nav>
    );
  }

  const {
    params: { loanId },
  } = matchPath(history.location.pathname, {
    path: '/loans/:loanId',
    exact: false,
    strict: false,
  });

  let currentLoan;

  if (loanId) {
    currentLoan = loans.find(r => r._id === loanId);
  }

  return (
    <nav
      className={classnames({
        'side-nav-user': true,
        'joyride-side-nav fixed': fixed,
      })}
      style={style}
    >
      <DrawerHeader permanent />
      <div className="scrollable">
        <LoanSelector
          history={history}
          loans={loans}
          value={loanId}
          toggleDrawer={toggleDrawer}
        />
        {loanId && <LoanSideNav loan={currentLoan} />}
      </div>
    </nav>
  );
};

SideNavUser.propTypes = {
  fixed: PropTypes.bool,
  history: PropTypes.object.isRequired,
  loans: PropTypes.arrayOf(PropTypes.object),
  style: PropTypes.object,
  toggleDrawer: PropTypes.func,
};

SideNavUser.defaultProps = {
  loans: [],
  fixed: false,
  style: {},
  toggleDrawer: () => {},
};

export default SideNavUser;
