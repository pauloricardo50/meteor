import React from 'react';
import { compose, withProps } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { proPromotions } from 'core/api/promotions/queries';
import {
  isAllowedToAddLotsToPromotion,
  isAllowedToInviteCustomersToPromotion,
  isAllowedToManagePromotionDocuments,
  isAllowedToModifyPromotion,
  isAllowedToModifyPromotionLots,
  isAllowedToRemovePromotionLots,
  isAllowedToSeeManagement,
  isAllowedToSeePromotionCustomers,
} from 'core/api/security/clientSecurityHelpers';
import PromotionPage from 'core/components/PromotionPage/client';
import { injectPromotionMetadata } from 'core/components/PromotionPage/client/PromotionMetadata';
import withMatchParam from 'core/containers/withMatchParam';

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
  Component => props => <Component {...props} key={props.promotionId} />,
  withSmartQuery({
    query: proPromotions,
    params: ({ promotionId }) => ({ _id: promotionId }),
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
