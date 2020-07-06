import EVENTS from '../events';

export const EVENTS_CONFIG = {
  [EVENTS.USER_CREATED]: {
    name: 'User Created',
    properties: [
      'userId',
      { name: 'userName', optional: true },
      'userEmail',
      { name: 'referringUserId', optional: true },
      { name: 'referringUserName', optional: true },
      { name: 'referringOrganisationId', optional: true },
      { name: 'referringOrganisationName', optional: true },
      { name: 'assigneeId', optional: true },
      { name: 'assigneeName', optional: true },
      'origin',
      { name: 'ctaId', optional: true },
    ],
  },
  [EVENTS.USER_LOGGED_IN]: {
    name: 'User Logged in',
    properties: [
      'loginType',
      { name: 'userName', optional: true },
      { name: 'userEmail', optional: true },
      { name: 'referringUserId', optional: true },
      { name: 'referringUserName', optional: true },
      { name: 'referringOrganisationId', optional: true },
      { name: 'referringOrganisationName', optional: true },
      { name: 'assigneeId', optional: true },
      { name: 'assigneeName', optional: true },
    ],
  },
  [EVENTS.USER_VERIFIED_EMAIL]: {
    name: 'User Verified',
    properties: [
      { name: 'userName', optional: true },
      { name: 'userEmail', optional: true },
      { name: 'referringUserId', optional: true },
      { name: 'referringUserName', optional: true },
      { name: 'referringOrganisationId', optional: true },
      { name: 'referringOrganisationName', optional: true },
      { name: 'assigneeId', optional: true },
      { name: 'assigneeName', optional: true },
    ],
  },
  [EVENTS.LOAN_ANONYMOUS_LOAN_CLAIMED]: {
    name: 'Loan Anonymous loan claimed',
    properties: [
      'loanId',
      'loanName',
      { name: 'userName', optional: true },
      { name: 'userEmail', optional: true },
      { name: 'referringUserId', optional: true },
      { name: 'referringUserName', optional: true },
      { name: 'referringOrganisationId', optional: true },
      { name: 'referringOrganisationName', optional: true },
      { name: 'assigneeId', optional: true },
      { name: 'assigneeName', optional: true },
    ],
  },
  [EVENTS.API_CALLED]: {
    name: 'Api Called',
    properties: [
      'endpoint',
      { name: 'result', optional: true },
      'startTime',
      'endTime',
      'duration',
      'authenticationType',
      'endpointName',
      {
        name: 'fileSize',
        optional: ({ endpointName }) => endpointName !== 'Upload file',
      },
      {
        name: 'type',
        optional: ({ endpointName }) =>
          !['Front plugin', 'Intercom webhooks'].includes(endpointName),
      },
      {
        name: 'collectionName',
        optional: ({ endpointName, type }) => {
          if (endpointName === 'Front plugin') {
            return type !== 'QUERY' && type !== 'QUERY_ONE';
          }
          return true;
        },
      },
      {
        name: 'methodName',
        optional: ({ endpointName, type }) => {
          if (endpointName === 'Front plugin') {
            return type !== 'METHOD';
          }
          return true;
        },
      },
      {
        name: 'webhookName',
        optional: ({ endpointName }) => endpointName !== 'Front webhooks',
      },
      {
        name: 'topic',
        optional: ({ endpointName }) => endpointName !== 'Intercom webhooks',
      },
    ],
  },
  [EVENTS.LOAN_CREATED]: {
    name: 'Loan Created',
    properties: [
      'loanId',
      'loanName',
      { name: 'propertyId', optional: true },
      { name: 'promotionId', optional: true },
      { name: 'referralId', optional: true },
      { name: 'anonymous', optional: true },
      { name: 'purchaseType', optional: true },
      { name: 'userName', optional: true },
      { name: 'userEmail', optional: true },
      { name: 'referringUserId', optional: true },
      { name: 'referringUserName', optional: true },
      { name: 'referringOrganisationId', optional: true },
      { name: 'referringOrganisationName', optional: true },
      { name: 'assigneeId', optional: true },
      { name: 'assigneeName', optional: true },
    ],
  },
  [EVENTS.LOAN_STATUS_CHANGED]: {
    name: 'Loan Status changed',
    properties: [
      'adminId',
      'adminName',
      'loanCategory',
      'loanId',
      'loanName',
      'loanPurchaseType',
      'loanResidenceType',
      'loanStep',
      'nextStatus',
      'prevStatus',
      { name: 'userName', optional: true },
      { name: 'userId', optional: true },
      { name: 'userEmail', optional: true },
      { name: 'referringUserId', optional: true },
      { name: 'referringUserName', optional: true },
      { name: 'referringOrganisationId', optional: true },
      { name: 'referringOrganisationName', optional: true },
      { name: 'assigneeId', optional: true },
      { name: 'assigneeName', optional: true },
    ],
  },
  [EVENTS.CTA_CLICKED]: {
    name: 'CTA clicked',
    properties: [
      'name',
      'url',
      'route',
      'path',
      { name: 'referrer', optional: true },
    ],
  },
  [EVENTS.LOAN_MAX_PROPERTY_VALUE_CALCULATED]: {
    name: 'Loan Max property value calculated',
    properties: [
      'loanId',
      'loanName',
      'canton',
      'interfaceType',
      'purchaseType',
      { name: 'anonymous', optional: true },
      { name: 'proPropertyId', optional: true },
      { name: 'proPropertyValue', optional: true },
      { name: 'proPropertyAddress', optional: true },
      { name: 'mainMinBorrowRatio', optional: true },
      'mainMaxBorrowRatio',
      { name: 'mainMinPropertyValue', optional: true },
      'mainMaxPropertyValue',
      { name: 'mainMinOrganisationName', optional: true },
      'mainMaxOrganisationName',
      { name: 'secondMinBorrowRatio', optional: true },
      'secondMaxBorrowRatio',
      { name: 'secondMinPropertyValue', optional: true },
      'secondMaxPropertyValue',
      { name: 'secondMinOrganisationName', optional: true },
      'secondMaxOrganisationName',
      { name: 'promotionId', optional: true },
      { name: 'promotionName', optional: true },
      { name: 'userName', optional: true },
      { name: 'userEmail', optional: true },
      { name: 'referringUserId', optional: true },
      { name: 'referringUserName', optional: true },
      { name: 'referringOrganisationId', optional: true },
      { name: 'referringOrganisationName', optional: true },
      { name: 'assigneeId', optional: true },
      { name: 'assigneeName', optional: true },
    ],
  },
  [EVENTS.LOAN_BORROWERS_INSERTED]: {
    name: 'Loan Borrowers inserted',
    properties: [
      'loanId',
      'loanName',
      'amount',
      { name: 'anonymous', optional: true },
      { name: 'proPropertyId', optional: true },
      { name: 'proPropertyAddress', optional: true },
      { name: 'promotionId', optional: true },
      { name: 'promotionName', optional: true },
      { name: 'userName', optional: true },
      { name: 'userEmail', optional: true },
      { name: 'referringUserId', optional: true },
      { name: 'referringUserName', optional: true },
      { name: 'referringOrganisationId', optional: true },
      { name: 'referringOrganisationName', optional: true },
      { name: 'assigneeId', optional: true },
      { name: 'assigneeName', optional: true },
    ],
  },
  [EVENTS.USER_FOLLOWED_IMPERSONATING_ADMIN]: {
    name: 'User Followed impersonating admin',
    properties: [
      'adminName',
      'adminId',
      { name: 'userName', optional: true },
      { name: 'userEmail', optional: true },
      { name: 'referringUserId', optional: true },
      { name: 'referringUserName', optional: true },
      { name: 'referringOrganisationId', optional: true },
      { name: 'referringOrganisationName', optional: true },
      { name: 'assigneeId', optional: true },
      { name: 'assigneeName', optional: true },
    ],
  },
  [EVENTS.PRO_INVITED_CUSTOMER]: {
    name: 'Pro Invited customer',
    properties: [
      'customerId',
      'customerName',
      'customerEmail',
      { name: 'propertyId', optional: true },
      { name: 'propertyAddress', optional: true },
      { name: 'promotionId', optional: true },
      { name: 'promotionName', optional: true },
      { name: 'promotionLotIds', optional: true },
      { name: 'showAllLots', optional: true },
      { name: 'referOnly', optional: true },
      'referringUserId',
      'referringUserName',
      'referringOrganisationId',
      'referringOrganisationName',
      'assigneeId',
      'assigneeName',
    ],
  },
  [EVENTS.PRO_INVITED_PRO]: {
    name: 'Pro Invited pro',
    properties: [
      'proId',
      'proName',
      'proEmail',
      'organisationId',
      'organisationName',
    ],
  },
  [EVENTS.ADMIN_INVITED_USER]: {
    name: 'Admin Invited user',
    properties: [
      'userId',
      'userName',
      'userEmail',
      { name: 'referringUserId', optional: true },
      { name: 'referringUserName', optional: true },
      { name: 'referringOrganisationId', optional: true },
      { name: 'referringOrganisationName', optional: true },
      { name: 'assigneeId', optional: true },
      { name: 'assigneeName', optional: true },
    ],
  },
  [EVENTS.INTERCOM_STARTED_A_CONVERSATION]: {
    name: 'User Started Intercom conversation',
    properties: [
      { name: 'userEmail', optional: true },
      { name: 'userName', optional: true },
      { name: 'userId', optional: true },
      { name: 'referringUserId', optional: true },
      { name: 'referringUserName', optional: true },
      { name: 'referringOrganisationId', optional: true },
      { name: 'referringOrganisationName', optional: true },
      { name: 'assigneeId', optional: true },
      { name: 'assigneeName', optional: true },
      { name: 'lastPageTitle', optional: true },
      { name: 'lastPagePath', optional: true },
      { name: 'lastPageMicroservice', optional: true },
    ],
  },
  [EVENTS.INTERCOM_RECEIVED_ADMIN_RESPONSE]: {
    name: 'User Received Intercom admin response',
    properties: [
      { name: 'userEmail', optional: true },
      { name: 'userName', optional: true },
      { name: 'userId', optional: true },
      { name: 'referringUserId', optional: true },
      { name: 'referringUserName', optional: true },
      { name: 'referringOrganisationId', optional: true },
      { name: 'referringOrganisationName', optional: true },
      { name: 'assigneeId', optional: true },
      { name: 'assigneeName', optional: true },
      { name: 'answeringAdminId', optional: true },
      { name: 'answeringAdminName', optional: true },
      { name: 'lastPageTitle', optional: true },
      { name: 'lastPagePath', optional: true },
      { name: 'lastPageMicroservice', optional: true },
    ],
  },
  [EVENTS.INTERCOM_SENT_A_MESSAGE]: {
    name: 'User Sent Intercom message',
    properties: [
      { name: 'userEmail', optional: true },
      { name: 'userName', optional: true },
      { name: 'userId', optional: true },
      { name: 'referringUserId', optional: true },
      { name: 'referringUserName', optional: true },
      { name: 'referringOrganisationId', optional: true },
      { name: 'referringOrganisationName', optional: true },
      { name: 'assigneeId', optional: true },
      { name: 'assigneeName', optional: true },
      { name: 'lastPageTitle', optional: true },
      { name: 'lastPagePath', optional: true },
      { name: 'lastPageMicroservice', optional: true },
    ],
  },
  [EVENTS.INTERCOM_OPENED_MESSENGER]: {
    name: 'User Opened Intercom messenger',
    properties: [
      { name: 'userEmail', optional: true },
      { name: 'userName', optional: true },
      { name: 'userId', optional: true },
      { name: 'referringUserId', optional: true },
      { name: 'referringUserName', optional: true },
      { name: 'referringOrganisationId', optional: true },
      { name: 'referringOrganisationName', optional: true },
      { name: 'assigneeId', optional: true },
      { name: 'assigneeName', optional: true },
      { name: 'lastPageTitle', optional: true },
      { name: 'lastPagePath', optional: true },
      { name: 'lastPageMicroservice', optional: true },
    ],
  },
};

export const TRACKING_ORIGIN = {
  API: 'API',
  METEOR_METHOD: 'METEOR_METHOD',
};
