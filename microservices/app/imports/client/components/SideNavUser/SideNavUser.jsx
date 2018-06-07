import React from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';

import LoanSelector from './LoanSelector';
import DrawerHeader from '../AppTopNav/DrawerHeader';
import SideNavUserLoan from './SideNavUserLoan';

const SideNavUser = (props) => {
  const {
    loans,
    location,
    style,
    handleClickLink,
    fixed,
    toggleDrawer,
    history,
    borrowers,
    properties,
  } = props;

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
  const splittedUrl = location.pathname.substring(1).split('/');
  // If it has enough elements, parse the loanId
  const loanId =
    splittedUrl.length >= 2 && splittedUrl[0] === 'loans' ? splittedUrl[1] : '';
  let currentLoan;
  let borrowerIds;

  if (loanId) {
    currentLoan = loans.find(r => r._id === loanId);
    borrowerIds = currentLoan.borrowerIds;
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
        <LoanSelector {...props} value={loanId} toggleDrawer={toggleDrawer} />
        {loanId && (
          <SideNavUserLoan
            {...props}
            loan={currentLoan}
            borrowers={borrowers.filter(b => borrowerIds.indexOf(b._id) > -1)}
            property={properties.find(p => p._id === currentLoan.propertyId)}
          />
        )}
      </div>
    </nav>
  );
};

SideNavUser.propTypes = {
  loans: PropTypes.arrayOf(PropTypes.object),
  handleClickLink: PropTypes.func,
  fixed: PropTypes.bool,
  toggleDrawer: PropTypes.func,
};

SideNavUser.defaultProps = {
  loans: [],
  handleClickLink: () => null,
  fixed: false,
  toggleDrawer: () => {},
};

export default SideNavUser;
