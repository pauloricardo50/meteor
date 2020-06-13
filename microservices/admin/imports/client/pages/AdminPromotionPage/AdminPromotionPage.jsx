import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import React from 'react';
import { compose, withProps } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { proPromotions } from 'core/api/promotions/queries';
import { ROLES } from 'core/api/users/userConstants';
import PromotionPage from 'core/components/PromotionPage/client';
import { withPromotionPageContext } from 'core/components/PromotionPage/client/PromotionPageContext';
import withMatchParam from 'core/containers/withMatchParam';

import ADMIN_ROUTES from '../../../startup/client/adminRoutes';

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
  promotionLoan: { name: 1 },
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

const AdminPromotionPageContainer = compose(
  withMatchParam('promotionId'),
  Component => props => <Component {...props} key={props.promotionId} />,
  withSmartQuery({
    query: proPromotions,
    params: ({ promotionId }) => ({
      _id: promotionId,
      $body: promotionFragment,
    }),
    queryOptions: { reactive: false, single: true },
    dataName: 'promotion',
  }),
  withPromotionPageContext(() => ({
    permissions: {
      canAddLots: true,
      canAddPros: true,
      canChangeTimeline: true,
      canInviteCustomers: true,
      canLinkAssignee: true,
      canLinkLender: true,
      canLinkLoan: true,
      canManageDocuments: true,
      canModifyLots: true,
      canModifyPromotion: true,
      canModifyStatus: true,
      canRemoveLots: true,
      canRemovePromotion: Roles.userIsInRole(Meteor.user(), ROLES.DEV),
      canSeeCustomers: true,
      canSeeManagement: true,
      canSeeUsers: true,
      canModifyAdminNote: true,
      canManageProUsers: true,
    },
  })),
  withProps({ route: ADMIN_ROUTES.ADMIN_PROMOTION_PAGE.path }),
);

export default AdminPromotionPageContainer(PromotionPage);
