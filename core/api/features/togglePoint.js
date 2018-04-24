// The `togglePoint` function should be used for toggling regular code.
// For React UI toggling, use the TogglePoint component.
import FeatureService from './FeatureService';

const defaultCodeChanger = variable => variable;

const togglePoint = ({ id, code }) => {
  if (!code) {
    throw new Error(`Couldn't find necesarry options for togglepoint with id: ${id}`);
  }

  const featureDecision = FeatureService.getFeatureDecision(id);

  const codeChanger =
    featureDecision === undefined ? defaultCodeChanger : featureDecision;

  return codeChanger(code);
};

export default togglePoint;
export { TOGGLE_POINTS } from './featureConstants';
