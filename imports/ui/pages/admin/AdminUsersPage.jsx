import React, { Component, PropTypes } from 'react';

import AllUsersTable from '/imports/ui/components/admin/AllUsersTable.jsx';

export default class AdminUsersPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="mask1">
        <h1>Utilisateurs</h1>

        <AllUsersTable users={this.props.users} />
      </section>
    );
  }
}

AdminUsersPage.propTypes = {
  users: PropTypes.arrayOf(PropTypes.any),
};
