import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import DropdownMenu from 'core/components/DropdownMenu';

const styles = {
  icon: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
};

const DashboardMenu = ({ menuActions }) => (
  <DropdownMenu
    style={styles.icon}
    iconType="more"
    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
    options={menuActions.map(a => ({
      ...a,
      onClick: a.handleClick,
      link: !!a.link,
      to: a.link,
      label: <T id={`DashboardMenu.${a.id}`} />,
    }))}
  />
);

DashboardMenu.propTypes = {
  menuActions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default DashboardMenu;
