import { Meteor } from 'meteor/meteor';
import React from 'react';
import { compose, withProps } from 'recompose';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import { removeUserFromPromotion, withSmartQuery } from '../../api';
import ConfirmMethod from '../ConfirmMethod';
import T from '../Translation';
import PromotionProgress from '../PromotionLotPage/PromotionProgress';
import PriorityOrder from '../PromotionLotPage/PriorityOrder';
import PromotionProgressHeader from './PromotionProgressHeader';
import proPromotionUsers from '../../api/promotions/queries/proPromotionUsers';
import { getPromotionCustomerOwnerType } from '../../api/promotions/promotionClientHelpers';
import { isAllowedToRemoveCustomerFromPromotion } from '../../api/security/clientSecurityHelpers';
import InvitedByAssignDropdown from './InvitedByAssignDropdown';
import { CollectionIconLink } from '../IconLink';
import { LOANS_COLLECTION } from '../../api/constants';
import { getUserNameAndOrganisation } from 'core/api/promotions/promotionClientHelpers';

const columnOptions = [
  { id: 'loanName' },
  { id: 'name' },
  { id: 'phone' },
  { id: 'email' },
  { id: 'createdAt' },
  { id: 'invitedBy' },
  { id: 'promotionProgress', label: <PromotionProgressHeader /> },
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
    promotionProgress,
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

  const invitedByUser = (invitedBy
      && promotionUsers
      && (!!promotionUsers.length
        && promotionUsers.find(({ _id }) => _id === invitedBy)))
    || 'Personne';

  const userName = getUserNameAndOrganisation({user: invitedByUser});

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
          invitedByName
        ),
    },
    {
      raw: promotionProgress.verificationStatus,
      label: <PromotionProgress promotionProgress={promotionProgress} />,
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
