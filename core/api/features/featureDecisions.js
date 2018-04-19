import { Meteor } from 'meteor/meteor';
import pickBy from 'lodash/pickBy';
import extend from 'lodash/extend';
import { withProps } from 'recompose';
import { TOGGLE_POINTS } from './featureConstants';
import { enhanceChildrenWith } from './featureDecisionFactories';

const { WIDGET1_CONTINUE_BUTTON, HOMEPAGE_LOGIN_BUTTON } = TOGGLE_POINTS;

const { features: featuresConfig } = Meteor.settings.public;

/**
 * A `Feature`, when enabled, changes the application in some way
 * (on frontend, backend, anywhere); when disabled, the application remains unchanged.
 *
 * A `Feature Decision` belongs to a certain feature and
 * represents a change performed in the application when that feature is enabled.
 * The actual place in the code where the feature decision will be applied
 * to change the code is called a `Toggle Point`.
 *
 * The `Toggle Point` is the technical implementation of the Feature Decision concept
 *
 * The `Feature Map` is a list of maches between a feature and its decisions.
 *
 * When multiple features are enabled, all their decisions get merged into
 * a single list of decisions. If the same feature decision (represented by a Toggle Point)
 * is used in more than one feature, the one in the latter feature overwrites others before it
 * (so only the latter decision gets applied).
 *
 * So in the end, tehnically speaking, we get a single list of Toggle Points which will
 * customize the code as we specify in the Feature Map.
 */
const featureMaps = {
  LITE_VERSION: {
    // For each decision/toggle point it, you should pass a decision value
    // suitable for the way you use the Toggle Point.
    // E.g.: for a toggle point that wraps chilren, use `enhanceChildrenWith`
    //       for a toggle point that switches component on/off, use `switchElements`
    // First check how your TogglePoint component is used,
    // then configure it's behaviour here.
    [WIDGET1_CONTINUE_BUTTON]: enhanceChildrenWith(withProps({
      to: '/contact',
    })),
  },
};

// Merges all feature decisions of the features that are enabled
const getEnabledFeatureDecisions = (featureMap) => {
  // Get a feature maps only of enabled features
  const enabledFeaturesMap = pickBy(
    featureMap,
    (featureDecisions, featureName) => featuresConfig[featureName],
  );

  const enabledFeatureDecisions = Object.values(enabledFeaturesMap);

  // merge all enabled feature decisions into a single object
  return extend({}, ...enabledFeatureDecisions);
};

export const getFeatureDecision = (togglePointId) => {
  const currentFeatureDecisions = getEnabledFeatureDecisions(featureMaps);
  return currentFeatureDecisions[togglePointId];
};
