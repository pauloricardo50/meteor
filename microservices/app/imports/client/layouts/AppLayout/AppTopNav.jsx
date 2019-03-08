// @flow
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import cx from 'classnames';

import TopNavlogo from 'core/components/TopNav/TopNavLogo';
import TopNavButtons from 'core/components/TopNav/TopNavButtons';
import IconButton from 'core/components/IconButton';
import useMedia from 'core/hooks/useMedia';

type AppTopNavProps = {};

const AppTopNav = ({ toggleDrawer, ...props }: AppTopNavProps) => {
  const isMobile = useMedia({ maxWidth: 768 });

  return (
    <Toolbar className="top-nav">
      <div className={cx('top-nav-content', { mobile: isMobile })}>
        {isMobile && <IconButton onClick={toggleDrawer} type="menu" />}
        <TopNavlogo />
        <TopNavButtons {...props} />
      </div>
    </Toolbar>
  );
};

export default AppTopNav;
