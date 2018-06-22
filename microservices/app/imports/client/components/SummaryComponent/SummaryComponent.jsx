import React from 'react';
import PropTypes from 'prop-types';

const SummaryComponent = ({ children }) =>
  <div className="summary-component">{children}</div>;
SummaryComponent.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SummaryComponent;
