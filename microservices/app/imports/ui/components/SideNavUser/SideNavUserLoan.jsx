import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, NavLink } from 'react-router-dom';

import { T } from 'core/components/Translation';
import Icon from 'core/components/Icon';
import { REQUEST_STATUS } from 'core/api/constants';
import SideNavStepper from './SideNavStepper';

const SideNavUserLoan = (props) => {
  const {
    loan,
    location,
    style,
    handleClickLink,
    fixed,
    toggleDrawer,
    history,
    borrowers,
    property,
  } = props;

  return (
    <div style={{ width: '100%' }}>
      <NavLink
        exact
        to={`/loans/${loan._id}`}
        activeClassName="active-link"
        className="link"
      >
        <div className="onclick-wrapper" onClick={handleClickLink}>
          <div className="icon">
            <Icon type="dashboard" style={{ color: '#ADB5BD' }} />
          </div>
          <h4 className="fixed-size title">
            <T id="SideNavUser.dashboard" />
          </h4>
        </div>
      </NavLink>
      <NavLink
        exact
        to={`/loans/${loan._id}/files`}
        activeClassName="active-link"
        className="link"
      >
        <div className="onclick-wrapper" onClick={handleClickLink}>
          <div className="icon">
            <Icon type="folder" style={{ color: '#ADB5BD' }} />
          </div>
          <h4 className="fixed-size title">
            <T id="SideNavUser.files" />
          </h4>
        </div>
      </NavLink>
      {loan.status === REQUEST_STATUS.ACTIVE && (
        <SideNavStepper
          handleClickLink={handleClickLink}
          history={history}
          location={location}
          loan={loan}
          borrowers={borrowers}
          property={property}
        />
      )}
    </div>
  );
};

SideNavUserLoan.propTypes = {};

export default SideNavUserLoan;
