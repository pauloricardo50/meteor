import { Match } from 'meteor/check';

import { Method } from '../methods/methods';

export const promotionInsert = new Method({
  name: 'promotionInsert',
  params: { promotion: Object },
});

export const promotionUpdate = new Method({
  name: 'promotionUpdate',
  params: { promotionId: String, object: Object },
});

export const promotionRemove = new Method({
  name: 'promotionRemove',
  params: { promotionId: String },
});

export const insertPromotionProperty = new Method({
  name: 'insertPromotionProperty',
  params: { promotionId: String, property: Object },
});

export const setPromotionUserPermissions = new Method({
  name: 'setPromotionUserPermissions',
  params: { promotionId: String, userId: String, permissions: Object },
});

export const addProUserToPromotion = new Method({
  name: 'addProUserToPromotion',
  params: { promotionId: String, userId: String },
});

export const removeProFromPromotion = new Method({
  name: 'removeProFromPromotion',
  params: { promotionId: String, userId: String },
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

export const removeLoanFromPromotion = new Method({
  name: 'removeLoanFromPromotion',
  params: { promotionId: String, loanId: String },
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

export const toggleNotifications = new Method({
  name: 'toggleNotifications',
  params: { promotionId: String },
});

export const updatePromotionUserRoles = new Method({
  name: 'updatePromotionUserRoles',
  params: { promotionId: String, userId: String, roles: Array },
});

export const promotionSetStatus = new Method({
  name: 'promotionSetStatus',
  params: { promotionId: String, status: String },
});

export const addPromotionLotGroup = new Method({
  name: 'addPromotionLotGroup',
  params: { promotionId: String, label: String },
});

export const removePromotionLotGroup = new Method({
  name: 'removePromotionLotGroup',
  params: { promotionId: String, promotionLotGroupId: String },
});

export const updatePromotionLotGroup = new Method({
  name: 'updatePromotionLotGroup',
  params: { promotionId: String, promotionLotGroupId: String, label: String },
});

export const updatePromotionTimeline = new Method({
  name: 'updatePromotionTimeline',
  params: { promotionId: String, constructionTimeline: Object },
});

export const submitPromotionInterestForm = new Method({
  name: 'submitPromotionInterestForm',
  params: {
    details: Match.Maybe(String),
    email: String,
    name: String,
    phoneNumber: Match.Maybe(String),
    promotionId: String,
  },
  rateLimit: { global: { limit: 3, timeRange: 30000 } },
});
