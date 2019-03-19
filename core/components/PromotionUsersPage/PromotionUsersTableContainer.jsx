import { Meteor } from 'meteor/meteor';
import React from 'react';
import { compose, withProps } from 'recompose';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import { removeUserFromPromotion, withSmartQuery } from '../../api';
import proPromotionUsers from '../../api/promotions/queries/proPromotionUsers';
import { getPromotionCustomerOwnerType } from '../../api/promotions/promotionClientHelpers';
import { getUserNameAndOrganisation } from '../../api/helpers';
import { isAllowedToRemoveCustomerFromPromotion } from '../../api/security/clientSecurityHelpers';
import { LOANS_COLLECTION } from '../../api/constants';
import LoanProgressHeader from '../LoanProgress/LoanProgressHeader';
import LoanProgress from '../LoanProgress/LoanProgress';
import PriorityOrder from '../PromotionLotPage/PriorityOrder';
import ConfirmMethod from '../ConfirmMethod';
import T from '../Translation';
import { CollectionIconLink } from '../IconLink';
import InvitedByAssignDropdown from './InvitedByAssignDropdown';

const columnOptions = [
  { id: 'loanName' },
  { id: 'name' },
  { id: 'phone' },
  { id: 'email' },
  { id: 'createdAt' },
  { id: 'invitedBy' },
  { id: 'loanProgress', label: <LoanProgressHeader /> },
  { id: 'priorityOrder' },
  { id: 'actions' },
].map(({ id, label }) => ({
  id,
  label: label || <T id={`PromotionLotLoansTable.${id}`} />,
}));

const getColumns = ({ promotionId, promotionUsers, loan, currentUser }) => {
  const {
    _id: loanId,
    name: loanName,
    user,
    loanProgress,
    promotionOptions = [],
    promotions,
    createdAt,
  } = loan;

  const promotion = promotions.find(({ _id }) => _id === promotionId);

  const {
    $metadata: { invitedBy },
  } = promotion;

  const customerOwnerType = getPromotionCustomerOwnerType({
    invitedBy,
    currentUser,
  });

  const invitedByUser = invitedBy
    && promotionUsers
    && (!!promotionUsers.length
      && promotionUsers.find(({ _id }) => _id === invitedBy));

  const userName = invitedByUser
    ? getUserNameAndOrganisation({ user: invitedByUser })
    : 'Personne';

  return [
    {
      raw: loanName,
      label:
        Meteor.microservice === 'admin' ? (
          <CollectionIconLink
            relatedDoc={{ ...loan, collection: LOANS_COLLECTION }}
          />
        ) : (
          loanName
        ),
    },
    user && user.name,
    user && user.phoneNumbers && user.phoneNumbers[0],
    user && user.email,
    { raw: createdAt.getTime(), label: moment(createdAt).fromNow() },
    {
      raw: userName,
      label:
        Meteor.microservice === 'admin' ? (
          <InvitedByAssignDropdown
            promotionUsers={promotionUsers}
            invitedBy={invitedBy}
            invitedByName={userName}
            loanId={loanId}
            promotionId={promotionId}
          />
        ) : (
          userName
        ),
    },
    {
      raw: loanProgress.verificationStatus,
      label: <LoanProgress loanProgress={loanProgress} />,
    },
    {
      raw: promotionOptions.length,
      label: (
        <PriorityOrder
          promotion={promotion}
          promotionOptions={promotionOptions}
          userId={user && user._id}
        />
      ),
    },
    isAllowedToRemoveCustomerFromPromotion({
      promotion,
      currentUser,
      customerOwnerType,
    }) ? (
      <ConfirmMethod
          method={() => removeUserFromPromotion.run({ promotionId, loanId })}
          label={<T id="general.remove" />}
          key="remove"
        />
      ) : (
        <span key="actions">-</span>
      ),
  ];
};

const makeMapLoan = ({
  promotionId,
  history,
  promotionUsers,
  currentUser = {},
}) => (loan) => {
  const { _id: loanId } = loan;

  return {
    id: loanId,
    columns: getColumns({ promotionId, promotionUsers, loan, currentUser }),
  };
};

export default compose(
  withRouter,
  withSmartQuery({
    query: proPromotionUsers,
    params: ({ promotionId }) => ({ promotionId }),
    queryOptions: { reactive: false },
    dataName: 'promotionUsers',
    smallLoader: true,
  }),
  withProps(({ loans, promotionId, history, promotionUsers, currentUser }) => ({
    rows: loans.map(makeMapLoan({
      promotionId,
      history,
      promotionUsers,
      currentUser,
    })),
    columnOptions,
  })),
);
