import { compose, withProps, mapProps } from 'recompose';
import { withSmartQuery } from 'core/api/containerToolkit';
import { adminUsers } from 'core/api/users/queries';
import {
  ORGANISATION_FEATURES,
  ROLES,
  INSURANCE_REQUEST_STATUS,
  INSURANCE_REQUESTS_COLLECTION,
} from 'core/api/constants';
import { adminOrganisations } from 'core/api/organisations/queries';
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
  }),
  withProps(({ refetch }) => ({ refetchInsuranceRequests: refetch })),
  withSmartQuery({
    query: adminUsers,
    params: { $body: { firstName: 1 }, roles: [ROLES.ADMIN, ROLES.DEV] },
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
    query: adminOrganisations,
    params: { $body: { name: 1 }, features: ORGANISATION_FEATURES.INSURANCE },
    dataName: 'organisations',
    queryOptions: { shouldRefetch: () => false },
    refetchOnMethodCall: false,
  }),
  mapProps(({ insuranceRequests, ...rest }) => ({
    data: groupInsuranceRequests({ insuranceRequests, ...rest }),
    ...rest,
  })),
);
