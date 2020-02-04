//      
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
  isAllowedToSeeManagement,
} from 'core/api/security/clientSecurityHelpers';
import { injectPromotionMetadata } from 'core/components/PromotionPage/client/PromotionMetadata';
import PromotionPage from 'core/components/PromotionPage/client';
import PRO_ROUTES from '../../../startup/client/proRoutes';

const makePermissions = props => ({
  canModifyPromotion: isAllowedToModifyPromotion(props),
  canInviteCustomers: isAllowedToInviteCustomersToPromotion(props),
  canManageDocuments: isAllowedToManagePromotionDocuments(props),
  canSeeCustomers: isAllowedToSeePromotionCustomers(props),
  canAddLots: isAllowedToAddLotsToPromotion(props),
  canModifyLots: isAllowedToModifyPromotionLots(props),
  canRemoveLots: isAllowedToRemovePromotionLots(props),
  canSeeManagement: isAllowedToSeeManagement(props),
  canModifyAdminNote: false,
  canSeeUsers: true,
});

const getEnableNotifications = ({
  promotion,
  currentUser: { _id: userId },
}) => {
  const { userLinks = [], users = [] } = promotion;
  const user =
    userLinks.find(({ _id }) => _id === userId) ||
    users.find(({ _id }) => _id === userId);

  return user.enableNotifications || user.$metadata.enableNotifications;
};

const ProPromotionPageContainer = compose(
  withMatchParam('promotionId'),
  withSmartQuery({
    query: proPromotions,
    params: ({ promotionId }) => ({
      _id: promotionId,
    }),
    queryOptions: { single: true },
    dataName: 'promotion',
  }),
  withProps(makePermissions),
  withProps({ route: PRO_ROUTES.PRO_PROMOTION_PAGE.path }),
  injectPromotionMetadata(props => ({
    enableNotifications: getEnableNotifications(props),
    permissions: makePermissions(props),
  })),
);

export default ProPromotionPageContainer(PromotionPage);
