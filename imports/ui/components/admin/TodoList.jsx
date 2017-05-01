import PropTypes from 'prop-types';
import React from 'react';

import TodoItem from './TodoItem.jsx';
import adminActions from '/imports/js/helpers/adminActions';

const getActions = props => {
  const array = [];
  props.loanRequest.forEach(r => {
    const actions = adminActions(r, props);
    actions.forEach(a => {
      const object = {
        request: r,
        action: a,
      };
      array.push(object);
    });
  });
};

const TodoList = props => {
  const actionsArray = getActions(props);
  return (
    <section>
      <h2>Actions à prendre</h2>

      {actionsArray.map((a, i) => (
        <TodoItem request={a.request} key={`${a.request._id}${i}`} action={a.action} />
      ))}

      {/* {this.getReviewRequests().map(request => (
        <TodoItem request={request} key={request._id} verify />
      ))}

      {this.getAuctionRequests().map(request => (
        <TodoItem
          request={request}
          key={request._id}
          action="Ajouter une offre"
          offers={this.props.recentOffers.filter(offer => offer.requestId === request._id)}
          auction
        />
      ))} */}

      {actionsArray.length <= 0 &&
        <h3 className="text-center secondary" style={{ padding: '40px 0' }}>
          Rien à faire en ce moment
        </h3>}
    </section>
  );
};

TodoList.defaultProps = {
  loanRequests: [],
  recentOffers: [],
};

TodoList.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.object),
  recentOffers: PropTypes.arrayOf(PropTypes.object),
};

export default TodoList;
