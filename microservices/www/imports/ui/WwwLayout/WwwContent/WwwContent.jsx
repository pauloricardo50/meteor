import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const WwwContent = ({ className, children }) => {
  const contentClasses = classnames('www-main', className);
  return <main className={contentClasses}>{children}</main>;
};

WwwContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any.isRequired,
};

WwwContent.defaultProps = {
  className: '',
};

export default WwwContent;
