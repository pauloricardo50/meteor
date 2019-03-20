import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AppTopNav from './AppTopNav';
// import SearchModal from 'core/components/SearchModal';
import PermanentSideNav from './PermanentSideNav';

export default class Navs extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  handleToggle = nextState =>
    (typeof nextState === 'boolean'
      ? this.setState({ open: nextState })
      : this.setState(prev => ({ open: !prev.open })));

  render() {
    const { open } = this.state;
    const { showSideNav, currentUser } = this.props;

    return (
      <div className="navs">
        <AppTopNav currentUser={currentUser} toggleDrawer={this.handleToggle} />
        <div className="permanent-side-nav">
          {showSideNav && (
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
  showSideNav: PropTypes.bool.isRequired,
};
