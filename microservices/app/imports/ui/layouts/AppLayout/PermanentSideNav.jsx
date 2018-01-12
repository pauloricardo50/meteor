import React from 'react';
import PropTypes from 'prop-types';

import Drawer from 'material-ui/Drawer';

import SideNavUser from '/imports/ui/components/SideNavUser';

const PermanentSideNav = ({ isApp, ...otherProps }) => (
  <Drawer type="permanent">
    <div style={{ width: isApp ? 300 : 250 }}>
      <SideNavUser {...otherProps} fixed />
    </div>
  </Drawer>
);

PermanentSideNav.propTypes = {
  isApp: PropTypes.bool.isRequired,
};

export default PermanentSideNav;
