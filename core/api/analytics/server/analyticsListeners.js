import PropertyService from '../../properties/server/PropertyService';
import PromotionService from '../../promotions/server/PromotionService';
import { ROLES } from '../../users/userConstants';
import {
  anonymousCreateUser,
  proInviteUser,
  adminCreateUser,
} from '../../users/methodDefinitions';
import OrganisationService from '../../organisations/server/OrganisationService';
import { PROPERTY_CATEGORY } from '../../properties/propertyConstants';
import SessionService from '../../sessions/server/SessionService';
import {
  loanSetStatus,
  loanInsertBorrowers,
  setMaxPropertyValueWithoutBorrowRatio,
  anonymousLoanInsert,
} from '../../loans/methodDefinitions';
import { followImpersonatedSession } from '../../sessions/methodDefinitions';
import LoanService from '../../loans/server/LoanService';
import UserService from '../../users/server/UserService';
import ServerEventService from '../../events/server/ServerEventService';
import EVENTS from '../events';
import Analytics from './Analytics';
import {
  analyticsLogin,
  analyticsPage,
  analyticsVerifyEmail,
  analyticsCTA,
} from '../methodDefinitions';

ServerEventService.addAfterMethodListener(
  loanSetStatus,
  ({ context, result: { prevStatus, nextStatus }, params: { loanId } }) => {
    const { userId: adminId } = context;
    let referredByOrganisation;
    let referredByUser;
    let assigneeId;
    let assigneeName;
    let customerName;
    const {
      userId: customerId,
      category: loanCategory,
      name: loanName,
      purchaseType: loanPurchaseType,
      residenceType: loanResidenceType,
      step: loanStep,
    } = LoanService.fetchOne({
      $filters: { _id: loanId },
      userId: 1,
      category: 1,
      name: 1,
      purchaseType: 1,
      residenceType: 1,
      step: 1,
    });
    const { name: adminName } = UserService.fetchOne({
      $filters: { _id: adminId },
      name: 1,
    });
    if (customerId) {
      const user = UserService.fetchOne({
        $filters: { _id: customerId },
        referredByUser: { name: 1 },
        referredByOrganisation: { name: 1 },
        assignedEmployee: { name: 1 },
        name: 1,
      });
      assigneeId = user.assignedEmployee && user.assignedEmployee._id;
      assigneeName = user.assignedEmployee && user.assignedEmployee.name;
      referredByOrganisation = user.referredByOrganisation && user.referredByOrganisation.name;
      referredByUser = user.referredByUser && user.referredByUser.name;
      customerName = user.name;
    }

    const analytics = new Analytics(context);
    analytics.track(EVENTS.LOAN_STATUS_CHANGED, {
      adminId,
      adminName,
      assigneeId,
      assigneeName,
      customerId,
      customerName,
      loanCategory,
      loanId,
      loanName,
      loanPurchaseType,
      loanResidenceType,
      loanStep,
      nextStatus,
      prevStatus,
      referredByOrganisation,
      referredByUser,
    });
  },
);

ServerEventService.addAfterMethodListener(
  followImpersonatedSession,
  ({ context, params: { connectionId } }) => {
    const { impersonatingAdmin: admin } = SessionService.fetchOne({
      $filters: { connectionId },
      impersonatingAdmin: { name: 1 },
    });

    const analytics = new Analytics(context);
    analytics.track(EVENTS.USER_FOLLOWED_IMPERSONATING_ADMIN, {
      adminId: admin._id,
      adminName: admin.name,
    });
  },
);

ServerEventService.addAfterMethodListener(analyticsLogin, ({ context }) => {
  const analytics = new Analytics(context);
  analytics.identify();
  analytics.track(EVENTS.USER_LOGGED_IN);
});

ServerEventService.addAfterMethodListener(
  analyticsPage,
  ({ context, params }) => {
    const analytics = new Analytics(context);
    analytics.page(params);
  },
);

ServerEventService.addAfterMethodListener(
  analyticsVerifyEmail,
  ({ context, params: { trackingId } }) => {
    const analytics = new Analytics(context);
    analytics.identify(trackingId);
    analytics.track(EVENTS.USER_VERIFIED_EMAIL);
  },
);

