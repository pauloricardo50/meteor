import React from 'react';
import PropTypes from 'prop-types';
import extend from 'lodash/extend';
import {
  childrenToComponent,
  elementToComponent,
} from '../utils/reactFunctions';
import FeatureService from '../api/features/FeatureService';
import { TOGGLE_POINTS } from '../api/features/featureConstants';

const shouldEnhanceWrappedElements = ({
  id,
  children,
  toggleOnElement,
  toggleOffElement,
}) => {
  const hasElementsToEnhance =
    children || (toggleOnElement && toggleOffElement);

  return hasElementsToEnhance && FeatureService.getEnabledTogglePoint(id);
};

const TogglePoint = (props) => {
  const { id, children, toggleOnElement, toggleOffElement } = props;

  if (!shouldEnhanceWrappedElements(props)) {
    // if nothing to enhance, keep UI unenhanced by the Toggle Point
    // by just rendering the default elements passed to it
    return children || toggleOffElement;
  }

  const ComponentToBeToggled = children
    ? childrenToComponent(children)
    : elementToComponent(toggleOnElement);

  const performComponentToggling = FeatureService.getEnabledTogglePoint(id);

  const ToggledComponent = performComponentToggling(ComponentToBeToggled);
  return <ToggledComponent />;
};

extend(TogglePoint, TOGGLE_POINTS);

TogglePoint.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node,
  toggleOffElement: PropTypes.element,
  toggleOnElement: PropTypes.element,
};

TogglePoint.defaultProps = {
  children: undefined,
  toggleOffElement: undefined,
  toggleOnElement: undefined,
};

export default TogglePoint;
