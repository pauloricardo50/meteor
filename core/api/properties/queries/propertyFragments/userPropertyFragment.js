import fullPropertyFragment from './fullPropertyFragment';
import { userValuation } from './propertyFragments';

export default {
  ...fullPropertyFragment,
  valuation: userValuation,
};
