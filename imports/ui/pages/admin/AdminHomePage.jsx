import PropTypes from 'prop-types';
import React, { Component } from 'react';


import MetricsTriple from '/imports/ui/components/general/MetricsTriple.jsx';
import TodoList from '/imports/ui/components/admin/TodoList.jsx';

export default class AdminHomePage extends Component {
  constructor(props) {
    super(props);

    this.getUserMetrics = this.getUserMetrics.bind(this);
  }

  getUserMetrics() {
    const d1 = new Date();
    const d2 = new Date();
    d1.setDate(d1.getDate() - 7);
    d2.setDate(d2.getDate() - 30);

    return [
      {
        name: 'Total Utilisateurs',
        value: this.props.users.length,
      }, {
        name: 'Derniers 7 jours',
        value: '+' + this.props.users.filter(user => user.createdAt.getTime() >= d1).length,
      }, {
        name: 'Derniers 30 jours',
        value: '+' + this.props.users.filter(user => user.createdAt.getTime() >= d2).length,
      },
    ];
  }

  render() {
    const now = new Date();
    return (
      <section className="mask1">
        <h1>Admin Dashboard</h1>

        <MetricsTriple metrics={this.getUserMetrics()} percent={false} />

        <TodoList
          loanRequests={this.props.loanRequests}
          recentOffers={this.props.offers.filter(offer => offer.auctionEndTime >= now)}
        />

      </section>
    );
  }
}

AdminHomePage.defaultProps = {
  loanRequests: [],
  users: [],
  offers: [],
};

AdminHomePage.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.object),
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  offers: PropTypes.arrayOf(PropTypes.object),
};
