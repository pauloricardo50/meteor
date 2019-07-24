// @flow
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import cx from 'classnames';
import { withRouter } from 'react-router-dom';

import TopNavlogo from 'core/components/TopNav/TopNavLogo';
import TopNavButtons from 'core/components/TopNav/TopNavButtons';
import IconButton from 'core/components/IconButton';
import useMedia from 'core/hooks/useMedia';
import UserCreator from '../../components/UserCreator';

type AppTopNavProps = {};

const blacklist = ['/signup/', '/enroll-account/'];

const renderButtons = ({ location: { pathname } }) =>
  blacklist.every(route => !pathname.startsWith(route));

const AppTopNav = ({
  toggleDrawer,
  shouldShowSideNav,
  history,
  ...props
}: AppTopNavProps) => {
  const isMobile = useMedia({ maxWidth: 768 });

  return (
    <Toolbar className="top-nav">
      <div className={cx('top-nav-content', { mobile: isMobile })}>
        {shouldShowSideNav && isMobile && (
          <IconButton onClick={toggleDrawer} type="menu" />
        )}

        <TopNavlogo />

        {renderButtons(history) && (
          <div className="flex space-children">
            {!isMobile && !props.currentUser && (
              <UserCreator
                buttonProps={{
                  raised: true,
                  primary: true,
                  label: 'Créez votre compte',
                }}
              />
            )}
            <TopNavButtons {...props} />
          </div>
        )}
      </div>
    </Toolbar>
  );
};

export default withRouter(AppTopNav);
