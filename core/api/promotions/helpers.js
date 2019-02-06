import { Meteor } from 'meteor/meteor';
import uniqWith from 'lodash/uniqWith';
import isEqual from 'lodash/isEqual';
import { PROMOTION_PERMISSIONS } from './promotionConstants';

const ANONYMITED_STRING = '******';

const getAllOrganisationsUserIds = organisations =>
  uniqWith(
    organisations.reduce((userIds, organisation) => {
      const { users = [] } = organisation;
      const orgUserIds = users.map(({ _id }) => _id);
      return [...userIds, ...orgUserIds];
    }, []),
    isEqual,
  );

const anonymizeUser = user => ({
  _id: user._id,
  createdAt: user.createdAt,
  name: ANONYMITED_STRING,
  email: ANONYMITED_STRING,
  phoneNumbers: [ANONYMITED_STRING],
});

// const anonymizeLoan = (loan) => {
//   const { user, ...rest } = loan;
//   return {
//     user: anonymizeUser(user),
//     ...rest,
//   };
// };

// const anonimizePromotionOption = (promotionOption) => {
//   const { loan, custom, ...promotionOptionRest } = promotionOption;
//   const { user, ...loanRest } = loan;
// };

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

// export const promotionOptionsAnonimization = ({
//   currentUser,
//   promotionOptions,
//   promotionId,
//   promotionLot,
// }) => {
//   const { organisations = [], promotions = [], userId } = currentUser;
//   const promotion = promotions.find(({ _id }) => _id === promotionId);
//   const permissions = promotion && promotion.$metadata.permissions;
//   const organisationUserIds = getAllOrganisationsUserIds(organisations);
//   const { status } = promotionLot;
//   const {
//     canViewPromotion,
//     canSeeCustomers,
//     displayCustomerNames,
//   } = permissions;

//   if (!canViewPromotion || !canSeeCustomers) {
//     return [];
//   }

//   return customers.map((customer) => {});
// };
