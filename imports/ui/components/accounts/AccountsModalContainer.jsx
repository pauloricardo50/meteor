import React from 'react';
import { Meteor } from 'meteor/meteor';
import { AccountsTemplates } from 'meteor/useraccounts:core';


import NavItem from 'react-bootstrap/lib/NavItem';

import AccountsModal from './AccountsModal.jsx';

export default class AccountsModalContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.logout = this.logout.bind(this);
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  logout() {
    AccountsTemplates.logout();
  }

  render() {
    if (Meteor.userId()) {
      console.log("logged in!");
      return <NavItem onClick={this.logout}><p>Déconnexion</p></NavItem>;
    }
    console.log("no user ID");
    return (

      <a onClick={this.open}>
        <p>Login</p>
        <AccountsModal
          showModal={this.state.showModal}
          open={this.open}
          close={this.close}
        />
      </a>
    );
  }
}
