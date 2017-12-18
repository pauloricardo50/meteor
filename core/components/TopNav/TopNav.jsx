import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import Toolbar from 'material-ui/Toolbar/Toolbar';

import track from '../../utils/analytics';

import Button from 'core/components/Button';
import SearchModal from '../SearchModal';
import { T } from '../Translation';
import TopNavDropdown from './TopNavDropdown';
import TopNavDrawer from './TopNavDrawer';

const TopNav = props => {
  const { history, currentUser, loanRequests } = props;
  const isApp = history && history.location.pathname.slice(0, 4) === '/app';

  const showDrawer = isApp && loanRequests.length > 0;

  return (
    // This overflowX hidden prevents any icon from having tooltips
    // It is required to prevent some weird homepage overflow bugs, where
    // additional white space is added to the right of the page
    <Toolbar className="top-nav" style={{ overflowX: 'hidden' }}>
      <div className="top-nav-content">
        {showDrawer ? <TopNavDrawer {...props} /> : null}

        <div className="logo">
          <Link
            to="/home"
            className="link"
            onClick={() => track('TopNav - clicked logo', {})}
          >
            <img src="/img/logo_black.svg" alt="e-Potek" />
          </Link>
        </div>

        <div className="buttons">
          <SearchModal />
          {currentUser ? (
            <TopNavDropdown {...props} />
          ) : (
            <Button
              label={<T id="TopNav.login" />}
              link
              to="/login"
              primary
              dense
              onClick={() => track('TopNav - clicked login', {})}
            />
          )}
        </div>
      </div>
    </Toolbar>
  );
};

TopNav.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any),
  loanRequests: PropTypes.arrayOf(PropTypes.object),
  public: PropTypes.bool,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

TopNav.defaultProps = {
  currentUser: undefined,
  loanRequests: [],
  public: false,
};

export default TopNav;
