import React, { Component, PropTypes } from 'react';

import TodoItem from './TodoItem.jsx';

export default class TodoList extends Component {
  constructor(props) {
    super(props);
  }

  getReviewRequests() {
    const now = new Date();
    return this.props.loanRequests.filter(
      r =>
        r.logic.auctionStarted &&
        !r.logic.auctionVerified &&
        r.logic.auctionEndTime >= now,
    );
  }

  getAuctionRequests() {
    const now = new Date();
    return this.props.loanRequests.filter(
      r =>
        r.logic.auctionStarted &&
        r.logic.auctionVerified &&
        r.logic.auctionEndTime >= now,
    );
  }

  render() {
    return (
      <section>
        <h2>Actions à prendre</h2>

        {this.getReviewRequests().map(request => (
          <TodoItem request={request} key={request._id} verify />
        ))}

        {this.getAuctionRequests().map(request => (
          <TodoItem
            request={request}
            key={request._id}
            action="Ajouter une offre"
            offers={this.props.recentOffers.filter(
              offer => offer.requestId === request._id,
            )}
            auction
          />
        ))}
      </section>
    );
  }
}

TodoList.defaultProps = {
  loanRequests: [],
  recentOffers: [],
};

TodoList.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.object),
  recentOffers: PropTypes.arrayOf(PropTypes.object),
};
