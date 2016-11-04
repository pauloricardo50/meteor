import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
// import Blaze from 'meteor/gadicc:blaze-react-component';
//
// import Navbar from 'react-bootstrap/lib/Navbar';
// import Nav from 'react-bootstrap/lib/Nav';
// import NavItem from 'react-bootstrap/lib/NavItem';
//
// import AccountsModalContainer from '../accounts/AccountsModalContainer.jsx';
// import AccountsUI from '../accounts/AccountsUI.jsx';

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';


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
      var button =  <FlatButton label="Logout" onClick={() => Meteor.logout()} />;
    } else {
      var button = <FlatButton label="Login" onClick={() => FlowRouter.go('/login')} />;
    }

    return (
      <AppBar
        // title=("Title")
        iconElementLeft={<img src="img/logo_white.svg" alt="e-Potek" width="200px" />}
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
