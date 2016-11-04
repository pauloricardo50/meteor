import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';


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

export default class PublicNav extends React.Component {
  constructor(props) {
    super(props);

    this.logInOut = this.logInOut.bind(this);
  }

  logInOut() {
    if (Meteor.user()) {
      return (
        <FlatButton label="Logout" onClick={() => Meteor.logout()} />
      );
    }
    return (
      <FlatButton label="Login" onClick={() => FlowRouter.go('/login')} />
    );
  }

  render() {
    if (Meteor.user()) {
      var button =  <FlatButton style={styles.button} label="Logout" onClick={() => Meteor.logout()} />;
    } else {
      var button = <FlatButton style={styles.button} label="Login" onClick={() => FlowRouter.go('/login')} />;
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
        // iconClassNameRight="muidocs-icon-navigation-expand-more"
      />
    );
  }
}

//
// <nav className="navbar navbar-default home-nav">
//   <div className="navbar-header">
//     <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
//       <span className="sr-only">Toggle navigation</span>
//       <span className="icon-bar"></span>
//       <span className="icon-bar"></span>
//       <span className="icon-bar"></span>
//     </button>
//     <a href="/" className="navbar-brand">
//       <img src="img/logo_black.svg" alt="e-Potek" width="150px" />
//     </a>
//   </div>
//   <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
//     {this.props.currentUser ? <ul className="nav navbar-nav navbar-left">
//       <li><a href="/main">Mon Compte</a></li>
//     </ul> : ''}
//     <ul className="nav navbar-nav navbar-right">
//       {/* <li><Blaze template="loginButtons" /></li> */}
//       <li><a href="/">A propos</a></li>
//       <li><a href="/login">Login</a></li>
//       {/* <NavItem><AccountsUI /></NavItem> */}
//     </ul>
//   </div>
// </nav>
// );
