import { getAggregatePercent } from '../general';

export const withCombinedCalculator = (SuperClass = class {}) =>
  class extends SuperClass {
    filesProgress({ loan }) {
      const hasPromotion = loan.promotions && loan.promotions.length > 0;
      const progress = [
        this.getLoanFilesProgress,
        this.getBorrowerFilesProgress,
        !hasPromotion && this.getPropertyFilesProgress,
      ]
        .filter(x => x !== false)
        .map(f => f({ loan }))
        .filter(x => x);

      return getAggregatePercent(progress);
    }
  };
