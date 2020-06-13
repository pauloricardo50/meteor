import React from 'react';
import pick from 'lodash/pick';
import { compose, withProps } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { proPromotion } from 'core/api/fragments';
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
import { withPromotionPageContext } from 'core/components/PromotionPage/client/PromotionPageContext';
import withMatchParam from 'core/containers/withMatchParam';

import PRO_ROUTES from '../../../startup/client/proRoutes';

const promotionFragment = {
  ...pick(proPromotion(), [
    'address',
    'address1',
    'agreementDuration',
    'canton',
    'city',
    'constructionTimeline',
    'contacts',
    'documents',
    'lenderOrganisation',
    'name',
    'status',
    'type',
    'users',
    'zipCode',
    'signingDate',
    'country',
    'promotionLotGroups',
    'assignedEmployee',
    'description',
    'externalUrl',
    'promotionLoan',
    'authorizationStatus',
    'projectStatus',
    'isTest',
    'loans',
  ]),
  promotionLots: {
    status: 1,
    name: 1,
    value: 1,
    properties: {
      landValue: 1,
      constructionValue: 1,
      additionalMargin: 1,
      value: 1,
    },
    lots: { value: 1 },
    promotionLotGroupIds: 1,
  },
};

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
    params: ({ promotionId }) => ({
      _id: promotionId,
      $body: promotionFragment,
    }),
    queryOptions: { single: true },
    dataName: 'promotion',
  }),
  withPromotionPageContext(props => ({
    enableNotifications: getEnableNotifications(props),
    permissions: makePermissions(props),
  })),
  withProps({ route: PRO_ROUTES.PRO_PROMOTION_PAGE.path }),
);

export default ProPromotionPageContainer(PromotionPage);
