// @flow
import { withSelector } from './Selector';

export const withCombinedCalculator = (SuperClass = class {}) =>
  class extends SuperClass {
    filesProgress({ loan }) {
      const loanProgress = this.getLoanFilesProgress({ loan });
      const borrowersProgress = this.getBorrowerFilesProgress({ loan });
      const propertyProgress = this.getPropertyFilesProgress({ loan });
      return (loanProgress + borrowersProgress + propertyProgress) / 3;
    }
  };

export const CombinedCalculator = withSelector(withCombinedCalculator());

export default new CombinedCalculator();
