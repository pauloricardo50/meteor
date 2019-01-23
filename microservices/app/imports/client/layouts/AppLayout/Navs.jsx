import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import TopNav from 'core/components/TopNav';
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

  handleClickLink = () => Meteor.defer(() => this.setState({ open: false }));

  render() {
    const { open } = this.state;
    const { showSideNav, currentUser } = this.props;

    return (
      <div className="navs">
        <TopNav
          currentUser={currentUser}
          public={false}
          drawerState={open}
          toggleDrawer={this.handleToggle}
          handleClickLink={this.handleClickLink}
        />
        <div className="permanent-side-nav">
          {showSideNav && <PermanentSideNav {...this.props} />}
        </div>
      </div>
    );
  }
}

Navs.propTypes = {
  showSideNav: PropTypes.bool.isRequired,
};
