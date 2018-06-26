import React from 'react';
import PropTypes from 'prop-types';
import { matchPath } from 'react-router-dom';

import classnames from 'classnames';

import LoanSelector from './LoanSelector';
import DrawerHeader from '../AppTopNav/DrawerHeader';
import LoanSideNav from './LoanSideNav';

const SideNavUser = ({ currentUser, style, fixed, toggleDrawer, history }) => {
  const { loans } = currentUser;
  // Return an empty side nav if there is no loan
  if (loans.length <= 0) {
    return (
      <nav className="side-nav-user hidden-xs">
        <DrawerHeader permanent />
      </nav>
    );
  }
  // FIXME: What follows is excessively complex for what it does,
  // However props.match.params.loanId does not get defined to easily pick
  // it up... wtf?

  // Get the pathname, remove the leading '/', and split by '/'
  const splittedUrl = history.location.pathname.substring(1).split('/');
  // If it has enough elements, parse the loanId
  const loanId =
    splittedUrl.length >= 2 && splittedUrl[0] === 'loans' ? splittedUrl[1] : '';
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
          currentUser={currentUser}
          value={loanId}
          toggleDrawer={toggleDrawer}
        />
        {loanId && <LoanSideNav loan={currentLoan} />}
      </div>
    </nav>
  );
};

SideNavUser.propTypes = {
  currentUser: PropTypes.object.isRequired,
  fixed: PropTypes.bool,
  history: PropTypes.object.isRequired,
  style: PropTypes.object,
  toggleDrawer: PropTypes.func,
};

SideNavUser.defaultProps = {
  fixed: false,
  style: {},
  toggleDrawer: () => {},
};

export default SideNavUser;
