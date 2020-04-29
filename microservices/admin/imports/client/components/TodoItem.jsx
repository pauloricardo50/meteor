import React from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';

const TodoItem = ({ name, small, subtitle, label, handleClick }) => (
  <article className="card1 card-top admin-todo">
    <div className="text">
      <h3 className="fixed-size">
        {name} <small>{small}</small>
      </h3>

      <p>{subtitle || ''}</p>
    </div>

    <Button raised label={label} onClick={handleClick} primary />
  </article>
);

TodoItem.defaultProps = {
  offers: [],
};

TodoItem.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  offers: PropTypes.arrayOf(PropTypes.object),
};

export default TodoItem;
