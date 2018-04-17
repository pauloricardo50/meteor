import { Meteor } from 'meteor/meteor';
import pickBy from 'lodash/pickBy';

import { performFeaturesDecisions } from './featureDecisions';

class FeatureService {
  constructor() {
    this.enabledTogglePointsConfigs = {};
    this.loadFeatures();
  }

  loadFeatures() {
    const enabledFeatures = this.getEnabledFeatures();

    // merge the decisions of all enabled features
    // so we get an object of options used to show/hide/toggle
    // the toggle points in the code
    this.enabledTogglePointsConfigs = performFeaturesDecisions(enabledFeatures);
  }

  getEnabledFeatures() {
    const { features = {} } = Meteor.settings.public;
    return pickBy(features, (name, enabled) => enabled);
  }

  getEnabledTogglePoint(id) {
    return this.enabledTogglePointsConfigs[id];
  }
}

export default new FeatureService();
