// @flow
import { withSelector } from './Selector';

export const withCombinedCalculator = (SuperClass = class {}) =>
  class extends SuperClass {
    filesProgress({ loan }) {
      const progress = [
        this.getLoanFilesProgress,
        this.getBorrowerFilesProgress,
        !loan.hasPromotion && this.getPropertyFilesProgress,
      ];

      return progress
        .filter(x => x !== false)
        .reduce(
          (total, percent, i, array) =>
            total + percent({ loan }) / array.length,
          0,
        );
    }
  };

export const CombinedCalculator = withSelector(withCombinedCalculator());

export default new CombinedCalculator();
