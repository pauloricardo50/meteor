import { Match } from 'meteor/check';
import { Method } from '../methods/methods';

export const promotionOptionInsert = new Method({
  name: 'promotionOptionInsert',
  params: {
    promotionOption: Object,
    loanId: String,
  },
});

export const promotionOptionUpdate = new Method({
  name: 'promotionOptionUpdate',
  params: {
    promotionOptionId: String,
    object: Object,
  },
});
