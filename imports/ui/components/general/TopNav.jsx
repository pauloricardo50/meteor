import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

import TopNavDropdown from '/imports/ui/components/general/TopNavDropdown.jsx';
import TopNavDrawer from '/imports/ui/components/general/TopNavDrawer.jsx';

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

const TopNav = props => (
  <div className="top-nav" style={{ zIndex: 20 }}>
    <AppBar
      style={!props.public ? styles.navbar : styles.publicNavbar}
      iconElementLeft={props.currentUser && !props.public ? <TopNavDrawer {...props} /> : undefined}
      iconStyleLeft={!props.currentUser || props.public ? { display: 'none' } : {}}
      iconElementRight={
        props.currentUser
          ? <TopNavDropdown {...props} />
          : <FlatButton
            label="Login"
            containerElement={<Link to="/login" />}
            secondary
            labelStyle={{ color: colors.primary }}
          />
      }
    >
      <Link to="/home" className="logo">
        <img src="/img/logo_black.svg" alt="e-Potek" style={styles.image} />
      </Link>
    </AppBar>
  </div>
);

TopNav.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any),
  public: PropTypes.bool,
};

TopNav.defaultProps = {
  currentUser: undefined,
  public: false,
};

export default TopNav;
