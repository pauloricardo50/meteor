import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import NewUserOptions from '/imports/ui/components/general/NewUserOptions.jsx';
import DashboardItem from './dashboardPage/DashboardItem.jsx';
import NewRequestModal from './dashboardPage/NewRequestModal.jsx';

const styles = {
  hr: {
    width: '40%',
    margin: '60px auto',
  },
};

export default class DashboardPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: 0,
    };
  }

  handleClick = i => {
    if (this.state.active === i) {
      this.setState({ active: -1 });
    } else {
      this.setState({ active: i });
    }
  };

  handleNew = () => {
    if (this.props.borrowers.length > 0) {
      // TODO, add a new request page for logged in users
      console.log('En développement');
    } else {
      this.props.history.push('/home');
    }
  };

  render() {
    const sortedRequests = this.props.loanRequests.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
    const newRequestId = queryString.parse(this.props.location.search).newrequest;

    if (this.props.loanRequests.length <= 0) {
      return <NewUserOptions />;
    }

    return (
      <section>
        <h1>Tableau de Bord</h1>

        {sortedRequests
          .map((request, i) => (
            <DashboardItem
              {...this.props}
              loanRequest={request}
              borrowers={this.props.borrowers}
              key={request._id}
              handleClick={() => this.handleClick(i)}
              active={this.state.active === i}
              count={this.props.loanRequests.length}
            />
          ))
          .reduce((prev, curr) => [prev, <hr style={styles.hr} />, curr])}

        {!!(newRequestId && !sortedRequests.find(r => r._id === newRequestId).property.address1) &&
          <NewRequestModal open requestId={newRequestId} history={this.props.history} />}
      </section>
    );
  }
}

DashboardPage.defaultProps = {
  loanRequests: [],
  borrowers: [],
};

DashboardPage.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.object),
  borrowers: PropTypes.arrayOf(PropTypes.object),
};
