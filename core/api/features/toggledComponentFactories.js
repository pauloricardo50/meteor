import { branch } from 'recompose';
import FeatureDecisionsService from './FeatureDecisionsService';
import {
  childrenToComponent,
  renderObjectOrFunction,
} from '../../utils/reactFunctions';

const defaultChildrenEnhancer = c => c;

export const makeEnhancedChildrenComponent = ({ id, children }) => {
  const togglePointEnhancer =
    FeatureDecisionsService.getFeatureDecision(id) || defaultChildrenEnhancer;
  return togglePointEnhancer(childrenToComponent(children));
};

const defaultSwitchOption = false;

export const makeOnOffSwitchedComponent = ({
  id,
  toggleOnElement,
  toggleOffElement,
}) => {
  const shouldSwitchOn =
    FeatureDecisionsService.getFeatureDecision(id) || defaultSwitchOption;

  return branch(
    () => shouldSwitchOn,
    renderObjectOrFunction(toggleOnElement),
    renderObjectOrFunction(toggleOffElement),
  )();
};
