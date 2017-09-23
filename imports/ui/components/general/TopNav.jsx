import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import Button from '/imports/ui/components/general/Button';
import Toolbar from 'material-ui/Toolbar/Toolbar';

// import TopNavDropdown from '/imports/ui/components/general/TopNavDropdown';
// import TopNavDrawer from '/imports/ui/components/general/TopNavDrawer';
import { T } from '/imports/ui/components/general/Translation';
import track from '/imports/js/helpers/analytics';
import SearchModal from '/imports/ui/components/general/SearchModal';

import colors from '/imports/js/config/colors';

const TopNav = (props) => {
  const { history, currentUser, loanRequests } = props;
  const isApp = history && history.location.pathname.slice(0, 4) === '/app';

  const showDrawer = isApp && loanRequests.length > 0;

  return (
    <Toolbar className="top-nav">
      <div className="top-nav-content">
        {/* {showDrawer ? <TopNavDrawer {...props} /> : null} */}

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
          {currentUser ? null : ( // <TopNavDropdown {...props} />
            <Button
              label={<T id="TopNav.login" />}
              component={Link}
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
