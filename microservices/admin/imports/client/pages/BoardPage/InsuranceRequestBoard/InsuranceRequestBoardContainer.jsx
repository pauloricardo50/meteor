import { compose, mapProps, withProps } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import {
  INSURANCE_REQUESTS_COLLECTION,
  INSURANCE_REQUEST_STATUS,
} from 'core/api/insuranceRequests/insuranceRequestConstants';
import {
  ORGANISATIONS_COLLECTION,
  ORGANISATION_FEATURES,
} from 'core/api/organisations/organisationConstants';
import { ROLES, USERS_COLLECTION } from 'core/api/users/userConstants';

import { groupInsuranceRequests } from './insuranceRequestBoardHelpers';

const defaultBody = {
  name: 1,
  customName: 1,
  status: 1,
  assigneeLinks: 1,
  insurances: {
    name: 1,
    status: 1,
    organisation: { logo: 1 },
    insuranceProduct: { name: 1 },
    insuranceRequest: { name: 1, user: { name: 1 } },
    borrower: { name: 1 },
  },
  mainAssigneeLink: 1,
  user: { name: 1 },
  nextDueTask: 1,
  tasksCache: 1,
  adminNotes: 1,
};

const getQueryFilters = ({ assignedEmployeeId, status, organisationId }) => ({
  assigneeLinks: { $elemMatch: { _id: assignedEmployeeId } },
  status: {
    $nin: [
      INSURANCE_REQUEST_STATUS.TEST,
      INSURANCE_REQUEST_STATUS.UNSUCCESSFUL,
    ],
    ...status,
  },
  ...(organisationId
    ? {
        insurancesCache: {
          $elemMatch: { 'organisationLink._id': organisationId },
        },
      }
    : {}),
});

export default compose(
  withSmartQuery({
    query: INSURANCE_REQUESTS_COLLECTION,
    params: ({ options }) => ({
      $filters: getQueryFilters(options),
      ...defaultBody,
    }),
    dataName: 'insuranceRequests',
    queryOptions: { pollingMs: 5000 },
    deps: ({ options }) => Object.values(options),
  }),
  withProps(({ refetch }) => ({ refetchInsuranceRequests: refetch })),
  withSmartQuery({
    query: USERS_COLLECTION,
    params: {
      $filters: { 'roles._id': ROLES.ADVISOR },
      firstName: 1,
      roles: 1,
      $options: { sort: { firstName: 1 } },
    },
    dataName: 'admins',
    queryOptions: { shouldRefetch: () => false },
    refetchOnMethodCall: false,
  }),
  mapProps(({ admins, ...rest }) => ({
    devAndAdmins: admins,
    admins: admins.filter(({ roles }) => roles.includes(ROLES.ADMIN)),
    devs: admins.filter(({ roles }) => roles.includes(ROLES.DEV)),
    ...rest,
  })),
  withSmartQuery({
    query: ORGANISATIONS_COLLECTION,
    params: {
      $filters: { features: ORGANISATION_FEATURES.INSURANCE },
      name: 1,
      $options: { sort: { name: 1 } },
    },
    dataName: 'organisations',
    queryOptions: { shouldRefetch: () => false },
    refetchOnMethodCall: false,
  }),
  mapProps(({ insuranceRequests, ...rest }) => ({
    data: groupInsuranceRequests({ insuranceRequests, ...rest }),
    ...rest,
  })),
);
