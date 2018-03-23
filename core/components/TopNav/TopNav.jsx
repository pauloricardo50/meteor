import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';

import Toolbar from 'material-ui/Toolbar/Toolbar';

import track from '../../utils/analytics';

import Button from '../Button';
import {
  ImpersonateWarningWithTracker,
} from '../Impersonate/ImpersonateWarning';
import SearchModal from '../SearchModal';
import { T } from '../Translation';
import TopNavDropdown from './TopNavDropdown';
// import TopNavDrawer from './TopNavDrawer';

const TopNav = (props) => {
  const { history, currentUser, loans, appChildren, public: isPublic } = props;
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
            <img src="/img/logo_black.svg" alt="e-Potek" />
          </Link>
        </div>

        <div className="buttons">
          <ImpersonateWarningWithTracker />
          <SearchModal />
          {currentUser ? (
            <TopNavDropdown {...props} />
          ) : (
            <Button
              label={<T id="TopNav.login" />}
              primary
              dense
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
  currentUser: PropTypes.objectOf(PropTypes.any),
  loans: PropTypes.arrayOf(PropTypes.object),
  public: PropTypes.bool,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  appChildren: PropTypes.func,
};

TopNav.defaultProps = {
  currentUser: undefined,
  loans: [],
  public: false,
  appChildren: () => {},
};

export default TopNav;
