import React, { Component } from 'react';

import { FlowRouter } from 'meteor/kadira:flow-router';

import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';

import Home from 'material-ui/svg-icons/action/home';
import AttachMoney from 'material-ui/svg-icons/editor/attach-money';
import Person from 'material-ui/svg-icons/social/person';


const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
  },
};

/**
 * A simple example of `BottomNavigation`, with three labels and icons
 * provided. The selected `BottomNavigationItem` is determined by application
 * state (for instance, by the URL).
 */
class BottomNavigationExampleSimple extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
    };
  }


  select(index) {
    this.setState({ selectedIndex: index });

    switch (index) {
      case 0: FlowRouter.go('/main'); break;
      case 1: FlowRouter.go('/finance'); break;
      case 2: FlowRouter.go('/profile'); break;
      default: break;
    }
  }

  render() {
    return (
      <nav className="hidden-sm hidden-md hidden-lg" style={styles.nav}>
        <Paper zDepth={1}>
          <BottomNavigation selectedIndex={this.state.selectedIndex}>
            <BottomNavigationItem
              label="Mon Projet"
              icon={<Home />}
              onTouchTap={() => this.select(0)}
            />
            <BottomNavigationItem
              label="Mon Financement"
              icon={<AttachMoney />}
              onTouchTap={() => this.select(1)}
            />
            <BottomNavigationItem
              label="Mon Profil"
              icon={<Person />}
              onTouchTap={() => this.select(2)}
            />
          </BottomNavigation>
        </Paper>
      </nav>
    );
  }
}

export default BottomNavigationExampleSimple;
