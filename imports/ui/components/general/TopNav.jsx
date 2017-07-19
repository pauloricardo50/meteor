import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import AppBar from 'material-ui/AppBar';
import Button from '/imports/ui/components/general/Button.jsx';

import TopNavDropdown from '/imports/ui/components/general/TopNavDropdown.jsx';
import TopNavDrawer from '/imports/ui/components/general/TopNavDrawer.jsx';
import { T } from '/imports/ui/components/general/Translation.jsx';
import track from '/imports/js/helpers/analytics';

import colors from '/imports/js/config/colors';

const styles = {
  navbar: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    color: '#000000',
    borderBottom: '1px solid #d8d8d8',
    boxShadow: 'unset',
  },
  publicNavbar: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#000000',
    boxShadow: '0px 2px 40px 0px rgba(0,0,0,0.08)',
  },
  button: {
    color: '#000000',
  },
};

const TopNav = props => {
  const isApp =
    props.history && props.history.location.pathname.slice(0, 4) === '/app';

  return (
    <div className="top-nav" style={{ zIndex: 20 }}>
      <AppBar
        style={!props.public ? styles.navbar : styles.publicNavbar}
        iconElementLeft={isApp ? <TopNavDrawer {...props} /> : undefined}
        iconStyleLeft={!isApp ? { display: 'none' } : {}}
        iconElementRight={
          props.currentUser
            ? <TopNavDropdown {...props} />
            : <Button
                label={<T id="TopNav.login" />}
                containerElement={<Link to="/login" />}
                secondary
                labelStyle={{ color: colors.primary }}
                onTouchTap={() => track('TopNav - clicked login', {})}
              />
        }
      >
        <div className="logo">
          <Link
            to="/home"
            className="link"
            onTouchTap={() => track('TopNav - clicked logo', {})}
          >
            <img src="/img/logo_black.svg" alt="e-Potek" style={styles.image} />
          </Link>
        </div>
      </AppBar>
    </div>
  );
};

TopNav.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any),
  public: PropTypes.bool,
};

TopNav.defaultProps = {
  currentUser: undefined,
  public: false,
};

export default TopNav;
