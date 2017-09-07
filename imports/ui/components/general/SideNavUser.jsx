import React from 'react';
import PropTypes from 'prop-types';

import AssessmentIcon from 'material-ui/svg-icons/action/assessment';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';

import { T } from '/imports/ui/components/general/Translation';
import RequestSelector from './RequestSelector';
import SideNavStepper from './SideNavStepper';

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
  } = props;

  // Return an empty side nav if there is no loanRequest
  if (loanRequests.length <= 0) {
    return <nav className="side-nav-user hidden-xs" />;
  }

  // Get the pathname, remove the leading '/', and split by '/'
  const splittedUrl = location.pathname.substring(1).split('/');
  // If it has enough elements, parse the requestId
  const requestId =
    splittedUrl.length >= 3 && splittedUrl[1] === 'requests'
      ? splittedUrl[2]
      : '';
  let currentRequest;
  let borrowerIds;

  if (requestId) {
    currentRequest = props.loanRequests.find(r => r._id === requestId);
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
      <div className="scrollable">
        <RequestSelector
          {...props}
          currentValue={requestId}
          toggleDrawer={toggleDrawer}
        />
        {requestId &&
          <NavLink
            exact
            to={`/app/requests/${requestId}`}
            activeClassName="active-link"
            className="link"
          >
            <div className="onclick-wrapper" onClick={handleClickLink}>
              <div className="icon">
                <AssessmentIcon color="#ADB5BD" />
              </div>
              <h4 className="fixed-size title">
                <T id="SideNavUser.dashboard" />
              </h4>
            </div>
          </NavLink>}

        {requestId &&
          currentRequest.status === 'active' &&
          <SideNavStepper
            handleClickLink={handleClickLink}
            history={history}
            location={location}
            loanRequest={currentRequest}
            borrowers={borrowers.filter(b => borrowerIds.indexOf(b._id) > -1)}
          />}
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
