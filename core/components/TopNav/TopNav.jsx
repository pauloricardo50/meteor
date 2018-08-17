import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';

import TopNavLogo from './TopNavLogo';
import TopNavButtons from './TopNavButtons';

const TopNav = (props) => {
  const { appChildren } = props;

  return (
    // This overflowX hidden prevents any icon from having tooltips
    // It is required to prevent some weird homepage overflow bugs, where
    // additional white space is added to the right of the page
    <Toolbar className="top-nav" style={{ overflowX: 'hidden' }}>
      <div className="top-nav-content">
        {appChildren(props)}
        <TopNavLogo />
        <TopNavButtons {...props} />
      </div>
    </Toolbar>
  );
};

TopNav.propTypes = {
  appChildren: PropTypes.func,
  children: PropTypes.node,
};

TopNav.defaultProps = {
  appChildren: () => {},
  children: null,
};

export default TopNav;
