import React from 'react';
import { Meteor } from 'meteor/meteor';

import AccountsModal from './AccountsModal.jsx';

export default class AccountsModalContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false };
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
    this.setState({ showModal: false });
    Meteor.logout();
  }

  render() {
    if (Meteor.userId()) {
      return <button onClick={this.logout} style={{ border: 'none', background: 'none' }}><h6 className="header-nav">Déconnexion</h6></button>;
    }
    return (
      <div>
        <button onClick={this.open} style={{ border: 'none', background: 'none' }}><h6 className="header-nav">Login</h6></button>
        <AccountsModal
          showModal={this.state.showModal}
          open={this.open}
          close={this.close}
        />
      </div>
    );
  }
}
