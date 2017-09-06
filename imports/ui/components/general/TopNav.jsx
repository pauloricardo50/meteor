import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import AppBar from 'material-ui/AppBar';
import Button from '/imports/ui/components/general/Button.jsx';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import ToolbarGroup from 'material-ui/Toolbar/ToolbarGroup';
import ToolbarSeparator from 'material-ui/Toolbar/ToolbarSeparator';
import ToolbarTitle from 'material-ui/Toolbar/ToolbarTitle';

import TopNavDropdown from '/imports/ui/components/general/TopNavDropdown.jsx';
import TopNavDrawer from '/imports/ui/components/general/TopNavDrawer.jsx';
import { T } from '/imports/ui/components/general/Translation.jsx';
import track from '/imports/js/helpers/analytics';
import SearchModal from '/imports/ui/components/general/SearchModal.jsx';

import colors from '/imports/js/config/colors';

const TopNav = (props) => {
  const { history, currentUser, loanRequests } = props;
  const isApp = history && history.location.pathname.slice(0, 4) === '/app';

  const showDrawer = isApp && loanRequests.length > 0;

  return (
    <Toolbar className="top-nav">
      <ToolbarGroup firstChild className="top-nav-content">
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
          {currentUser
            ? <TopNavDropdown {...props} />
            : <Button
              label={<T id="TopNav.login" />}
              containerElement={<Link to="/login" />}
              secondary
              labelStyle={{
                color: colors.primary,
                paddingLeft: 4,
                paddingRight: 4,
              }}
              style={{ minWidth: 'unset' }}
              // buttonStyle={{ minWidth: 'unset' }}
              onClick={() => track('TopNav - clicked login', {})}
            />}
        </div>
      </ToolbarGroup>
    </Toolbar>
    // </div>
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
