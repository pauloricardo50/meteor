import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const WwwContent = ({ className, children }) => {
  const contentClasses = classnames('www-main', className);
  return <main className={contentClasses}>{children}</main>;
};

WwwContent.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
};

WwwContent.defaultProps = {
  className: '',
};

export default WwwContent;
