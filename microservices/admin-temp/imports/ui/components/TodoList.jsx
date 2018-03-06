import PropTypes from 'prop-types';
import React from 'react';

import TodoItem from './TodoItem';
import adminActions from 'core/arrays/adminActions';

const getActions = (props) => {
  const array = [];
  props.loans.forEach((r) => {
    const actions = adminActions(r, props);
    actions.forEach((a) => {
      const object = {
        loan: r,
        action: a,
      };
      array.push(object);
    });
  });

  return array;
};

const TodoList = (props) => {
  const actionsArray = getActions(props);
  return (
    <section>
      <h2>Actions à prendre</h2>

      {actionsArray.map((a, i) => (
        <TodoItem loan={a.loan} key={`${a.loan._id}${i}`} {...a.action} />
      ))}

      {actionsArray.length <= 0 && (
        <h3 className="text-center secondary" style={{ padding: '40px 0' }}>
          Rien à faire en ce moment
        </h3>
      )}
    </section>
  );
};

TodoList.defaultProps = {
  loans: [],
  recentOffers: [],
};

TodoList.propTypes = {
  loans: PropTypes.arrayOf(PropTypes.object),
  recentOffers: PropTypes.arrayOf(PropTypes.object),
};

export default TodoList;
