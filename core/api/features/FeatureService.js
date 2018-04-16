import { runFeatureAction } from './featureActions';

class FeatureService {
  constructor() {
    this.togglePointsConfigs = {};
    this.loadFeatures();
  }

  loadFeatures() {
    const { features = {} } = Meteor.settings.public;

    Object.values(features).forEach(({ enabled, actions }) => {
      if (!enabled) {
        return null;
      }

      actions.forEach((actionName) => {
        const actionedTogglePointsConfigs = runFeatureAction(actionName);

        this.togglePointsConfigs = {
          ...this.togglePointsConfigs,
          ...actionedTogglePointsConfigs,
        };
      });
    });
  }

  getTogglePoint(id) {
    return this.togglePointsConfigs[id];
  }
}

export default new FeatureService();
