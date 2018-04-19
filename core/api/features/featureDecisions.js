import { Meteor } from 'meteor/meteor';
import pickBy from 'lodash/pickBy';
import { withProps } from 'recompose';
import { TOGGLE_POINTS } from './featureConstants';
import {
  enhanceChildrenWith,
  switchElements,
} from './featureDecisionConfigurationFactories';

const { WIDGET1_CONTINUE_BUTTON, HOMEPAGE_LOGIN_BUTTON } = TOGGLE_POINTS;

const { features: featuresConfig } = Meteor.settings.public;

const createFeatureDecision = ({ decisionType, decision }) => {};

const featureMaps = {
  liteVersion: {
    // For each decision/toggle point it, you should pass a decision value
    // suitable for the way you use the Toggle Point.
    // E.g.: for a toggle point that wraps chilren, use `enhanceChildrenWith`
    //       for a toggle point that switches component on/off, use `switchElements`
    // First check how you use the TogglePoint component, then configure it's behaviour here
    [WIDGET1_CONTINUE_BUTTON]: enhanceChildrenWith(withProps({
      to: '/contact',
    })),
  },
};

const getEnabledFeatureMaps = maps =>
  // Get only the feature maps of the enabled features
  pickBy(featureMaps, (value, name) => featuresConfig[name]);

// Merge the features' togglePoint maps into one final object
const getCurrentFeatureDecisions = () => {
  const enabledFeatureDecisions = Object.values(getEnabledFeatureMaps());
  return enabledFeatureDecisions.reduce(
    (allDecisions, featureDecisions) => ({
      ...allDecisions,
      ...featureDecisions,
    }),
    {},
  );
};

export const getFeatureDecision = (togglePointId) => {
  const currentFeatureDecisions = getCurrentFeatureDecisions();
  return currentFeatureDecisions[togglePointId];
};
