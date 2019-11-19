import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import cx from 'classnames';

import TopNavLogo from './TopNavLogo';
import TopNavButtons from './TopNavButtons';

const TopNav = ({ className, rightChildren, children }) => (
  // This overflowX hidden prevents any icon from having tooltips
  // It is required to prevent some weird homepage overflow bugs, where
  // additional white space is added to the right of the page
  <Toolbar className={cx('top-nav', className)} style={{ overflowX: 'hidden' }}>
    <div className="top-nav-content">
      {rightChildren}
      <TopNavLogo />
      <TopNavButtons>{children}</TopNavButtons>
    </div>
  </Toolbar>
);

TopNav.propTypes = {
  appChildren: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
};

TopNav.defaultProps = {
  appChildren: () => {},
  children: null,
  className: '',
};

export default TopNav;
