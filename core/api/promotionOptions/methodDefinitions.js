import { Match } from 'meteor/check';
import { Method } from '../methods/methods';

export const promotionOptionInsert = new Method({
  name: 'promotionOptionInsert',
  params: {
    promotionLotId: String,
    loanId: String,
  },
});

export const promotionOptionRemove = new Method({
  name: 'promotionOptionRemove',
  params: {
    promotionOptionId: String,
  },
});

export const promotionOptionUpdate = new Method({
  name: 'promotionOptionUpdate',
  params: {
    promotionOptionId: String,
    object: Object,
  },
});
