import React, { Component, PropTypes } from 'react';

import { FlowRouter } from 'meteor/kadira:flow-router';

import {
  BottomNavigation,
  BottomNavigationItem,
} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';

// Icons
import Home from 'material-ui/svg-icons/action/home';
import PieChart from 'material-ui/svg-icons/editor/pie-chart';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import CallSplit from 'material-ui/svg-icons/communication/call-split';

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
    const url = this.props.currentURL;

    if (url.substring(0, 9) === '/strategy') {
      currentIndex = 1;
    } else if (url.substring(0, 8) === '/finance') {
      currentIndex = 2;
    } else if (url.substring(0, 9) === '/settings') {
      currentIndex = 3;
    } else {
      currentIndex = 0;
    }

    return (
      <nav className="hidden-sm hidden-md hidden-lg" style={styles.nav}>
        <Paper zDepth={1}>
          <BottomNavigation selectedIndex={currentIndex}>
            <BottomNavigationItem
              label="Projet"
              icon={<Home />}
              onTouchTap={() => FlowRouter.go('/main')}
            />
            <BottomNavigationItem
              label="Stratégies"
              icon={<CallSplit />}
              onTouchTap={() => FlowRouter.go('/strategy')}
            />
            <BottomNavigationItem
              label="Finances"
              icon={<PieChart />}
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
