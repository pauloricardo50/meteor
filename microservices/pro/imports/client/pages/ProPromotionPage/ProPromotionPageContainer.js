import { compose, withProps } from 'recompose';
import { proPromotions } from 'core/api/promotions/queries';
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
import { injectPromotionMetadata } from 'core/components/PromotionPage/client/PromotionMetadata';

const makePermissions = props => ({
  canModifyPromotion: isAllowedToModifyPromotion(props),
  canInviteCustomers: isAllowedToInviteCustomersToPromotion(props),
  canManageDocuments: isAllowedToManagePromotionDocuments(props),
  canSeeCustomers: isAllowedToSeePromotionCustomers(props),
  canAddLots: isAllowedToAddLotsToPromotion(props),
  canModifyLots: isAllowedToModifyPromotionLots(props),
  canRemoveLots: isAllowedToRemovePromotionLots(props),
});

const getEnableNotifications = ({
  promotion,
  currentUser: { _id: userId },
}) => {
  const { userLinks = [], users = [] } = promotion;
  const user = userLinks.find(({ _id }) => _id === userId)
    || users.find(({ _id }) => _id === userId);

  return user.enableNotifications || user.$metadata.enableNotifications;
};

export default compose(
  withMatchParam('promotionId'),
  withSmartQuery({
    query: proPromotions,
    params: ({ promotionId }) => ({ _id: promotionId }),
    queryOptions: { single: true },
    dataName: 'promotion',
  }),
  withProps(makePermissions),
  injectPromotionMetadata(props => ({
    enableNotifications: getEnableNotifications(props),
    permissions: makePermissions(props),
  })),
);
