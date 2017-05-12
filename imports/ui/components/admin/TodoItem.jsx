import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';

import RaisedButton from 'material-ui/RaisedButton';

const TodoItem = props => {
  return (
    <article className="mask1 admin-todo">
      <div className="text">
        <h3 className="fixed-size">
          {props.name}{' '}
          <small>{props.small}</small>
        </h3>

        <p>{props.subtitle || ''}</p>
      </div>

      <RaisedButton label={props.label} onTouchTap={e => props.handleClick(e)} primary />
    </article>
  );
};

TodoItem.defaultProps = {
  offers: [],
};

TodoItem.propTypes = {
  request: PropTypes.objectOf(PropTypes.any).isRequired,
  offers: PropTypes.arrayOf(PropTypes.object),
};

export default TodoItem;
