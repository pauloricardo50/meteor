import { Match } from 'meteor/check';

import { Method } from '../methods/methods';

export const loanUpdate = new Method({
  name: 'loanUpdate',
  params: {
    loanId: String,
    object: Object,
  },
});

export const loanDelete = new Method({
  name: 'loanDelete',
  params: {
    loanId: String,
  },
});

export const pushLoanValue = new Method({
  name: 'pushLoanValue',
  params: {
    loanId: String,
    object: Object,
  },
});

export const popLoanValue = new Method({
  name: 'popLoanValue',
  params: {
    loanId: String,
    object: Object,
  },
});

export const adminLoanInsert = new Method({
  name: 'adminLoanInsert',
  params: {
    userId: Match.Optional(String),
    loan: Match.Optional(Object),
  },
});

export const userLoanInsert = new Method({
  name: 'userLoanInsert',
  params: {
    proPropertyId: Match.Maybe(String),
    test: Match.Optional(Boolean),
    purchaseType: Match.Maybe(String),
  },
});

export const addNewStructure = new Method({
  name: 'addNewStructure',
  params: {
    loanId: String,
  },
});

export const removeStructure = new Method({
  name: 'removeStructure',
  params: {
    loanId: String,
    structureId: String,
  },
});

export const updateStructure = new Method({
  name: 'updateStructure',
  params: {
    loanId: String,
    structureId: String,
    structure: Object,
  },
});

export const selectStructure = new Method({
  name: 'selectStructure',
  params: {
    loanId: String,
    structureId: String,
  },
});

export const duplicateStructure = new Method({
  name: 'duplicateStructure',
  params: {
    loanId: String,
    structureId: String,
  },
});

export const assignLoanToUser = new Method({
  name: 'assignLoanToUser',
  params: {
    loanId: String,
    userId: Match.OneOf(String, null),
  },
});

export const switchBorrower = new Method({
  name: 'switchBorrower',
  params: {
    loanId: String,
    borrowerId: String,
    oldBorrowerId: String,
  },
});

export const loanUpdatePromotionInvitedBy = new Method({
  name: 'loanUpdatePromotionInvitedBy',
  params: { loanId: String, promotionId: String, invitedBy: String },
});

export const reuseProperty = new Method({
  name: 'reuseProperty',
  params: { loanId: String, propertyId: String },
});

export const setMaxPropertyValueOrBorrowRatio = new Method({
  name: 'setMaxPropertyValueOrBorrowRatio',
  params: { loanId: String, canton: String },
});

export const addNewMaxStructure = new Method({
  name: 'addNewMaxStructure',
  params: {
    loanId: String,
    residenceType: Match.Maybe(String),
    canton: String,
  },
});

export const setLoanStep = new Method({
  name: 'setLoanStep',
  params: { loanId: String, nextStep: String },
});

export const loanShareSolvency = new Method({
  name: 'loanShareSolvency',
  params: { loanId: String, shareSolvency: Boolean },
});

export const anonymousLoanInsert = new Method({
  name: 'anonymousLoanInsert',
  params: {
    existingAnonymousLoanId: Match.Maybe(Match.OneOf(String, null)),
    proPropertyId: Match.Maybe(String),
    purchaseType: Match.Maybe(String),
    referralId: Match.Maybe(Match.OneOf(String, null)),
  },
});

export const loanInsertBorrowers = new Method({
  name: 'loanInsertBorrowers',
  params: {
    loanId: String,
    amount: Number,
  },
});

export const loanSetBorrowers = new Method({
  name: 'loanSetBorrowers',
  params: {
    loanId: String,
    amount: Number,
  },
});

export const loanLinkPromotion = new Method({
  name: 'loanLinkPromotion',
  params: {
    promotionId: String,
    loanId: String,
  },
});

export const loanUnlinkPromotion = new Method({
  name: 'loanUnlinkPromotion',
  params: {
    promotionId: String,
    loanId: String,
  },
});

export const loanSetCreatedAtActivityDescription = new Method({
  name: 'loanSetCreatedAtActivityDescription',
  params: { loanId: String, description: String },
});

export const loanSetStatus = new Method({
  name: 'loanSetStatus',
  params: {
    loanId: String,
    status: String,
    activitySource: Match.Maybe(String),
  },
});

export const sendLoanChecklist = new Method({
  name: 'sendLoanChecklist',
  params: {
    loanId: String,
    address: String,
    emailParams: Object,
    attachmentKeys: Match.Maybe(Array),
    basicDocumentsOnly: Match.Optional(Boolean),
  },
});

export const loanSetAdminNote = new Method({
  name: 'loanSetAdminNote',
  params: {
    loanId: String,
    adminNoteId: Match.Maybe(String),
    note: Object,
    notifyPros: Match.Maybe(Array),
  },
});

export const loanRemoveAdminNote = new Method({
  name: 'loanRemoveAdminNote',
  params: {
    loanId: String,
    adminNoteId: String,
  },
});

export const loanSetDisbursementDate = new Method({
  name: 'loanSetDisbursementDate',
  params: { loanId: String, disbursementDate: Date },
});

export const loanSetAssignees = new Method({
  name: 'loanSetAssignees',
  params: {
    loanId: String,
    assignees: Array,
    note: String,
    updateUserAssignee: Match.Optional(Boolean),
  },
});

export const loanLinkBorrower = new Method({
  name: 'loanLinkBorrower',
  params: { loanId: String, borrowerId: String },
});

export const loanGetReusableProperties = new Method({
  name: 'loanGetReusableProperties',
  params: { loanId: String },
});

export const loanLinkProperty = new Method({
  name: 'loanLinkProperty',
  params: { loanId: String, propertyId: String },
});

export const addClosingChecklists = new Method({
  name: 'addClosingChecklists',
  params: { loanId: String },
});

export const notifyInsuranceTeamForPotential = new Method({
  name: 'notifyInsuranceTeamForPotential',
  params: { loanId: String },
});

export const updateInsurancePotential = new Method({
  name: 'updateInsurancePotential',
  params: { loanId: String, insurancePotential: String },
});

export const upsertUserProperty = new Method({
  name: 'upsertUserProperty',
  params: { loanId: String, property: Object },
});

export const sendNegativeFeedbackToLenders = new Method({
  name: 'sendNegativeFeedbackToLenders',
  params: {
    loanId: String,
    contactIds: Array,
  },
});
