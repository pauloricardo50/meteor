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
  status: 1,
  assigneeLinks: 1,
  insurances: {
    name: 1,
    status: 1,
    organisation: { logo: 1 },
    insuranceProduct: { name: 1 },
  },
  mainAssigneeLink: 1,
  user: { name: 1 },
};

const getQueryFilters = ({ assignedEmployeeId, status }) => ({
  assigneeLinks: { $elemMatch: { _id: assignedEmployeeId } },
  status: {
    $nin: [
      INSURANCE_REQUEST_STATUS.TEST,
      INSURANCE_REQUEST_STATUS.UNSUCCESSFUL,
    ],
    ...status,
  },
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
    params: { $body: { name: 1 }, features: ORGANISATION_FEATURES.LENDER },
    dataName: 'lenders',
    queryOptions: { shouldRefetch: () => false },
    refetchOnMethodCall: false,
  }),
  mapProps(({ insuranceRequests, ...rest }) => {
    console.log('insuranceRequests:', insuranceRequests);

    return {
      data: groupInsuranceRequests({ insuranceRequests, ...rest }),
      ...rest,
    };
  }),
);
