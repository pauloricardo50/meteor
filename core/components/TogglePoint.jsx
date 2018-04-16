import React from 'react';
import PropTypes from 'prop-types';
import FeatureService from '../api/features/FeatureService';

const TogglePoint = ({ id, children }) => {
  const togglePoint = FeatureService.getTogglePoint(id);

  if (!togglePoint) {
    return children;
  }

  const { hide, props: childPropOverrides } = togglePoint;

  if (hide) {
    return null;
  }

  return React.Children.map(children, child =>
    React.cloneElement(child, childPropOverrides));
};

TogglePoint.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default TogglePoint;
