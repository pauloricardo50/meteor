import React from 'react';
import { AccountsTemplates } from 'meteor/useraccounts:core';

import Panel from 'react-bootstrap/lib/Panel';

export default class ProfilePage extends React.Component {

  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  logout() {
    AccountsTemplates.logout();
  }


  render() {
    const panelFooter = <button onClick={this.logout} className="btn btn-default">Déconnexion</button>;

    return (
      <Panel footer={panelFooter}>
        <div className="text-center">
          <span className="fa fa-user fa-5x" />
        </div>
        <hr />

        <div className="form-group col-sm-8 col-sm-offset-2">
          <p>E-mail: {this.props.currentUser.emails[0].address}</p>
        </div>


        {/* <ul>
            <li><a href="/admin/users">{{_ "nav_admin_users"}}</a></li>
            <li><a href="/admin/requests">{{_ "nav_admin_requests"}}</a></li>
        </ul> */}
      </Panel>
    );
  }
}
