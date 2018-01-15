import PropTypes from 'prop-types';
import React from 'react';

import Icon from 'core/components/Icon';
import colors from 'core/config/colors';
import ValidIconContainer, { STATUS } from './ValidIconContainer';
import './ValidIcon.scss';

const ValidIcon = ({ status, style, fade }) => {
  switch (status) {
    case STATUS.HIDE:
      return null;
    case STATUS.ERROR:
      return (
        <Icon
          style={{ ...style, color: colors.error }}
          icon="close"
          size={50}
        />
      );
    case STATUS.VALID:
      return (
        <span style={style} className={fade ? 'animated zoomOut' : undefined}>
          <svg
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className="checkmark__circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className="checkmark__check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </span>
      );
    case STATUS.TODO:
      return (
        <span className="todo-circle" style={style}>
          <span className="inside" />
        </span>
      );
    default:
      return null;
  }
};

ValidIcon.propTypes = {
  saving: PropTypes.bool.isRequired,
  errorExists: PropTypes.bool.isRequired,
  style: PropTypes.objectOf(PropTypes.any),
};

export default ValidIconContainer(ValidIcon);
