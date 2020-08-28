import merge from 'lodash/merge';
import { compose, withProps } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { LOANS_COLLECTION, LOAN_STATUS } from 'core/api/loans/loanConstants';
import {
  ORGANISATIONS_COLLECTION,
  ORGANISATION_FEATURES,
} from 'core/api/organisations/organisationConstants';
import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';

import AdminBoard from '../../../components/AdminBoard/AdminBoard';
import SingleLoanPage from '../../SingleLoanPage';
import LoanBoardCard from './LoanBoardCard/LoanBoardCard';
import { LOAN_BOARD_GROUP_BY, NO_PROMOTION } from './loanBoardConstants';
import {
  additionalLoanBoardFields,
  columnHeaderOptions,
  groupData,
  makeClientSideFilter,
  makeOptionsSelect,
} from './loanBoardHelpers';

const defaultBody = {
  adminNotes: 1,
  assigneeLinks: 1,
  borrowers: { name: 1 },
  category: 1,
  createdAt: 1,
  customName: 1,
  financedPromotion: { name: 1, status: 1 },
  mainAssigneeLink: 1,
  name: 1,
  nextDueTask: 1,
  promotions: { name: 1, status: 1 },
  properties: { address1: 1 },
  revenues: { _id: 1, status: 1 },
  selectedLenderOrganisation: { name: 1 },
  selectedStructure: 1,
  status: 1,
  structures: { wantedLoan: 1, id: 1, propertyId: 1 },
  tasksCache: 1,
  user: { name: 1, status: 1 },
  userId: 1,
};

const getQueryBody = ({ additionalFields }) => {
  const addedFields = additionalLoanBoardFields.filter(({ id }) =>
    additionalFields.includes(id),
  );

  return addedFields.reduce(
    (newBody, { fragment }) => merge({}, newBody, fragment),
    defaultBody,
  );
};

const noPromotionIsChecked = promotionId =>
  promotionId && promotionId.$in.includes(NO_PROMOTION);

const getStatusFilter = status => {
  const { $in = [] } = status || {};
  const toIgnore = [
    LOAN_STATUS.TEST,
    LOAN_STATUS.UNSUCCESSFUL,
    LOAN_STATUS.FINALIZED,
  ];

  return {
    $nin: toIgnore.filter(s => !$in.includes(s)),
    ...status,
  };
};

const getQueryFilters = ({
  assignedEmployeeId,
  step,
  groupBy,
  status,
  promotionId,
  lenderId,
  category,
  purchaseType,
  userStatus,
}) => {
  const $or = [];

  if (groupBy === LOAN_BOARD_GROUP_BY.PROMOTION) {
    $or.push({ 'promotionLinks.0._id': { $exists: true } });
    $or.push({ 'financedPromotionLink._id': { $exists: true } });
  }

  if (promotionId) {
    $or.push({ 'promotionLinks.0._id': promotionId });
    $or.push({ 'financedPromotionLink._id': promotionId });
  }

  return {
    assigneeLinks: { $elemMatch: { _id: assignedEmployeeId } },
    step,
    $or: $or.length ? $or : undefined,
    anonymous: { $ne: true },
    status: getStatusFilter(status),
    ...(lenderId
      ? {
          lendersCache: {
            $elemMatch: { 'organisationLink._id': lenderId },
          },
        }
      : {}),
    category,
    ...(noPromotionIsChecked(promotionId)
      ? { promotionLinks: { $in: [[], null] } }
      : {}),
    purchaseType,
    'userCache.status': userStatus,
  };
};

export default compose(
  withSmartQuery({
    query: PROMOTIONS_COLLECTION,
    params: { name: 1, $options: { sort: { name: 1 } } },
    dataName: 'promotions',
    queryOptions: { shouldRefetch: () => false },
    refetchOnMethodCall: false,
  }),
  withSmartQuery({
    query: ORGANISATIONS_COLLECTION,
    params: {
      $filters: { features: ORGANISATION_FEATURES.LENDER },
      name: 1,
      $options: { sort: { name: 1 } },
    },
    dataName: 'lenders',
    refetchOnMethodCall: false,
  }),
  withProps(({ promotions, lenders, options }) => ({
    collection: LOANS_COLLECTION,
    getQueryFilters,
    getQueryBody,
    makeClientSideFilter,
    groupData,
    makeOptionsSelect,
    optionsSelectProps: { promotions, lenders },
    columnHeaderProps: {
      promotions,
      columnHeaderOptions,
      collection: LOANS_COLLECTION,
    },
    columnItemProps: {
      additionalFields: options.additionalFields,
      boardCardContent: LoanBoardCard,
    },
    modalContent: SingleLoanPage,
    getModalContentProps: ({ docId, currentUser }) => ({
      loanId: docId,
      currentUser,
      enableTabRouting: false,
    }),
  })),
)(AdminBoard);
