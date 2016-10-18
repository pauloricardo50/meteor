import React from 'react';
import { Meteor } from 'meteor/meteor';

import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';

import AccountsModalContainer from '../accounts/AccountsModalContainer.jsx';
import AccountsUI from '../accounts/AccountsUI.jsx';


export default class HomeNav extends React.Component {
  render() {
    return (
      <Navbar className="home-nav">
        <Navbar.Header>
          <Navbar.Brand>
            <a><img src="img/logo_black.svg" alt="e-Potek" width="150px" /></a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          {this.props.currentUser ? <Nav pullLeft>
            <NavItem href="/main"><p>Mon Compte</p></NavItem>
          </Nav> : ''}
          <Nav pullRight>
            <NavItem><p>A propos</p></NavItem>
            {/* <AccountsModalContainer /> */}
            <NavItem><AccountsUI /></NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
