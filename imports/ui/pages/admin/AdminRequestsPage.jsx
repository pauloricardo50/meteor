import React, { Component, PropTypes } from 'react';

import AllRequestsTable from '/imports/ui/components/admin/AllRequestsTable.jsx';


export default class AdminRequestsPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="mask1">
        <h1>Demandes de Prêt</h1>

        <AllRequestsTable creditRequests={this.props.creditRequests} />
      </section>
    );
  }
}

AdminRequestsPage.propTypes = {
  creditRequests: PropTypes.arrayOf(PropTypes.any),
};
