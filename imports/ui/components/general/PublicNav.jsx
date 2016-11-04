import React from 'react';
// import { Meteor } from 'meteor/meteor';
// import Blaze from 'meteor/gadicc:blaze-react-component';
//
// import Navbar from 'react-bootstrap/lib/Navbar';
// import Nav from 'react-bootstrap/lib/Nav';
// import NavItem from 'react-bootstrap/lib/NavItem';
//
// import AccountsModalContainer from '../accounts/AccountsModalContainer.jsx';
// import AccountsUI from '../accounts/AccountsUI.jsx';

import AppBar from 'material-ui/AppBar';



export default class PublicNav extends React.Component {
  render() {
    return (
      <AppBar
        // title=("Title")
        children={<img src="img/logo_white.svg" alt="e-Potek" width="200px" />}
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