ServerEventService.addAfterMethodListener(
  analyticsCTA,
  ({ context, params }) => {
    const analytics = new Analytics(context);
    analytics.cta(params);
  },
);

ServerEventService.addAfterMethodListener(
  setMaxPropertyValueWithoutBorrowRatio,
  ({ context, params }) => {
    const analytics = new Analytics(context);

    const { loanId } = params;
    const loan = LoanService.fetchOne({
      $filters: { _id: loanId },
      maxPropertyValue: 1,
      properties: { value: 1, category: 1 },
      hasProProperty: 1,
      hasPromotion: 1,
      anonymous: 1,
      promotions: { _id: 1 },
    });
    const {
      maxPropertyValue = {},
      properties = [],
      hasProProperty,
      anonymous,
      promotions = [],
      hasPromotion,
    } = loan;
    const { canton, main = {}, second = {}, type } = maxPropertyValue;
    const {
      min: {
        borrowRatio: mainMinBorrowRatio,
        propertyValue: mainMinPropertyValue,
        organisationName: mainMinOrganisationName,
      } = {},
      max: {
        borrowRatio: mainMaxBorrowRatio,
        propertyValue: mainMaxPropertyValue,
        organisationName: mainMaxOrganisationName,
      } = {},
    } = main;
    const {
      min: {
        borrowRatio: secondMinBorrowRatio,
        propertyValue: secondMinPropertyValue,
        organisationName: secondMinOrganisationName,
      } = {},
      max: {
        borrowRatio: secondMaxBorrowRatio,
        propertyValue: secondMaxPropertyValue,
        organisationName: secondMaxOrganisationName,
      } = {},
    } = second;

    let property = {};
    if (hasProProperty) {
      property = properties.find(({ category }) => category === PROPERTY_CATEGORY.PRO);
    }

    let promotion = {};
    if (hasPromotion) {
      promotion = promotions[0];
    }

    analytics.track(EVENTS.LOAN_MAX_PROPERTY_VALUE_CALCULATED, {
      loanId,
      canton,
      type,
      anonymous,
      proPropertyValue: property.value,
      proProperty: property._id,
      mainMinBorrowRatio,
      mainMaxBorrowRatio,
      mainMinPropertyValue,
      mainMaxPropertyValue,
      mainMinOrganisationName,
      mainMaxOrganisationName,
      secondMinBorrowRatio,
      secondMaxBorrowRatio,
      secondMinPropertyValue,
      secondMaxPropertyValue,
      secondMinOrganisationName,
      secondMaxOrganisationName,
      promotion: promotion._id,
    });
  },
);

ServerEventService.addAfterMethodListener(
  loanInsertBorrowers,
  ({ context, params }) => {
    const analytics = new Analytics(context);
    const { loanId, amount } = params;

    const loan = LoanService.fetchOne({
      $filters: { _id: loanId },
      maxPropertyValue: 1,
      properties: { value: 1, category: 1 },
      hasProProperty: 1,
      hasPromotion: 1,
      anonymous: 1,
    });
    const {
      properties = [],
      hasProProperty,
      anonymous,
      promotions = [],
      hasPromotion,
    } = loan;

    let property = {};
    if (hasProProperty) {
      property = properties.find(({ category }) => category === PROPERTY_CATEGORY.PRO);
    }

    let promotion = {};
    if (hasPromotion) {
      promotion = promotions[0];
    }

    analytics.track(EVENTS.LOAN_BORROWERS_INSERTED, {
      loanId,
      amount,
      anonymous,
      proProperty: property,
      promotion,
    });
  },
);

ServerEventService.addAfterMethodListener(
  anonymousLoanInsert,
  ({
    context,
    params: { proPropertyId, referralId, trackingId },
    result: loanId,
  }) => {
    const analytics = new Analytics(context);
    analytics.track(
      EVENTS.LOAN_CREATED,
      {
        loanId,
        propertyId: proPropertyId,
        referralId,
        anonymous: true,
      },
      trackingId,
    );
  },
);

