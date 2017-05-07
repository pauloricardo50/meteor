import React from 'react';
import PropTypes from 'prop-types';

import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import { NavLink } from 'react-router-dom';

import RequestSelector from './RequestSelector.jsx';
import SideNavStepper from './SideNavStepper.jsx';

const SideNavUser = props => {
  // Return an empty side nav if there is no loanRequest
  if (props.loanRequests.length <= 0) {
    return <nav className="side-nav-user hidden-xs" />;
  }

  // Get the pathname, remove the first leading '/', and split by '/'
  const splittedUrl = props.location.pathname.substring(1).split('/');
  // If it has enough elements, parse the requestId
  const requestId = splittedUrl.length >= 3 && splittedUrl[1] === 'requests' ? splittedUrl[2] : '';
  const currentRequest = props.loanRequests.find(r => r._id === requestId);
  const borrowerIds = currentRequest.borrowers;

  return (
    <nav className="side-nav-user hidden-xs">
      <RequestSelector {...props} currentValue={requestId} />
      <NavLink
        exact
        to={`/app/requests/${requestId}`}
        activeClassName="active-link"
        className="link"
      >
        <div className="icon"><DashboardIcon /></div>
        <h5>Tableau de Bord</h5>
      </NavLink>

      {requestId &&
        <SideNavStepper
          history={props.history}
          loanRequest={currentRequest}
          borrowers={props.borrowers.filter(b => borrowerIds.indexOf(b._id) > -1)}
        />}
    </nav>
  );
};

SideNavUser.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.object),
};

SideNavUser.defaultProps = {
  loanRequests: [],
};

export default SideNavUser;
