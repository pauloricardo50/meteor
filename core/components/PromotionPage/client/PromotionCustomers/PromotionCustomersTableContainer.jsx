import { Meteor } from 'meteor/meteor';

import React, { useState } from 'react';
import moment from 'moment';
import { withProps } from 'recompose';

import {
  LOANS_COLLECTION,
  LOAN_STATUS,
} from '../../../../api/loans/loanConstants';
import { proPromotionLoans } from '../../../../api/loans/queries';
import { getPromotionCustomerOwnerType } from '../../../../api/promotions/promotionClientHelpers';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import StatusLabel from '../../../StatusLabel';
import T from '../../../Translation';
import PromotionCustomer from '../PromotionCustomer';
import PriorityOrder from '../PromotionLotDetail/PromotionLotLoansTable/PriorityOrder';
import InvitedByAssignDropdown from './InvitedByAssignDropdown';
import PromotionCustomersTableActions from './PromotionCustomersTableActions';

const isAdmin = Meteor.microservice === 'admin';

const getColumns = ({ currentUser, promotion: { promotionLots = [] } }) => [
  {
    Header: <T id="PromotionCustomersTable.customer" />,
    accessor: 'userCache.lastName',
    Cell: ({ row: { original: loan } }) => (
      <PromotionCustomer
        user={loan.user}
        invitedBy={loan.promotions[0].$metadata?.invitedBy}
      />
    ),
  },
  {
    Header: <T id="Forms.status" />,
    accessor: 'status',
    Cell: ({ value: status }) => (
      <StatusLabel status={status} collection={LOANS_COLLECTION} />
    ),
  },
  {
    Header: <T id="PromotionCustomersTable.invitedBy" />,
    accessor: 'promotionLinks.0.invitedBy',
    Cell: ({ row: { original: loan } }) => (
      <InvitedByAssignDropdown
        invitedBy={loan.promotionInvitedBy}
        loanId={loan._id}
      />
    ),
  },
  {
    Header: <T id="PromotionCustomersTable.createdAt" />,
    accessor: 'createdAt',
    Cell: ({ value: createdAt }) => moment(createdAt).fromNow(),
  },
  {
    Header: <T id="PromotionCustomersTable.priorityOrder" />,
    accessor: 'promotionLinks.0.priorityOrder.0',
    Cell: ({ row: { original: loan } }) => (
      <PriorityOrder
        promotionOptions={loan.promotionOptions}
        loanId={loan._id}
      />
    ),
  },
  {
    Header: <T id="PromotionCustomersTable.actions" />,
    accessor: '_id',
    Cell: ({ row: { original: loan } }) => (
      <PromotionCustomersTableActions
        promotion={{ ...loan?.promotions[0], promotionLots }}
        currentUser={currentUser}
        customerOwnerType={getPromotionCustomerOwnerType({
          invitedBy: loan.promotions[0]?.$metadata?.invitedBy,
          currentUser,
        })}
        loan={loan}
      />
    ),
    disableSortBy: true,
  },
];

export default withProps(({ promotion }) => {
  const currentUser = useCurrentUser();
  const { _id: promotionId } = promotion;
  const [status, setStatus] = useState({
    $in: Object.values(LOAN_STATUS).filter(
      s => s !== LOAN_STATUS.UNSUCCESSFUL && s !== LOAN_STATUS.TEST,
    ),
  });
  const [invitedBy, setInvitedBy] = useState(null);

  const queryConfig = {
    query: proPromotionLoans,
    params: {
      promotionId,
      status,
      invitedBy,
      $body: {
        createdAt: 1,
        name: 1,
        promotionLinks: 1,
        userCache: 1,
        status: 1,
        promotionInvitedBy: 1,
        promotions: { status: 1, users: { _id: 1 } },
        promotionOptions: {
          name: 1,
          priorityOrder: 1,
          promotionLots: { attributedToLink: 1 },
        },
        user: {
          name: 1,
          phoneNumbers: 1,
          email: 1,
          assignedEmployee: { name: 1, phoneNumbers: 1, email: 1 },
          status: 1,
        },
      },
    },
  };

  const queryDeps = [status, promotionId, invitedBy];
  const columns = getColumns({ currentUser, promotion });
  const initialHiddenColumns = isAdmin ? [] : ['promotionLinks.0.invitedBy'];

  return {
    status,
    setStatus,
    invitedBy,
    setInvitedBy,
    currentUser,
    dataTableProps: {
      queryConfig,
      queryDeps,
      columns,
      initialHiddenColumns,
    },
  };
});
