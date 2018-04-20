import { branch } from 'recompose';
import FeatureService from './FeatureService';
import {
  childrenToComponent,
  renderObjectOrFunction,
} from '../../utils/reactFunctions';

const defaultChildrenEnhancer = c => c;

export const makeEnhancedChildrenComponent = ({ id, children }) => {
  const togglePointEnhancer =
    FeatureService.getFeatureDecision(id) || defaultChildrenEnhancer;
  return togglePointEnhancer(childrenToComponent(children));
};

const defaultSwitchOption = false;

export const makeOnOffSwitchedComponent = ({
  id,
  toggleOnElement,
  toggleOffElement,
}) => {
  const shouldSwitchOn =
    FeatureService.getFeatureDecision(id) || defaultSwitchOption;

  return branch(
    () => shouldSwitchOn,
    renderObjectOrFunction(toggleOnElement),
    renderObjectOrFunction(toggleOffElement),
  )();
};
