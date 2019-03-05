import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';

import LoanSelector from './LoanSelector';
import SideNavHeader from './SideNavHeader';
import LoanSideNav from './LoanSideNav';

const SideNavUser = ({
  currentUser,
  style,
  fixed,
  closeDrawer,
  history,
  loan,
}) => {
  // Return an empty side nav if there is no loan
  if (!currentUser) {
    return (
      <nav className="side-nav-user">
        <SideNavHeader />
      </nav>
    );
  }
  const { loans } = currentUser;

  // FIXME: What follows is excessively complex for what it does,
  // However props.match.params.loanId does not get defined to easily pick
  // it up... wtf?

  // Get the pathname, remove the leading '/', and split by '/'
  const splittedUrl = history.location.pathname.substring(1).split('/');
  // If it has enough elements, parse the loanId
  const loanId = splittedUrl.length >= 2 && splittedUrl[0] === 'loans' ? splittedUrl[1] : '';
  let currentLoan;

  if (loanId) {
    currentLoan = loans.find(r => r._id === loanId);
  }

  return (
    <nav className={classnames({ 'side-nav-user': true, fixed })} style={style}>
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
        {loanId && currentLoan && (
          <LoanSideNav closeDrawer={closeDrawer} loan={loan} />
        )}
      </div>
    </nav>
  );
};

SideNavUser.propTypes = {
  closeDrawer: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  fixed: PropTypes.bool,
  history: PropTypes.object.isRequired,
  style: PropTypes.object,
};

SideNavUser.defaultProps = {
  fixed: false,
  style: {},
};

export default withRouter(SideNavUser);
