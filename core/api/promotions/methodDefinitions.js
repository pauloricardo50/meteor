// @flow
import { Match } from 'meteor/check';
import { Method } from '../methods/methods';

export const promotionInsert = new Method({
  name: 'promotionInsert',
  params: {
    promotion: Object,
  },
});

export const promotionUpdate = new Method({
  name: 'promotionUpdate',
  params: {
    promotionId: String,
    object: Object,
  },
});

export const promotionRemove = new Method({
  name: 'promotionRemove',
  params: {
    promotionId: String,
  },
});

export const insertPromotionProperty = new Method({
  name: 'insertPromotionProperty',
  params: {
    promotionId: String,
    property: Object,
  },
});

export const setPromotionUserPermissions = new Method({
  name: 'setPromotionUserPermissions',
  params: {
    promotionId: String,
    userId: String,
    permissions: Object,
  },
});

export const addProUserToPromotion = new Method({
  name: 'addProUserToPromotion',
  params: {
    promotionId: String,
    userId: String,
  },
});

export const removeProFromPromotion = new Method({
  name: 'removeProFromPromotion',
  params: {
    promotionId: String,
    userId: String,
  },
});

export const sendPromotionInvitationEmail = new Method({
  name: 'sendPromotionInvitationEmail',
  params: {
    userId: String,
    email: String,
    isNewUser: Boolean,
    promotionId: String,
    firstName: String,
  },
});

export const removeUserFromPromotion = new Method({
  name: 'removeUserFromPromotion',
  params: {
    promotionId: String,
    loanId: String,
  },
});

export const editPromotionLoan = new Method({
  name: 'editPromotionLoan',
  params: {
    promotionId: String,
    loanId: String,
    promotionLotIds: [String],
    showAllLots: Match.Optional(Boolean),
  },
});

export const reuseConstructionTimeline = new Method({
  name: 'reuseConstructionTimeline',
  params: {
    fromPromotionId: String,
    toPromotionId: String,
  },
});
