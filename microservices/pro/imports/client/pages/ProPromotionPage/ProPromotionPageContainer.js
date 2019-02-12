import { compose, withProps } from 'recompose';
import proPromotion from 'core/api/promotions/queries/proPromotion';
import promotionFiles from 'core/api/promotions/queries/promotionFiles';
import { withSmartQuery } from 'core/api';
import withMatchParam from 'core/containers/withMatchParam';
import mergeFilesWithQuery from 'core/api/files/mergeFilesWithQuery';
import {
  isAllowedToModifyPromotion,
  isAllowedToInviteCustomersToPromotion,
  isAllowedToManagePromotionDocuments,
  isAllowedToSeePromotionCustomers,
  isAllowedToAddLotsToPromotion,
  isAllowedToModifyPromotionLots,
  isAllowedToRemovePromotionLots
} from 'core/api/security/clientSecurityHelpers';

const makePermissions = ({ currentUser, promotion }) => ({
  canModifyPromotion: isAllowedToModifyPromotion({ promotion, currentUser }),
  canInviteCustomers: isAllowedToInviteCustomersToPromotion({
    promotion,
    currentUser,
  }),
  canManageDocuments: isAllowedToManagePromotionDocuments({
    promotion,
    currentUser,
  }),
  canSeeCustomers: isAllowedToSeePromotionCustomers({ promotion, currentUser }),
  canAddLots: isAllowedToAddLotsToPromotion({ promotion, currentUser }),
  canModifyLots: isAllowedToModifyPromotionLots({promotion, currentUser}),
  canRemoveLots: isAllowedToRemovePromotionLots({promotion, currentUser}),
});

export default compose(
  withMatchParam('promotionId'),
  withSmartQuery({
    query: proPromotion,
    params: ({ promotionId }) => ({ promotionId }),
    queryOptions: { reactive: false, single: true },
    dataName: 'promotion',
  }),
  mergeFilesWithQuery(
    promotionFiles,
    ({ promotion: { _id: promotionId } }) => ({ promotionId }),
    'promotion',
  ),
  withProps(({ currentUser, promotion }) => ({
    ...makePermissions({ currentUser, promotion }),
  })),
);
