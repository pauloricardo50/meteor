import { addEvent } from './eventsHelpers';

// const EVENTS = {
//   WITH_FUNC_EXAMPLE: 'WITH_FUNC_EXAMPLE',
//   WITH_LIFECYCLE_EXAMPLE: 'WITH_LIFECYCLE_EXAMPLE',
// };

// addEvent(EVENTS.WITH_FUNC_EXAMPLE, {
//   func: 'handleSubmit',
//   config: (handleSubmitArgument1, handleSubmitArgument2) => ({
//     eventName: 'Submitted something',
//     metadata: { hello: 'world' },
//   }),
// });

// addEvent(EVENTS.WITH_LIFECYCLE_EXAMPLE, {
//   lifecycleMethod: 'componentDidMount',
//   config: {
//     eventName: 'Loaded this awesome component',
//     metadata: { hello: 'world' },
//   },
// });

export const EVENTS = {
  USER: {
    CREATED: 'USER_CREATED',
    LOGGED_IN: 'USER_LOGGED_IN',
    VERIFIED_EMAIL: 'USER_VERIFIED_EMAIL',
  },
  PROMOTION: {
    CREATED: 'PROMOTION_CREATED',
    LOT_STATUS_UPDATED: 'PROMOTION_LOT_STATUS_UPDATED',
    CUSTOMER_INVITED: 'PROMOTION_CUSTOMER_INVITED',
  },
  PROPERTY: {
    CUSTOMER_INVITED: 'PROPERTY_CUSTOMER_INVITED',
  },
  LOAN: {
    CREATED: 'LOAN_CREATED',
    SET_STEP: 'LOAN_SET_STEP',
    SET_STATUS: 'LOAN_SET_STATUS',
    COMPLETED_A_STRUCTURE: 'LOAN_COMPLETED_A_STRUCTURE',
    MADE_PROGRESS: 'LOAN_MADE_PROGRESS',
    TASK_ADDED: 'LOAN_TASK_ADDED',
    TASK_UPDATED: 'LOAN_TASK_UPDATED',
    ANONYMOUS_LOAN_CLAIMED: 'LOAN_ANONYMOUS_LOAN_CLAIMED',
  },
  CTA: {
    CLICKED: 'CTA_CLICKED',
  },
};

export const EVENTS_CONFIG = {
  [EVENTS.USER.CREATED]: {
    name: 'User Created',
    properties: ['userId', 'referral', 'origin'],
  },
  [EVENTS.USER.LOGGED_IN]: {
    name: 'User Logged in',
  },
  [EVENTS.USER.VERIFIED_EMAIL]: {
    name: 'User Verified',
  },
  [EVENTS.LOAN.ANONYMOUS_LOAN_CLAIMED]: {
    name: 'Loan Anonymous loan claimed',
    properties: ['loanId'],
  },
};

export default EVENTS;
