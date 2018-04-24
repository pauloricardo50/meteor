import { Meteor } from 'meteor/meteor';
import pickBy from 'lodash/pickBy';
import extend from 'lodash/extend';
import { withProps, renderNothing } from 'recompose';
import { TOGGLE_POINTS } from './featureConstants';
import {
  enhanceChildrenWith,
  changeCodeWith,
} from './featureDecisionFactories';
import { returnEmptyArray, returnFalse } from '../../utils/featureFunctions';

const {
  WIDGET1_CONTINUE_BUTTON,
  LITE_VERSION_OFF,
  LITE_VERSION_ROUTES_OFF,
  LITE_VERSION_LOGIN_OFF,
} = TOGGLE_POINTS;

const { features: featureConfig } = Meteor.settings.public;

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
 * (so only the latter decision gets applied); the features' order is dictated by the Feature Map.
 *
 * So in the end, tehnically speaking, we get a single list of Toggle Points which will
 * customize the code as we specify in the Feature Map.
 *
 * For each decision/toggle point it, you should pass a decision value
 * suitable for the way you use that Toggle Point.
 * E.g.: for a toggle point that wraps chilren, use `enhanceChildrenWith`
 *       for a toggle point that switches components on/off, use `switchElements`
 * First check how your TogglePoint component is used,
 * then configure it's behaviour here.
 */

const featureMap = {
  LITE_VERSION: {
    [WIDGET1_CONTINUE_BUTTON]: enhanceChildrenWith(withProps({
      to: '/contact',
    })),
    [LITE_VERSION_OFF]: enhanceChildrenWith(renderNothing),
    [LITE_VERSION_ROUTES_OFF]: changeCodeWith(returnEmptyArray),
    [LITE_VERSION_LOGIN_OFF]: changeCodeWith(returnFalse),
  },
};

export class FeatureService {
  constructor({ featureMap = {}, featureConfig = {} }) {
    this.featureMap = featureMap;
    this.featureConfig = featureConfig;
  }

  // Merges all feature decisions of the features that are enabled
  getEnabledFeatureDecisions({ featureMap, featureConfig }) {
    // Get a feature map of all enabled features
    const enabledFeatureMap = pickBy(
      featureMap,
      (featureDecisions, featureName) => {
        const featureIsEnabled = featureConfig[featureName];
        return featureIsEnabled;
      },
    );

    // merge all enabled feature decisions into a single object
    return extend({}, ...Object.values(enabledFeatureMap));
  }

  getFeatureDecision(togglePointId) {
    const { featureMap, featureConfig } = this;
    const currentFeatureDecisions = this.getEnabledFeatureDecisions({
      featureMap,
      featureConfig,
    });

    return currentFeatureDecisions[togglePointId];
  }
}

export default new FeatureService({ featureMap, featureConfig });
