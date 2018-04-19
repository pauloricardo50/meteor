import { branch } from 'recompose';
import { getFeatureDecision } from './featureDecisions';
import {
  childrenToComponent,
  renderObjectOrFunction,
} from '../../utils/reactFunctions';

export const makeEnhancedChildrenComponent = ({ id, children }) => {
  const togglePointEnhancer = getFeatureDecision(id) || (c => c);
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
