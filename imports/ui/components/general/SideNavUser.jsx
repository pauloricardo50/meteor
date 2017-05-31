import React from 'react';
import PropTypes from 'prop-types';

import AssessmentIcon from 'material-ui/svg-icons/action/assessment';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';

import RequestSelector from './RequestSelector.jsx';
import SideNavStepper from './SideNavStepper.jsx';

const SideNavUser = props => {
  // Return an empty side nav if there is no loanRequest
  if (props.loanRequests.length <= 0) {
    return <nav className="side-nav-user hidden-xs" />;
  }

  // Get the pathname, remove the leading '/', and split by '/'
  const splittedUrl = props.location.pathname.substring(1).split('/');
  // If it has enough elements, parse the requestId
  const requestId = splittedUrl.length >= 3 && splittedUrl[1] === 'requests' ? splittedUrl[2] : '';
  let currentRequest;
  let borrowerIds;

  if (requestId) {
    currentRequest = props.loanRequests.find(r => r._id === requestId);
    borrowerIds = currentRequest.borrowers;
  }

  return (
    <nav
      className={classnames({ 'side-nav-user': true, 'joyride-side-nav fixed': props.fixed })}
      style={props.style}
    >
      <div className="scrollable">
        <RequestSelector {...props} currentValue={requestId} />
        <NavLink
          exact
          to={`/app/requests/${requestId}`}
          activeClassName="active-link"
          className="link"
        >
          <div className="onclick-wrapper" onTouchTap={props.handleClickLink}>
            <div className="icon"><AssessmentIcon color="#ADB5BD" /></div>
            <h5 className="title">Tableau de Bord</h5>
          </div>
        </NavLink>

        {requestId &&
          <SideNavStepper
            handleClickLink={props.handleClickLink}
            history={props.history}
            location={props.location}
            loanRequest={currentRequest}
            borrowers={props.borrowers.filter(b => borrowerIds.indexOf(b._id) > -1)}
          />}
      </div>
    </nav>
  );
};

SideNavUser.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.object),
  handleClickLink: PropTypes.func,
  fixed: PropTypes.bool,
};

SideNavUser.defaultProps = {
  loanRequests: [],
  handleClickLink: () => null,
  fixed: false,
};

export default SideNavUser;
