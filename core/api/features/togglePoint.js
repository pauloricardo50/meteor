// The `togglePoint` function should be used for toggling regular code.
// For React UI toggling, use the TogglePoint component.
import FeatureService from './FeatureService';

const defaultCodeChanger = variable => variable;

const togglePoint = id => code => {
  if (!code) {
    throw new Error(
      `Couldn't find necesarry options for togglepoint with id: ${id}`,
    );
  }

  const codeChanger =
    FeatureService.getFeatureDecision(id) || defaultCodeChanger;

  return codeChanger(code);
};

export default togglePoint;
export { TOGGLE_POINTS } from './featureConstants';
