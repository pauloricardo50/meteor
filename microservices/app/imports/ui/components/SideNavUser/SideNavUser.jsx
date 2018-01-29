import React from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';

import RequestSelector from './RequestSelector';
import DrawerHeader from '../AppTopNav/DrawerHeader';
import SideNavUserRequest from './SideNavUserRequest';

const SideNavUser = (props) => {
  const {
    loanRequests,
    location,
    style,
    handleClickLink,
    fixed,
    toggleDrawer,
    history,
    borrowers,
    properties,
  } = props;

  // Return an empty side nav if there is no loanRequest
  if (loanRequests.length <= 0) {
    return (
      <nav className="side-nav-user hidden-xs">
        <DrawerHeader permanent />
      </nav>
    );
  }

  // FIXME: What follows is excessively complex for what it does,
  // However props.match.params.requestId does not get defined to easily pick
  // it up... wtf?

  // Get the pathname, remove the leading '/', and split by '/'
  const splittedUrl = location.pathname.substring(1).split('/');
  // If it has enough elements, parse the requestId
  const requestId =
    splittedUrl.length >= 2 && splittedUrl[0] === 'requests'
      ? splittedUrl[1]
      : '';
  let currentRequest;
  let borrowerIds;

  if (requestId) {
    currentRequest = loanRequests.find(r => r._id === requestId);
    borrowerIds = currentRequest.borrowers;
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
        <RequestSelector
          {...props}
          value={requestId}
          toggleDrawer={toggleDrawer}
        />
        {requestId && (
          <SideNavUserRequest
            {...props}
            loanRequest={currentRequest}
            borrowers={borrowers.filter(b => borrowerIds.indexOf(b._id) > -1)}
            property={properties.find(p => p._id === currentRequest.property)}
          />
        )}
      </div>
    </nav>
  );
};

SideNavUser.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.object),
  handleClickLink: PropTypes.func,
  fixed: PropTypes.bool,
  toggleDrawer: PropTypes.func,
};

SideNavUser.defaultProps = {
  loanRequests: [],
  handleClickLink: () => null,
  fixed: false,
  toggleDrawer: () => {},
};

export default SideNavUser;
