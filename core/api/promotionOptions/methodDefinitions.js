import { Match } from 'meteor/check';
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

export const setPromotionOptionProgress = new Method({
  name: 'setPromotionOptionProgress',
  params: { promotionOptionId: String, object: Object, id: String },
});

export const promotionOptionActivateReservation = new Method({
  name: 'promotionOptionActivateReservation',
  params: { promotionOptionId: String },
});

export const promotionOptionUploadAgreement = new Method({
  name: 'promotionOptionUploadAgreement',
  params: {
    promotionOptionId: String,
    startDate: Match.OneOf(String, Date),
    agreementFileKeys: Array,
  },
});

export const promotionOptionAddToWaitList = new Method({
  name: 'promotionOptionAddToWaitList',
  params: {
    promotionOptionId: String,
  },
});
