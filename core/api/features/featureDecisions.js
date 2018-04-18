import { TOGGLE_POINTS } from './featureConstants';
import { withProps } from 'recompose';

const { WIDGET1_CONTINUE_BUTTON } = TOGGLE_POINTS;

const featuresDecisions = {
  liteVersion: {
    // For Reach Toggle Points configuration, pass an enhancer that
    // will customize the component that will be toggled
    [WIDGET1_CONTINUE_BUTTON]: withProps({
      to: '/contact',
    }),
  },
};

// returns decisions from all features
export const performFeaturesDecisions = (features = {}) =>
  Object.keys(features).reduce(
    (decisions, featureName) => ({
      ...decisions,
      ...featuresDecisions[featureName],
    }),
    {},
  );
