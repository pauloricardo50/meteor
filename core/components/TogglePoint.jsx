import React from 'react';
import PropTypes from 'prop-types';
import {
  makeEnhancedChildrenComponent,
  makeOnOffSwitchedComponent,
} from '../api/features/toggledComponentFactories';

// an array of functions that return factories based on the input props
const toggledComponentFactoryPickers = [
  props => (props.children ? makeEnhancedChildrenComponent : undefined),
  props =>
    (props.toggleOnElement && props.toggleOffElement
      ? makeOnOffSwitchedComponent
      : undefined),
];

// returns a factory that will later produce the component this Toggle Point will render
const pickToggledComponentFactory = (props) => {
  // get the first picker returns a truty factory
  const getFactory = toggledComponentFactoryPickers.find(pickFactory =>
    pickFactory(props));
  // get the factory that the picker returns
  return getFactory ? getFactory(props) : undefined;
};

const TogglePoint = (props) => {
  const makeToggledComponent = pickToggledComponentFactory(props);
  const ToggledComponent = makeToggledComponent(props);
  return ToggledComponent();
};

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
export { TOGGLE_POINTS } from '../api/features/featureConstants';
