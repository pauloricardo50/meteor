import React from 'react';
import PropTypes from 'prop-types';

import Drawer from 'material-ui/Drawer';

import SideNavUser from '/imports/ui/components/general/SideNavUser';
import SideNav from '/imports/ui/components/general/SideNav';

const PermanentSideNav = ({ isApp, ...otherProps }) => (
  <Drawer type="permanent">
    <div style={{ width: isApp ? 300 : 250 }}>
      {isApp ? (
        <SideNavUser {...otherProps} fixed />
      ) : (
        <SideNav {...otherProps} />
      )}
    </div>
  </Drawer>
);

PermanentSideNav.propTypes = {
  isApp: PropTypes.bool.isRequired,
};

export default PermanentSideNav;
