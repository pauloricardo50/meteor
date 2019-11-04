// @flow
import React, { useContext } from 'react';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import cx from 'classnames';
import { withRouter } from 'react-router-dom';

import TopNavlogo from 'core/components/TopNav/TopNavLogo';
import TopNavButtons from 'core/components/TopNav/TopNavButtons';
import IconButton from 'core/components/IconButton';
import useMedia from 'core/hooks/useMedia';
import { CurrentUserContext } from 'core/containers/CurrentUserContext';
import UserCreator from '../../components/UserCreator';

type AppTopNavProps = {};

const blacklist = ['/signup/', '/enroll-account/'];

const renderButtons = ({ location: { pathname, search } }) => {
  if (search && search.includes('property-id')) {
    // Don't render login/signup buttons if a proProperty is being
    // seen, as creating an account will make the user lose the
    // reference to that property
    const searchParams = new URLSearchParams(search);
    const propertyId = searchParams.get('property-id');

    if (propertyId) {
      return false;
    }
  }

  return blacklist.every(route => !pathname.startsWith(route));
};

const AppTopNav = ({
  toggleDrawer,
  shouldShowSideNav,
  history,
  children,
}: AppTopNavProps) => {
  const currentUser = useContext(CurrentUserContext);
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
            {!isMobile && !currentUser && (
              <UserCreator
                buttonProps={{
                  raised: true,
                  primary: true,
                  label: 'Créez votre compte',
                }}
              />
            )}
            <TopNavButtons>{children}</TopNavButtons>
          </div>
        )}
      </div>
    </Toolbar>
  );
};

export default withRouter(AppTopNav);
