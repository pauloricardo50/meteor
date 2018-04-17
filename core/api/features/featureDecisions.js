import { TOGGLE_POINTS } from './featureConstants';

const { WIDGET1_CONTINUE_BUTTON } = TOGGLE_POINTS;

const featuresDecisions = {
  liteVersion: () => ({
    // for Reach Toggle Points configuration,
    // pass `hide: true` to not render it
    // or a `props` object to extend the props of the toggle component
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
