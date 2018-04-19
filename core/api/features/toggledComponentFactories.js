import { branch } from 'recompose';
import { getFeatureDecision } from './featureDecisions';
import {
  childrenToComponent,
  renderObjectOrFunction,
} from '../../utils/reactFunctions';

const defaultChildrenEnhancer = c => c;

export const makeEnhancedChildrenComponent = ({ id, children }) => {
  const togglePointEnhancer = getFeatureDecision(id) || defaultChildrenEnhancer;
  return togglePointEnhancer(childrenToComponent(children));
};

export const makeOnOffSwitchedComponent = ({
  id,
  toggleOnElement,
  toggleOffElement,
}) => {
  const shouldSwitchOn = getFeatureDecision(id);

  return branch(
    () => shouldSwitchOn,
    renderObjectOrFunction(toggleOnElement),
    renderObjectOrFunction(toggleOffElement),
  )();
};
