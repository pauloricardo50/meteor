import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

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
