// @flow
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import cx from 'classnames';

import TopNavlogo from 'core/components/TopNav/TopNavLogo';
import TopNavButtons from 'core/components/TopNav/TopNavButtons';
import IconButton from 'core/components/IconButton';
import useMedia from 'core/hooks/useMedia';
import { LOCAL_STORAGE_ANONYMOUS_LOAN } from 'core/api/loans/loanConstants';
import UserCreator from '../../components/UserCreator';

type AppTopNavProps = {};

const AppTopNav = ({
  toggleDrawer,
  shouldShowSideNav,
  ...props
}: AppTopNavProps) => {
  const isMobile = useMedia({ maxWidth: 768 });
  const anonymousLoanId = localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN);

  return (
    <Toolbar className="top-nav">
      <div className={cx('top-nav-content', { mobile: isMobile })}>
        {shouldShowSideNav && isMobile && (
          <IconButton onClick={toggleDrawer} type="menu" />
        )}
        <TopNavlogo />
        <div className="flex space-children">
          {!isMobile && !props.currentUser && (
            <UserCreator
              buttonProps={{
                raised: true,
                secondary: true,
                label: 'Créez votre compte',
              }}
            />
          )}
          <TopNavButtons {...props} />
        </div>
      </div>
    </Toolbar>
  );
};

export default AppTopNav;
