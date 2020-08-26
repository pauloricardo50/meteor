import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import BlueTheme from 'core/components/Themes/BlueTheme';
import useCurrentUser from 'core/hooks/useCurrentUser';

import LoanSelector from './LoanSelector';
import LoanSideNav from './LoanSideNav';
import SideNavHeader from './SideNavHeader';

const SideNavUser = ({ style, fixed, closeDrawer, loan }) => {
  const history = useHistory();
  const currentUser = useCurrentUser();

  const emptySideNav = (
    <nav className="side-nav-user">
      <SideNavHeader />
    </nav>
  );

  // Return an empty side nav if there is no loan
  if (!currentUser) {
    return emptySideNav;
  }
  const { loans } = currentUser;

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

  if (currentLoan && !currentLoan.hasCompletedOnboarding) {
    // This avoids a race condition, where the user has not yet been redirected
    // to the onboarding page, so it briefly shows the full side nav, which is bad
    return emptySideNav;
  }

  return (
    <BlueTheme>
      <nav
        className={classnames({ 'side-nav-user': true, fixed })}
        style={style}
      >
        <SideNavHeader closeDrawer={closeDrawer} />
        <div className="scrollable">
          {!!(loans && loans.length > 0) && (
            <LoanSelector
              history={history}
              currentUser={currentUser}
              value={loanId}
              closeDrawer={closeDrawer}
            />
          )}
          {/* Don't show the full side nav if onboarding still needs to be done */}
          {loanId && currentLoan && (
            <LoanSideNav closeDrawer={closeDrawer} loan={loan} />
          )}
        </div>
      </nav>
    </BlueTheme>
  );
};

SideNavUser.propTypes = {
  closeDrawer: PropTypes.func.isRequired,
  fixed: PropTypes.bool,
  style: PropTypes.object,
};

SideNavUser.defaultProps = {
  fixed: false,
  style: {},
};

export default SideNavUser;
