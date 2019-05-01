import { compose, withProps } from 'recompose';
import proPromotion from 'core/api/promotions/queries/proPromotion';
import { withSmartQuery } from 'core/api';
import withMatchParam from 'core/containers/withMatchParam';
import {
  isAllowedToModifyPromotion,
  isAllowedToInviteCustomersToPromotion,
  isAllowedToManagePromotionDocuments,
  isAllowedToSeePromotionCustomers,
  isAllowedToAddLotsToPromotion,
  isAllowedToModifyPromotionLots,
  isAllowedToRemovePromotionLots,
} from 'core/api/security/clientSecurityHelpers';

const makePermissions = props => ({
  canModifyPromotion: isAllowedToModifyPromotion(props),
  canInviteCustomers: isAllowedToInviteCustomersToPromotion(props),
  canManageDocuments: isAllowedToManagePromotionDocuments(props),
  canSeeCustomers: isAllowedToSeePromotionCustomers(props),
  canAddLots: isAllowedToAddLotsToPromotion(props),
  canModifyLots: isAllowedToModifyPromotionLots(props),
  canRemoveLots: isAllowedToRemovePromotionLots(props),
});

export default compose(
  withMatchParam('promotionId'),
  withSmartQuery({
    query: proPromotion,
    params: ({ promotionId }) => ({ _id: promotionId }),
    queryOptions: { reactive: false, single: true },
    dataName: 'promotion',
  }),
  withProps(makePermissions),
);
