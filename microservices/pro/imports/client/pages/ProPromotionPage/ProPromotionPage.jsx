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
import { withPromotionPageContext } from 'core/components/PromotionPage/client/PromotionPageContext';
import withMatchParam from 'core/containers/withMatchParam';

import PRO_ROUTES from '../../../startup/client/proRoutes';

const promotionFragment = {
  address: 1,
  address1: 1,
  agreementDuration: 1,
  assignedEmployee: { name: 1 },
  authorizationStatus: 1,
  canton: 1,
  city: 1,
  constructionTimeline: 1,
  contacts: 1,
  country: 1,
  description: 1,
  documents: 1,
  externalUrl: 1,
  isTest: 1,
  loanCount: 1,
  name: 1,
  projectStatus: 1,
  promotionLoan: { name: 1, proNotes: 1 },
  promotionLotGroups: 1,
  promotionLotLinks: 1,
  signingDate: 1,
  status: 1,
  type: 1,
  users: {
    email: 1,
    name: 1,
    organisations: { name: 1 },
    phoneNumbers: 1,
    roles: 1,
  },
  zipCode: 1,
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

const getProUser = ({ promotion, currentUser: { _id: userId } }) => {
  const { userLinks = [], users = [] } = promotion;
  return (
    userLinks.find(({ _id }) => _id === userId) ||
    users.find(({ _id }) => _id === userId)
  );
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
  withPromotionPageContext(props => {
    const proUser = getProUser(props);
    const enableNotifications = proUser?.$metadata?.enableNotifications;
    return {
      enableNotifications,
      permissions: makePermissions(props),
      proUser: getProUser(props),
    };
  }),
  withProps({ route: PRO_ROUTES.PRO_PROMOTION_PAGE.path }),
);

export default ProPromotionPageContainer(PromotionPage);
