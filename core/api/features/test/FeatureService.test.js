import sinon from 'sinon';
import { expect } from 'chai';
import FeatureService from '../FeatureService';

let featureConfig;
let featureMap;

describe.only('FeatureService', () => {
  describe('getFeatureDecision', () => {
    beforeEach(() => {
      featureConfig = {
        featureOne: true,
        featureWhichIsDisabled: false,
        featureWithPriorityOfDecision: true,
      };

      featureMap = {
        featureOne: { tp1: true, tp2: 'tp2-v1' },
        featureWhichIsDisabled: { tp3: true },
        featureWithPriorityOfDecision: { tp2: 'tp2-v2' },
        featureNotInConfig: { tp4: true, tp2: 'tp2-v3' },
      };

      // doing this we basically have a new function with a new reference
      // otherwise we get Maximum Call Stack Size Exceeded error (it's calling itself)
      const getEnabledFeatureDecisionsClone =
        FeatureService.getEnabledFeatureDecisions;

      sinon.stub(FeatureService, 'getEnabledFeatureDecisions').callsFake(() =>
        getEnabledFeatureDecisionsClone({
          featureMap,
          featureConfig,
        }));
    });

    afterEach(() => {
      FeatureService.getEnabledFeatureDecisions.restore();
    });

    it('should return a feature decision that belongs to an enabled feature', () => {
      expect(FeatureService.getFeatureDecision('tp1')).to.be.true;
    });

    it('should return the latter feature decision for two decisions both belonging to different enabled features', () => {
      expect(FeatureService.getFeatureDecision('tp2')).to.equal('tp2-v2');
    });

    it('should not return a feature decision that does not exist anywhere', () => {
      expect(FeatureService.getFeatureDecision('tp9')).to.be.undefined;
    });

    it('should not return a feature decision of a feature disabled in the config but present in the feature map', () => {
      expect(FeatureService.getFeatureDecision('tp3')).to.be.undefined;
    });

    it('should not return a feature decision of a feature not existing in the config but present in the feature map', () => {
      expect(FeatureService.getFeatureDecision('tp4')).to.be.undefined;
    });
  });
});
