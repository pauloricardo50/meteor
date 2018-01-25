import PropTypes from 'prop-types';
import React from 'react';

import Button from 'core/components/Button';

const TodoItem = ({ name, small, subtitle, label, handleClick }) => (
  <article className="mask1 admin-todo">
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
  request: PropTypes.objectOf(PropTypes.any).isRequired,
  offers: PropTypes.arrayOf(PropTypes.object),
};

export default TodoItem;
