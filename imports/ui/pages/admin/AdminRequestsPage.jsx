import React, { Component, PropTypes } from 'react';

import AllRequestsTable from '/imports/ui/components/admin/AllRequestsTable.jsx';


const styles = {
  table: {
    margin: 'auto',
    width: 820, // Change this with the Table component
  },
};

export default class AdminRequestsPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="mask1">
        <h1>Demandes de Prêt</h1>

        <div style={styles.table}>
          <AllRequestsTable loanRequests={this.props.loanRequests} />
        </div>
      </section>
    );
  }
}

AdminRequestsPage.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.any),
};
