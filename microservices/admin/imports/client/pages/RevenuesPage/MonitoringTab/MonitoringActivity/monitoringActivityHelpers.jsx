import {
  INSURANCE_REQUESTS_COLLECTION,
  INSURANCE_REQUEST_STATUS,
  INSURANCE_REQUEST_STATUS_ORDER,
} from 'core/api/insuranceRequests/insuranceRequestConstants';
import {
  INSURANCES_COLLECTION,
  INSURANCE_STATUS,
  INSURANCE_STATUS_ORDER,
} from 'core/api/insurances/insuranceConstants';
import {
  LOANS_COLLECTION,
  LOAN_STATUS,
  LOAN_STATUS_ORDER,
} from 'core/api/loans/loanConstants';

const makeSortStatuses = order => (a, b) =>
  order.indexOf(b) < order.indexOf(a) ? 1 : -1;

export const COLLECTION_QUERIES = {
  [LOANS_COLLECTION]: ({ organisationId, acquisitionChannel }) => ({
    query: LOANS_COLLECTION,
    params: {
      $filters: {
        'userCache.referredByOrganisationLink': organisationId,
        'userCache.acquisitionChannel': acquisitionChannel,
      },
      createdAt: 1,
      name: 1,
      status: 1,
      assigneeLinks: 1,
      $options: { sort: { createdAt: 1 } },
    },
  }),
  [INSURANCE_REQUESTS_COLLECTION]: ({
    organisationId,
    acquisitionChannel,
  }) => ({
    query: INSURANCE_REQUESTS_COLLECTION,
    params: {
      $filters: {
        'userCache.referredByOrganisationLink': organisationId,
        'userCache.acquisitionChannel': acquisitionChannel,
      },
      createdAt: 1,
      name: 1,
      status: 1,
      assigneeLinks: 1,
      $options: { sort: { createdAt: 1 } },
    },
  }),
  [INSURANCES_COLLECTION]: ({ organisationId, acquisitionChannel }) => ({
    query: INSURANCES_COLLECTION,
    params: {
      $filters: {
        'insuranceRequestCache.0.userCache.referredByOrganisationLink': organisationId,
        'insuranceRequestCache.0.userCache.acquisitionChannel': acquisitionChannel,
      },
      createdAt: 1,
      name: 1,
      status: 1,
      insuranceRequestCache: 1,
      insuranceRequest: { name: 1 },
      $options: { sort: { createdAt: 1 } },
    },
  }),
};

export const collectionStatuses = {
  [LOANS_COLLECTION]: Object.values(LOAN_STATUS)
    .filter(status => ![LOAN_STATUS.LEAD, LOAN_STATUS.TEST].includes(status))
    .sort(makeSortStatuses(LOAN_STATUS_ORDER)),
  [INSURANCE_REQUESTS_COLLECTION]: Object.values(INSURANCE_REQUEST_STATUS)
    .filter(
      status =>
        ![
          INSURANCE_REQUEST_STATUS.LEAD,
          INSURANCE_REQUEST_STATUS.TEST,
        ].includes(status),
    )
    .sort(makeSortStatuses(INSURANCE_REQUEST_STATUS_ORDER)),
  [INSURANCES_COLLECTION]: Object.values(INSURANCE_STATUS)
    .filter(status => status !== INSURANCE_STATUS.SUGGESTED)
    .sort(makeSortStatuses(INSURANCE_STATUS_ORDER)),
};
