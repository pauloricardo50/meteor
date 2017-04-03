import React, { Component, PropTypes } from 'react';

import {
  BottomNavigation,
  BottomNavigationItem,
} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';

// Icons
import Home from 'material-ui/svg-icons/action/home';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import Phone from 'material-ui/svg-icons/communication/contact-phone';

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    zIndex: 2,
  },
};

const BottomNav = props => {
  let currentIndex = -1;
  const url = props.location.pathname;

  if (url.substring(0, 12) === '/app/profile') {
    currentIndex = 1;
  } else if (url.substring(0, 12) === '/app/contact') {
    currentIndex = 2;
  } else if (url.substring(0, 4) === '/app') {
    currentIndex = 0;
  }

  return (
    <nav className="hidden-sm hidden-md hidden-lg" style={styles.nav}>
      <Paper zDepth={1}>
        <BottomNavigation selectedIndex={currentIndex}>
          <BottomNavigationItem
            label="Dashboard"
            icon={<Home />}
            onTouchTap={() => props.history.push('/app')}
          />
          <BottomNavigationItem
            label="Profil"
            icon={<AccountCircle />}
            onTouchTap={() => props.history.push('/app/profile')}
          />
          <BottomNavigationItem
            label="Contact"
            icon={<Phone />}
            onTouchTap={() => props.history.push('/app/contact')}
          />
        </BottomNavigation>
      </Paper>
    </nav>
  );
};

export default BottomNav;
