import fullPropertyFragment from './fullPropertyFragment';
import { adminValuation } from './propertyFragments';

export default {
  ...fullPropertyFragment,
  valuation: adminValuation,
};
