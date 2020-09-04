import EVENTS from '../events';

const referringProperties = [
  { name: 'referringUserId', optional: true },
  { name: 'referringUserName', optional: true },
  { name: 'referringOrganisationId', optional: true },
  { name: 'referringOrganisationName', optional: true },
];

const assigneeProperties = [
  { name: 'assigneeId', optional: true },
  { name: 'assigneeName', optional: true },
];

const eventsSharedProperties = [
  { name: 'userEmail', optional: true },
  { name: 'userName', optional: true },
  { name: 'acquisitionChannel', optional: true },
  ...referringProperties,
  ...assigneeProperties,
];

const dripSharedProperties = [
  ...eventsSharedProperties,
  { name: 'userId', optional: true },
];

const intercomSharedProperties = [
  ...eventsSharedProperties,
  { name: 'userId', optional: true },
  { name: 'lastPageTitle', optional: true },
  { name: 'lastPagePath', optional: true },
  { name: 'lastPageMicroservice', optional: true },
];

export const EVENTS_CONFIG = {
  [EVENTS.USER_CREATED]: {
    name: 'User Created',
    properties: [
      'userId',
      { name: 'userName', optional: true },
      'userEmail',
      ...referringProperties,
      ...assigneeProperties,
      'origin',
      { name: 'ctaId', optional: true },
      { name: 'acquisitionChannel', optional: true },
    ],
  },
  [EVENTS.USER_LOGGED_IN]: {
    name: 'User Logged in',
    properties: [...eventsSharedProperties, 'loginType'],
  },
  [EVENTS.USER_VERIFIED_EMAIL]: {
    name: 'User Verified',
    properties: [...eventsSharedProperties],
  },
  [EVENTS.USER_CHANGED_STATUS]: {
    name: 'User Changed Status',
    properties: [
      ...eventsSharedProperties,
      'nextStatus',
      { name: 'prevStatus', optional: true },
      { name: 'statusChangeReason', optional: true },
    ],
  },
  [EVENTS.LOAN_ANONYMOUS_LOAN_CLAIMED]: {
    name: 'Loan Anonymous loan claimed',
    properties: [...eventsSharedProperties, 'loanId', 'loanName'],
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
      {
        name: 'event',
        optional: ({ endpointName }) => endpointName !== 'Drip webhooks',
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
      ...eventsSharedProperties,
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
      { name: 'loanResidenceType', optional: true },
      'loanStep',
      'nextStatus',
      'prevStatus',
      ...eventsSharedProperties,
      { name: 'userId', optional: true },
    ],
  },
  [EVENTS.CTA_CLICKED]: {
    name: 'CTA clicked',
    properties: [
      'name',
      'path',
      'url',
      { name: 'route', optional: true },
      { name: 'referrer', optional: true },
      { name: 'toPath', optional: true },
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
      ...eventsSharedProperties,
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
      ...eventsSharedProperties,
    ],
  },
  [EVENTS.USER_FOLLOWED_IMPERSONATING_ADMIN]: {
    name: 'User Followed impersonating admin',
    properties: ['adminName', 'adminId', ...eventsSharedProperties],
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
      ...referringProperties,
      ...assigneeProperties,
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
      ...referringProperties,
      ...assigneeProperties,
    ],
  },
  [EVENTS.INTERCOM_STARTED_A_CONVERSATION]: {
    name: 'User Started Intercom conversation',
    properties: [...intercomSharedProperties],
  },
  [EVENTS.INTERCOM_RECEIVED_ADMIN_RESPONSE]: {
    name: 'User Received Intercom admin response',
    properties: [
      ...intercomSharedProperties,
      { name: 'answeringAdminId', optional: true },
      { name: 'answeringAdminName', optional: true },
    ],
  },
  [EVENTS.INTERCOM_SENT_A_MESSAGE]: {
    name: 'User Sent Intercom message',
    properties: [...intercomSharedProperties],
  },
  [EVENTS.INTERCOM_OPENED_MESSENGER]: {
    name: 'User Opened Intercom messenger',
    properties: [...intercomSharedProperties],
  },
  [EVENTS.DRIP_SUBSCRIBER_CREATED]: {
    name: 'Drip Subscriber Created',
    properties: [...dripSharedProperties],
  },
  [EVENTS.DRIP_SUBSCRIBER_UPDATED]: {
    name: 'Drip Subscriber Updated',
    properties: [...dripSharedProperties],
  },
  [EVENTS.DRIP_SUBSCRIBER_REMOVED]: {
    name: 'Drip Subscriber Removed',
    properties: [...dripSharedProperties],
  },
  [EVENTS.DRIP_SUBSCRIBER_EVENT_RECORDED]: {
    name: 'Drip Subscriber Event Recorded',
    properties: [
      ...dripSharedProperties,
      'dripEventAction',
      { name: 'dripEventProperties', optional: true },
    ],
  },
  [EVENTS.DRIP_SUBSCRIBER_LOST]: {
    name: 'Drip Subscriber Lost',
    properties: [
      ...dripSharedProperties,
      { name: 'lostReason', optional: true },
    ],
  },
  [EVENTS.DRIP_SUBSCRIBER_QUALIFIED]: {
    name: 'Drip Subscriber Qualified',
    properties: [
      ...dripSharedProperties,
      { name: 'qualifyReason', optional: true },
    ],
  },
  [EVENTS.DRIP_SUBSCRIBER_BOOKED_AN_EVENT]: {
    name: 'Drip Subscriber Booked an Event',
    properties: [...dripSharedProperties],
  },
  [EVENTS.DRIP_SUBSCRIBER_UNSUBSCRIBED]: {
    name: 'Drip Subscriber Unsubscribed',
    properties: [...dripSharedProperties],
  },
  [EVENTS.DRIP_SUBSCRIBER_RECEIVED_EMAIL]: {
    name: 'Drip Subscriber Received Email',
    properties: [...dripSharedProperties, 'dripEmailId', 'dripEmailSubject'],
  },
  [EVENTS.DRIP_SUBSCRIBER_OPENED_EMAIL]: {
    name: 'Drip Subscriber Opened Email',
    properties: [...dripSharedProperties, 'dripEmailId', 'dripEmailSubject'],
  },
  [EVENTS.DRIP_SUBSCRIBER_CLICKED_EMAIL]: {
    name: 'Drip Subscriber Clicked Email',
    properties: [
      ...dripSharedProperties,
      'dripEmailId',
      'dripEmailSubject',
      'dripEmailUrl',
    ],
  },
  [EVENTS.DRIP_SUBSCRIBER_BOUNCED]: {
    name: 'Drip Subscriber Bounced',
    properties: [...dripSharedProperties, 'dripEmailId', 'dripEmailSubject'],
  },
  [EVENTS.DRIP_SUBSCRIBER_COMPLAINED]: {
    name: 'Drip Subscriber Complained',
    properties: [...dripSharedProperties, 'dripEmailId', 'dripEmailSubject'],
  },
  [EVENTS.SUBSCRIBE_TO_NEWSLETTER]: {
    name: 'User subscribed to newsletter',
    properties: ['userEmail'],
  },
  [EVENTS.SUBMIT_PROMOTION_INTEREST_FORM]: {
    name: 'User submitted promotion interest form',
    properties: ['userEmail', 'promotionName'],
  },
  [EVENTS.COMPLETED_ONBOARDING_STEP]: {
    name: 'User Completed Onboarding step',
    properties: [
      ...eventsSharedProperties,
      'completedStep',
      { name: 'currentStep', optional: true },
      'loanId',
      'loanName',
      'anonymous',
      { name: 'propertyId', optional: true },
      { name: 'promotionId', optional: true },
      { name: 'promotionName', optional: true },
      { name: 'purchaseType', optional: true },
      { name: 'acquisitionStatus', optional: true },
      { name: 'residenceType', optional: true },
      { name: 'canton', optional: true },
      { name: 'propertyValue', optional: true },
      { name: 'previousLoanValue', optional: true },
      { name: 'borrowerCount', optional: true },
      { name: 'borrower1BirthDate', optional: true },
      { name: 'borrower2BirthDate', optional: true },
      { name: 'borrowersFortune', optional: true },
      { name: 'borrowersSalary', optional: true },
    ],
  },
  [EVENTS.STARTED_ONBOARDING]: {
    name: 'User Started Onboarding',
    properties: [
      ...eventsSharedProperties,
      { name: 'previousStep', optional: true },
      { name: 'currentStep', optional: true },
      'loanId',
      'loanName',
      'anonymous',
      { name: 'propertyId', optional: true },
      { name: 'promotionId', optional: true },
      { name: 'promotionName', optional: true },
      { name: 'purchaseType', optional: true },
    ],
  },
};

export const TRACKING_ORIGIN = {
  API: 'API',
  METEOR_METHOD: 'METEOR_METHOD',
};
