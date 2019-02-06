import { Meteor } from 'meteor/meteor';
import uniqWith from 'lodash/uniqWith';
import isEqual from 'lodash/isEqual';
import { PROMOTION_PERMISSIONS } from './promotionConstants';

const getAllOrganisationsUserIds = organisations =>
  uniqWith(
    organisations.reduce((userIds, organisation) => {
      const { users = [] } = organisation;
      const orgUserIds = users.map(({ _id }) => _id);
      return [...userIds, ...orgUserIds];
    }, []),
    isEqual,
  );

export const getCurrentUserPermissionsForPromotion = ({
  currentUser = {},
  promotionId,
}) => {
  const { promotions = [] } = currentUser;
  const promotion = promotions.find(({ _id }) => _id === promotionId);
  return promotion && promotion.$metadata.permissions;
};

export const shouldAnonymize = ({
  currentUser = {},
  permissions = {},
  invitedBy,
  lotStatus,
}) => {
  const { organisations = [], _id: userId } = currentUser;

  const {
    canViewPromotion,
    canSeeCustomers,
    displayCustomerNames,
  } = permissions;

  if (!canViewPromotion || !canSeeCustomers || !invitedBy) {
    return true;
  }

  const shouldHideForLotStatus = !!lotStatus && !displayCustomerNames.forLotStatus.includes(lotStatus);

  switch (displayCustomerNames.invitedBy) {
  case PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.INVITED_BY.ANY:
    return shouldHideForLotStatus;
  case PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.INVITED_BY.USER:
    return shouldHideForLotStatus || invitedBy !== userId;
  case PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.INVITED_BY.ORGANISATION:
    return (
      shouldHideForLotStatus
        || !getAllOrganisationsUserIds(organisations).includes(invitedBy)
    );
  default:
    return true;
  }
};
