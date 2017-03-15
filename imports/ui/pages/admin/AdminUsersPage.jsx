import React, { Component, PropTypes } from 'react';

import AllUsersTable from '/imports/ui/components/admin/AllUsersTable.jsx';

const styles = {
  table: {
    margin: 'auto',
    width: 510, // Change this with the Table component
  },
};

export default class AdminUsersPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="mask1">
        <h1>Utilisateurs</h1>

        <div style={styles.table}>
          <AllUsersTable users={this.props.users} />
        </div>
      </section>
    );
  }
}

AdminUsersPage.propTypes = {
  users: PropTypes.arrayOf(PropTypes.any),
};
