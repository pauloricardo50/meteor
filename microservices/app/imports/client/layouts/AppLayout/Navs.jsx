import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AppTopNav from './AppTopNav';
import PermanentSideNav from './PermanentSideNav';

export default class Navs extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  handleToggle = nextState =>
    typeof nextState === 'boolean'
      ? this.setState({ open: nextState })
      : this.setState(prev => ({ open: !prev.open }));

  render() {
    const { open } = this.state;
    const { shouldShowSideNav, currentUser } = this.props;

    return (
      <div className="navs">
        <AppTopNav
          shouldShowSideNav={shouldShowSideNav}
          currentUser={currentUser}
          toggleDrawer={this.handleToggle}
        />

        <div className="permanent-side-nav">
          {shouldShowSideNav && (
            <PermanentSideNav
              open={open}
              closeDrawer={() => this.handleToggle(false)}
              {...this.props}
            />
          )}
        </div>
      </div>
    );
  }
}

Navs.propTypes = {
  shouldShowSideNav: PropTypes.bool.isRequired,
};
