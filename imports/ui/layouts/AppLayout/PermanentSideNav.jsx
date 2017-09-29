import React from 'react';
import PropTypes from 'prop-types';

import Drawer from 'material-ui/Drawer';

import SideNavUser from '/imports/ui/components/general/SideNavUser';
import SideNav from '/imports/ui/components/general/SideNav';

const PermanentSideNav = props => (
  <Drawer type="permanent">
    <div style={{ width: props.isApp ? 300 : 250 }}>
      {props.isApp ? <SideNavUser {...props} fixed /> : <SideNav {...props} />}
    </div>
  </Drawer>
);

PermanentSideNav.propTypes = {
  isApp: PropTypes.bool.isRequired,
};

export default PermanentSideNav;
