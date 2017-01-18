import React, { Component, PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Person from 'material-ui/svg-icons/social/person';


import TopNavDropdown from '/imports/ui/components/general/TopNavDropdown.jsx';


const styles = {
  navbar: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#000000',
    boxShadow: '0px 2px 40px 0px rgba(0,0,0,0.08)',
  },
  imageDiv: {
    position: 'absolute',
    left: 24,
    padding: 17,
  },
  image: {
    height: 30,
    maxWidth: '50%',
  },
  button: {
    color: '#000000',
  },
};


const PublicNav = props => (
  <div className="public-nav">
    <AppBar
      style={styles.navbar}
      iconElementRight={<TopNavDropdown public currentUser={props.currentUser} />}
      iconStyleLeft={{ display: 'none' }}
    >
      <a href="/" style={styles.imageDiv}>
        <img src="/img/logo_black.svg" alt="e-Potek" style={styles.image} />
      </a>
    </AppBar>
  </div>
);


PublicNav.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any),
};

export default PublicNav;
