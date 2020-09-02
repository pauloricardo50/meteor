import React from 'react';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import cx from 'classnames';
import { withRouter } from 'react-router-dom';
import useWindowScroll from 'react-use/lib/useWindowScroll';

import { CTA_ID } from 'core/api/analytics/analyticsConstants';
import IconButton from 'core/components/IconButton';
import TopNavButtons from 'core/components/TopNav/TopNavButtons';
import TopNavlogo from 'core/components/TopNav/TopNavLogo';
import useCurrentUser from 'core/hooks/useCurrentUser';
import useMedia from 'core/hooks/useMedia';

import UserCreator from '../../components/UserCreator';

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

const AppTopNav = ({ toggleDrawer, shouldShowSideNav, history, children }) => {
  const currentUser = useCurrentUser();
  const isMobile = useMedia({ maxWidth: 768 });
  const { y } = useWindowScroll();

  return (
    <Toolbar className={cx('top-nav', { scrolling: y > 0 })}>
      <div className={cx('top-nav-content', { mobile: isMobile })}>
        {shouldShowSideNav && isMobile && (
          <IconButton onClick={toggleDrawer} type="menu" />
        )}

        {/* Put an empty div here for flex-alignment on desktop */}
        {isMobile ? <TopNavlogo /> : <div />}

        {renderButtons(history) && (
          <div className="flex">
            {!isMobile && !currentUser && (
              <UserCreator
                buttonProps={{
                  raised: true,
                  primary: true,
                  label: 'Créez votre compte',
                  className: 'mr-8',
                  ctaId: CTA_ID.ACCOUNT_CREATION_NAVBAR,
                }}
                ctaId={CTA_ID.ACCOUNT_CREATION_NAVBAR}
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
