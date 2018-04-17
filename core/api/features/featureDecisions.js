import { TOGGLE_POINTS } from './featureConstants';

const { WIDGET1_CONTINUE_BUTTON } = TOGGLE_POINTS;

const featuresDecisions = {
  liteVersion: () => ({
    // for Reach Toggle Points like this one,
    // pass `hide: true` to hide or a `props` object
    // to extend the props of the toggle component
    [WIDGET1_CONTINUE_BUTTON]: {
      props: { to: '/contact' },
    },
  }),
};

export const performFeaturesDecisions = (features = {}) =>
  Object.keys(features).reduce(
    (decisions, featureName) => ({
      ...decisions,
      ...featuresDecisions[featureName](),
    }),
    {},
  );
