import React from 'react';
import PropTypes from 'prop-types';
import {
  makeEnhancedChildrenComponent,
  makeOnOffSwitchedComponent,
} from '../api/features/toggledComponentFactories';

// an array of functions that return factories based on the input props
const factoryPickers = [
  props => props.children && makeEnhancedChildrenComponent,
  props =>
    props.toggleOnElement &&
    props.toggleOffElement &&
    makeOnOffSwitchedComponent,
];

// returns a factory that will later produce the component this Toggle Point will render
const pickFactoryFromProps = (props) => {
  // get the first picker that returns a truthy factory
  const getFactory = factoryPickers.find(pickFactory => pickFactory(props));

  if (!getFactory) {
    throw new Error(`Couldn't find factory for togglepoint with id: ${props.id}`);
  }

  // get the factory that the picker returns
  return getFactory(props);
};

const TogglePoint = (props) => {
  const makeToggledComponent = pickFactoryFromProps(props);
  const ToggledComponent = makeToggledComponent(props);
  return <ToggledComponent />;
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
