import React from 'react';
import PropTypes from 'prop-types';
import extend from 'lodash/extend';
import FeatureService from '../api/features/FeatureService';
import { TOGGLE_POINTS } from '../api/features/featureConstants';

const TogglePoint = ({ id, children }) => {
  const togglePoint = FeatureService.getEnabledTogglePoint(id);

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

extend(TogglePoint, TOGGLE_POINTS);

export default TogglePoint;
