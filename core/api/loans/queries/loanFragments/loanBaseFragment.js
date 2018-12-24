import loanFragment from './loanFragment';
import userPropertyFragment from '../../../properties/queries/propertyFragments/userPropertyFragment';

export default {
  ...loanFragment,
  promotionOptions: {
    promotionLots: {
      name: 1,
      status: 1,
      reducedStatus: 1,
      value: 1,
      properties: userPropertyFragment,
    },
    name: 1,
    custom: 1,
    attributedToMe: 1,
    priority: 1,
    promotion: 1,
    value: 1,
    solvency: 1,
  },
};
