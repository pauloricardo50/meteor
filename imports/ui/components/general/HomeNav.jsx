import React from 'react';
import { Meteor } from 'meteor/meteor';
import Blaze from 'meteor/gadicc:blaze-react-component';

import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';

import AccountsModalContainer from '../accounts/AccountsModalContainer.jsx';
import AccountsUI from '../accounts/AccountsUI.jsx';


export default class HomeNav extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-default home-nav">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand">
            <img src="img/logo_black.svg" alt="e-Potek" width="150px" />
          </a>
        </div>
        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          {this.props.currentUser ? <ul className="nav navbar-nav navbar-left">
            <li href="/main"><p>Mon Compte</p></li>
          </ul> : ''}
          <ul className="nav navbar-nav navbar-right">
            {/* <li><Blaze template="loginButtons" /></li> */}
            <li><a href="#">A propos</a></li>
            <li><AccountsModalContainer /></li>
            {/* <NavItem><AccountsUI /></NavItem> */}
          </ul>
        </div>
      </nav>
    );
  }
}