ServerEventService.addAfterMethodListener(
  anonymousCreateUser,
  ({
    context,
    params: { trackingId, referralId, loanId, ctaId },
    result: userId,
  }) => {
    const analytics = new Analytics({ ...context, userId });

    let referralUser;
    let referralOrg;

    if (referralId) {
      referralUser = UserService.fetchOne({
        $filters: { _id: referralId, roles: { $in: [ROLES.PRO] } },
      });
      referralOrg = OrganisationService.fetchOne({
        $filters: {
          _id: referralId,
        },
      });
    }

    const referralUserMainOrg = referralId
      && !referralOrg
      && UserService.getUserMainOrganisation(referralId);

    analytics.identify(trackingId);
    analytics.track(EVENTS.USER_CREATED, {
      userId,
      origin: 'user',
      referralId: referralUser ? referralId : undefined,
      orgReferralId: referralOrg
        ? referralId
        : referralUserMainOrg && referralUserMainOrg._id,
      ctaId,
    });
    if (loanId) {
      analytics.track(EVENTS.LOAN_ANONYMOUS_LOAN_CLAIMED, {
        loanId,
      });
    }
  },
);

ServerEventService.addAfterMethodListener(
  proInviteUser,
  async ({
    context,
    params: { user, propertyIds = [], promotionIds = [], properties = [] },
    result: { userId: customerId, isNewUser = false },
  }) => {
    const analytics = new Analytics(context);
    const { userId } = context;
    const {
      firstName,
      lastName,
      email,
      promotionLotIds = [],
      showAllLots = false,
    } = user;

    const { name: pro } = UserService.fetchOne({
      $filters: { _id: userId },
      name: 1,
    });
    const { name: org, _id: orgId } = UserService.getUserMainOrganisation(userId);

    const referOnly = propertyIds.length === 0
      && promotionIds.length === 0
      && properties.length === 0;

    if (referOnly) {
      analytics.track(EVENTS.PRO_INVITED_CUSTOMER, {
        customerId,
        customerName: `${firstName} ${lastName}`,
        customerEmail: email,
        proId: userId,
        proName: pro,
        proOrganisation: org,
        referOnly,
      });
    }

    if (propertyIds.length) {
      await Promise.all(propertyIds.map((propertyId) => {
        const { address } = PropertyService.fetchOne({
          $filters: { _id: propertyId },
          address: 1,
        });

        return analytics.track(EVENTS.PRO_INVITED_CUSTOMER, {
          customerId,
          customerName: `${firstName} ${lastName}`,
          customerEmail: email,
          proId: userId,
          proName: pro,
          proOrganisation: org,
          propertyId,
          propertyAddress: address,
          referOnly,
        });
      }));
    }

    if (promotionIds.length) {
      await Promise.all(promotionIds.map((promotionId) => {
        const { name } = PromotionService.fetchOne({
          $filters: { _id: promotionId },
          name: 1,
        });

        return analytics.track(EVENTS.PRO_INVITED_CUSTOMER, {
          customerId,
          customerName: `${firstName} ${lastName}`,
          customerEmail: email,
          proId: userId,
          proName: pro,
          proOrganisation: org,
          promotionId,
          promotionName: name,
          promotionLotIds,
          showAllLots,
          referOnly,
        });
      }));
    }

    if (properties.length) {
      await Promise.all(properties.map((property) => {
        const { address, _id: propertyId } = PropertyService.fetchOne({
          $filters: { externalId: property.externalId },
          address: 1,
        });

        return analytics.track(EVENTS.PRO_INVITED_CUSTOMER, {
          customerId,
          customerName: `${firstName} ${lastName}`,
          customerEmail: email,
          proId: userId,
          proName: pro,
          proOrganisation: org,
          propertyId,
          propertyAddress: address,
          referOnly,
        });
      }));
    }

    if (isNewUser) {
      analytics.track(EVENTS.USER_CREATED, {
        userId: customerId,
        origin: 'pro',
        referralId: userId,
        orgReferralId: orgId,
      });
    }
  },
);

ServerEventService.addAfterMethodListener(
  adminCreateUser,
  ({ context, result: userId }) => {
    const analytics = new Analytics(context);

    analytics.track(EVENTS.USER_CREATED, {
      userId,
      origin: 'admin',
    });
  },
);
