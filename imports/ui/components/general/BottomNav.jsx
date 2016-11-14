import React, { Component, PropTypes } from 'react';

import { FlowRouter } from 'meteor/kadira:flow-router';

import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';

// Icons
import Home from 'material-ui/svg-icons/action/home';
import AttachMoney from 'material-ui/svg-icons/editor/attach-money';
import ActionSettings from 'material-ui/svg-icons/action/settings';


const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
  },
};

export default class BottomNav extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    let currentIndex;
    switch (this.props.currentURL) {
      case '/finance': currentIndex = 1; break;
      case '/settings': currentIndex = 2; break;
      default: currentIndex = 0;
    }

    return (
      <nav className="hidden-sm hidden-md hidden-lg" style={styles.nav}>
        <Paper zDepth={1}>
          <BottomNavigation selectedIndex={currentIndex}>
            <BottomNavigationItem
              label="Mon Projet"
              icon={<Home />}
              onTouchTap={() => FlowRouter.go('/main')}
            />
            <BottomNavigationItem
              label="Mon Financement"
              icon={<AttachMoney />}
              onTouchTap={() => FlowRouter.go('/finance')}
            />
            <BottomNavigationItem
              label="Réglages"
              icon={<ActionSettings />}
              onTouchTap={() => FlowRouter.go('/settings')}
            />
          </BottomNavigation>
        </Paper>
      </nav>
    );
  }
}


BottomNav.propTypes = {
  currentURL: PropTypes.string,
};
