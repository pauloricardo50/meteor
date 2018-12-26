import fullPropertyFragment from './fullPropertyFragment';
import { userValuation } from '.';

export default {
  ...fullPropertyFragment,
  valuation: userValuation,
};
