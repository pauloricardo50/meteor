import { expect } from 'chai';
import { FeatureService } from '../FeatureService';

let featureService;

describe.only('FeatureService', () => {
  describe('getFeatureDecision', () => {
    beforeEach(() => {
      const featureConfig = {
        featureOne: true,
        featureWhichIsDisabled: false,
        featureWithPriorityOfDecision: true,
      };

      const featureMap = {
        featureOne: { tp1: true, tp2: 'tp2-v1' },
        featureWhichIsDisabled: { tp3: true },
        featureWithPriorityOfDecision: { tp2: 'tp2-v2' },
        featureNotInConfig: { tp4: true, tp2: 'tp2-v3' },
      };

      featureService = new FeatureService({ featureMap, featureConfig });
    });

    it('should return a feature decision that belongs to an enabled feature', () => {
      expect(featureService.getFeatureDecision('tp1')).to.be.true;
    });

    it('should return the latter feature decision for two decisions both belonging to different enabled features', () => {
      expect(featureService.getFeatureDecision('tp2')).to.equal('tp2-v2');
    });

    it('should not return a feature decision that does not exist anywhere', () => {
      expect(featureService.getFeatureDecision('tp9')).to.be.undefined;
    });

    it('should not return a feature decision of a feature disabled in the config but present in the feature map', () => {
      expect(featureService.getFeatureDecision('tp3')).to.be.undefined;
    });

    it('should not return a feature decision of a feature not existing in the config but present in the feature map', () => {
      expect(featureService.getFeatureDecision('tp4')).to.be.undefined;
    });

    it('should return undefined and not crash if the feature config does not exist', () => {
      const anotherFeatureService = new FeatureService({
        featureMap: { A_FEATURE: { TP1: true } },
        featureConfig: undefined,
      });
      expect(anotherFeatureService.getFeatureDecision('tp123')).to.be.undefined;
    });
  });
});
