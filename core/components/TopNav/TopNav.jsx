import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';

import Toolbar from '@material-ui/core/Toolbar/Toolbar';

import track from '../../utils/analytics';

import Button from '../Button';
import { ImpersonateWarningWithTracker } from '../Impersonate/ImpersonateWarning';
import T from '../Translation';
import TopNavDropdown from './TopNavDropdown';
// import TopNavDrawer from './TopNavDrawer';

const TopNav = (props) => {
  const {
    history,
    currentUser,
    loans,
    appChildren,
    public: isPublic,
    children,
  } = props;
  const isApp = history && history.location.pathname.slice(0, 4) === '/';

  const showDrawer = isApp && loans.length > 0;

  return (
    // This overflowX hidden prevents any icon from having tooltips
    // It is required to prevent some weird homepage overflow bugs, where
    // additional white space is added to the right of the page
    <Toolbar className="top-nav" style={{ overflowX: 'hidden' }}>
      <div className="top-nav-content">
        {appChildren(props)}
        {/* {showDrawer ? <TopNavDrawer {...props} /> : null} */}

        <div className="logo">
          <Link
            to={isPublic ? '/home' : '/'}
            className="link"
            onClick={() => track('TopNav - clicked logo', {})}
          >
            <img
              src="/img/logo_square_black.svg"
              alt="e-Potek"
              className="logo-home"
            />
          </Link>
        </div>

        <div className="buttons">
          <ImpersonateWarningWithTracker />
          {children}
          {currentUser ? (
            <React.Fragment>
              {currentUser.email}
              <TopNavDropdown {...props} />
            </React.Fragment>
          ) : (
            <Button
              label={<T id="TopNav.login" />}
              primary
              onClick={() => {
                track('TopNav - clicked login', {});
                window.location.replace(`${Meteor.settings.public.subdomains.app}/login`);
              }}
            />
          )}
        </div>
      </div>
    </Toolbar>
  );
};

TopNav.propTypes = {
  appChildren: PropTypes.func,
  children: PropTypes.node,
  currentUser: PropTypes.objectOf(PropTypes.any),
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  loans: PropTypes.arrayOf(PropTypes.object),
  public: PropTypes.bool,
};

TopNav.defaultProps = {
  currentUser: undefined,
  loans: [],
  public: false,
  appChildren: () => {},
  children: null,
};

export default TopNav;
