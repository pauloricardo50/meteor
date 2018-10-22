// @flow
import { withSelector } from './Selector';

export const withCombinedCalculator = (SuperClass = class {}) =>
  class extends SuperClass {
    filesProgress({ loan }) {
      const hasPromotion = loan.promotions && loan.promotions.length > 0;
      const progress = [
        this.getLoanFilesProgress,
        this.getBorrowerFilesProgress,
        !hasPromotion && this.getPropertyFilesProgress,
      ].filter(x => x !== false);

      return progress.reduce(
        (total, percent, i, array) => total + percent({ loan }) / array.length,
        0,
      );
    }
  };

export const CombinedCalculator = withSelector(withCombinedCalculator());

export default new CombinedCalculator();
