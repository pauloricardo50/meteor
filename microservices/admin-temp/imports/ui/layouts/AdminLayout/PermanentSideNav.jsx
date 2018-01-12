import React from 'react';
import PropTypes from 'prop-types';

import Drawer from 'material-ui/Drawer';

import SideNav from 'core/components/SideNav';

const PermanentSideNav = ({ isApp, ...otherProps }) => (
  <Drawer type="permanent">
    <div style={{ width: isApp ? 300 : 250 }}>
      <SideNav {...otherProps} />
    </div>
  </Drawer>
);

PermanentSideNav.propTypes = {
  isApp: PropTypes.bool.isRequired,
};

export default PermanentSideNav;
