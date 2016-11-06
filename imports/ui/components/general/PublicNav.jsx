import React, { Component, PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

import TopNavDropdown from '/imports/ui/components/general/TopNavDropdown.jsx';


const styles = {
  navbar: {
    backgroundColor: '#FFFFFF',
    color: '#000000',
    position: 'fixed',
    boxShadow: '0px 2px 40px 0px rgba(0,0,0,0.08)',
  },
  imageDiv: {
    position: 'absolute',
    left: 24,
    padding: 17,
  },
  image: {
    height: 30,
  },
  button: {
    color: '#000000',
  },
};

export default class PublicNav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let button;
    if (this.props.currentUser) {
      button = (
        <TopNavDropdown public />
      );
    } else {
      button = <FlatButton style={styles.button} label="Login" onClick={() => FlowRouter.go('/login')} />;
    }

    return (
      <AppBar
        // title=("Title")
        style={styles.navbar}
        children={
          <a href="/" style={styles.imageDiv}>
            <img src="img/logo_black.svg" alt="e-Potek" style={styles.image} />
          </a>}
        iconElementRight={button}
      />
    );
  }
}

PublicNav.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any),
};
