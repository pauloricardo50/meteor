import { compose, withProps } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import {
  INSURANCE_REQUESTS_COLLECTION,
  INSURANCE_REQUEST_STATUS,
} from 'core/api/insuranceRequests/insuranceRequestConstants';
import { insuranceRequestUpdateStatus } from 'core/api/insuranceRequests/methodDefinitions';
import {
  ORGANISATIONS_COLLECTION,
  ORGANISATION_FEATURES,
} from 'core/api/organisations/organisationConstants';

import AdminBoard from '../../../components/AdminBoard';
import SingleInsuranceRequestPage from '../../SingleInsuranceRequestPage';
import InsuranceRequestBoardCardBottom from './InsuranceRequestBoardCard/InsuranceRequestBoardCardBottom';
import {
  InsuranceRequestBoardCardContent,
  InsuranceRequestBoardCardDescription,
} from './InsuranceRequestBoardCard/InsuranceRequestBoardCardContent';
import {
  InsuranceRequestBoardCardTopLeft,
  InsuranceRequestBoardCardTopRight,
} from './InsuranceRequestBoardCard/InsuranceRequestBoardCardTop';
import {
  columnHeaderOptions,
  groupData,
  makeOptionsSelect,
} from './insuranceRequestBoardHelpers';

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
  user: { name: 1, status: 1 },
  nextDueTask: 1,
  tasksCache: 1,
  adminNotes: 1,
};

const getStatusFilter = status => {
  const { $in = [] } = status || {};
  const toIgnore = [
    INSURANCE_REQUEST_STATUS.TEST,
    INSURANCE_REQUEST_STATUS.UNSUCCESSFUL,
    INSURANCE_REQUEST_STATUS.FINALIZED,
  ];

  return {
    $nin: toIgnore.filter(s => !$in.includes(s)),
    ...status,
  };
};

const getQueryFilters = ({
  assignedEmployeeId,
  status,
  organisationId,
  userStatus,
}) => ({
  assigneeLinks: { $elemMatch: { _id: assignedEmployeeId } },
  status: getStatusFilter(status),
  ...(organisationId
    ? {
        insurancesCache: {
          $elemMatch: { 'organisationLink._id': organisationId },
        },
      }
    : {}),
  'userCache.status': userStatus,
});

export default compose(
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
  withProps(({ organisations }) => ({
    collection: INSURANCE_REQUESTS_COLLECTION,
    getQueryFilters,
    getQueryBody: () => defaultBody,
    groupData,
    makeOptionsSelect,
    optionsSelectProps: { organisations },
    columnHeaderProps: {
      organisations,
      columnHeaderOptions,
      collection: INSURANCE_REQUESTS_COLLECTION,
    },
    columnItemProps: {
      boardCardContent: {
        top: {
          left: InsuranceRequestBoardCardTopLeft,
          right: InsuranceRequestBoardCardTopRight,
          makeStatusLabelProps: ({ data }) => ({
            method: nextStatus =>
              insuranceRequestUpdateStatus.run({
                insuranceRequestId: data?._id,
                status: nextStatus,
              }),
          }),
        },
        content: {
          description: InsuranceRequestBoardCardDescription,
          content: InsuranceRequestBoardCardContent,
        },
        bottom: InsuranceRequestBoardCardBottom,
      },
    },
    modalContent: SingleInsuranceRequestPage,
    getModalContentProps: ({ docId, currentUser }) => ({
      insuranceRequestId: docId,
      currentUser,
      enableTabRouting: false,
    }),
  })),
)(AdminBoard);
