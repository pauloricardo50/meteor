import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import TopNav from 'core/components/TopNav';
import SearchModal from 'core/components/SearchModal';
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
    const { showSideNav } = this.props;

    return (
      <div>
        <TopNav
          key={0}
          {...this.props}
          public={false}
          drawerState={open}
          toggleDrawer={this.handleToggle}
          handleClickLink={this.handleClickLink}
        >
          <SearchModal />
        </TopNav>
        <div
          key={1}
          className={classnames({
            'permanent-side-nav': true,
            'always-side-nav': isAdmin,
          })}
        >
          {showSideNav && <PermanentSideNav {...this.props} isApp={isApp} />}
        </div>
      </div>
    );
  }
}

Navs.propTypes = {
  showSideNav: PropTypes.bool.isRequired,
};
