import { Method } from '../methods/methods';

export const promotionOptionInsert = new Method({
  name: 'promotionOptionInsert',
  params: {
    promotionLotId: String,
    loanId: String,
    promotionId: String,
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

export const increaseOptionPriority = new Method({
  name: 'increaseOptionPriority',
  params: { promotionOptionId: String },
});

export const reducePriorityOrder = new Method({
  name: 'reducePriorityOrder',
  params: { promotionOptionId: String },
});

export const promotionOptionUpdateObject = new Method({
  name: 'promotionOptionUpdateObject',
  params: { promotionOptionId: String, object: Object, id: String },
});

export const promotionOptionRequestReservation = new Method({
  name: 'promotionOptionRequestReservation',
  params: { promotionOptionId: String },
});
