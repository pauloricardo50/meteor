import PropertyService from '../../properties/server/PropertyService';
import PromotionService from '../../promotions/server/PromotionService';
import {
  anonymousCreateUser,
  proInviteUser,
  adminCreateUser,
  proInviteUserToOrganisation,
} from '../../users/methodDefinitions';
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
  [proInviteUser, proInviteUserToOrganisation, adminCreateUser],
  ({ context, params, result, config: { name: methodName } }) => {
    context.unblock();
    let userId;
    let isNewUser = false;

    if (typeof result === 'object') {
      userId = result.userId;
      isNewUser = result.isNewUser;
    } else {
      userId = result;
      isNewUser = true;
    }

    if (isNewUser) {
      const user = UserService.fetchOne({
        $filters: { _id: userId },
        referredByUser: { _id: 1 },
        referredByOrganisation: { _id: 1 },
        assignedEmployee: { _id: 1 },
      });

      const {
        referredByUser: { _id: proId } = {},
        referredByOrganisation: { _id: orgId } = {},
        assignedEmployee: { _id: adminId } = {},
      } = user;

      const analytics = new Analytics(context);
      let origin;

      if (methodName.includes('pro')) {
        origin = 'pro';
      } else if (methodName.includes('admin')) {
        origin = 'admin';
      }

      analytics.createAnalyticsUser(userId, {
        userId,
        origin,
        referralId: proId,
        orgReferralId: orgId,
        adminId,
      });
    }
  },
);

ServerEventService.addAfterMethodListener(
  loanSetStatus,
  ({ context, result: { prevStatus, nextStatus }, params: { loanId } }) => {
    context.unblock();
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
      referredByOrganisation =
        user.referredByOrganisation && user.referredByOrganisation.name;
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
    context.unblock();
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
  context.unblock();
  const analytics = new Analytics(context);
  analytics.identify();
  analytics.track(EVENTS.USER_LOGGED_IN);
});

ServerEventService.addAfterMethodListener(
  analyticsPage,
  ({ context, params }) => {
    context.unblock();
    const analytics = new Analytics(context);
    analytics.page(params);
  },
);

ServerEventService.addAfterMethodListener(
  analyticsVerifyEmail,
  ({ context, params: { trackingId } }) => {
    context.unblock();
    const analytics = new Analytics(context);
    analytics.identify(trackingId);
    analytics.track(EVENTS.USER_VERIFIED_EMAIL);
  },
);

ServerEventService.addAfterMethodListener(
  analyticsCTA,
  ({ context, params }) => {
    context.unblock();
    const analytics = new Analytics(context);
    analytics.cta(params);
  },
);

ServerEventService.addAfterMethodListener(
  setMaxPropertyValueWithoutBorrowRatio,
  ({ context, params }) => {
    context.unblock();
    const analytics = new Analytics(context);

    const { loanId } = params;
    const loan = LoanService.fetchOne({
      $filters: { _id: loanId },
      maxPropertyValue: 1,
      properties: { value: 1, category: 1, address: 1 },
      hasProProperty: 1,
      hasPromotion: 1,
      anonymous: 1,
      promotions: { _id: 1, name: 1 },
      name: 1,
    });
    const {
      maxPropertyValue = {},
      properties = [],
      hasProProperty,
      anonymous,
      promotions = [],
      hasPromotion,
      name: loanName,
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
      property = properties.find(
        ({ category }) => category === PROPERTY_CATEGORY.PRO,
      );
    }

    let promotion = {};
    if (hasPromotion) {
      promotion = promotions[0];
    }

    analytics.track(EVENTS.LOAN_MAX_PROPERTY_VALUE_CALCULATED, {
      loanId,
      loanName,
      canton,
      type,
      anonymous,
      proPropertyValue: property.value,
      proProperty: property._id,
      proPropertyAddress: property.address,
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
      promotionId: promotion._id,
      promotionName: promotion.name,
    });
  },
);

ServerEventService.addAfterMethodListener(
  loanInsertBorrowers,
  ({ context, params }) => {
    context.unblock();
    const analytics = new Analytics(context);
    const { loanId, amount } = params;

    const loan = LoanService.fetchOne({
      $filters: { _id: loanId },
      maxPropertyValue: 1,
      properties: { category: 1, address: 1 },
      hasProProperty: 1,
      hasPromotion: 1,
      anonymous: 1,
      name: 1,
      promotions: { name: 1 },
    });
    const {
      properties = [],
      hasProProperty,
      anonymous,
      promotions = [],
      hasPromotion,
      name: loanName,
    } = loan;

    let property = {};
    if (hasProProperty) {
      property = properties.find(
        ({ category }) => category === PROPERTY_CATEGORY.PRO,
      );
    }

    let promotion = {};
    if (hasPromotion) {
      promotion = promotions[0];
    }

    analytics.track(EVENTS.LOAN_BORROWERS_INSERTED, {
      loanId,
      loanName,
      amount,
      anonymous,
      proPropertyId: property._id,
      proPropertyAddress: property.address,
      promotionId: promotion._id,
      promotionName: promotion.name,
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
    context.unblock();
    const analytics = new Analytics(context);
    const { name: loanName } = LoanService.fetchOne({
      $filters: { _id: loanId },
      name: 1,
    });
    analytics.track(
      EVENTS.LOAN_CREATED,
      {
        loanId,
        propertyId: proPropertyId,
        referralId,
        anonymous: true,
        loanName,
      },
      trackingId,
    );
  },
);

ServerEventService.addAfterMethodListener(
  anonymousCreateUser,
  ({ context, params: { trackingId, loanId, ctaId }, result: userId }) => {
    context.unblock();
    const analytics = new Analytics({ ...context, userId });

    const user = UserService.fetchOne({
      $filters: { _id: userId },
      referredByUser: { _id: 1 },
      referredByOrganisation: { _id: 1 },
      assignedEmployee: { _id: 1 },
    });

    const {
      referredByUser: { _id: proId } = {},
      referredByOrganisation: { _id: orgId } = {},
      assignedEmployee: { _id: adminId } = {},
    } = user;

    analytics.identify(trackingId);
    analytics.track(
      EVENTS.USER_CREATED,
      {
        userId,
        origin: 'user',
        referralId: proId,
        orgReferralId: orgId,
        adminId,
        ctaId,
      },
      trackingId,
    );

    if (loanId) {
      const { name: loanName } = LoanService.fetchOne({
        $filters: { _id: loanId },
        name: 1,
      });
      analytics.track(EVENTS.LOAN_ANONYMOUS_LOAN_CLAIMED, {
        loanId,
        loanName,
      });
    }
  },
);

ServerEventService.addAfterMethodListener(
  proInviteUser,
  ({
    context,
    params: { user, propertyIds = [], promotionIds = [], properties = [] },
    result: { userId: customerId },
  }) => {
    context.unblock();

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
    const { name: org, _id: orgId } =
      UserService.getUserMainOrganisation(userId) || {};

    const referOnly =
      propertyIds.length === 0 &&
      promotionIds.length === 0 &&
      properties.length === 0;

    const sharedEventProperties = {
      customerId,
      customerName: `${firstName} ${lastName}`,
      customerEmail: email,
      proId: userId,
      proName: pro,
      proOrganisation: org,
      referOnly,
    };

    if (referOnly) {
      return analytics.track(
        EVENTS.PRO_INVITED_CUSTOMER,
        sharedEventProperties,
      );
    }

    if (propertyIds.length) {
      propertyIds.map(propertyId => {
        const { address } = PropertyService.fetchOne({
          $filters: { _id: propertyId },
          address: 1,
        });

        return analytics.track(EVENTS.PRO_INVITED_CUSTOMER, {
          ...sharedEventProperties,
          propertyId,
          propertyAddress: address,
        });
      });
    }

    if (promotionIds.length) {
      promotionIds.map(promotionId => {
        const { name } = PromotionService.fetchOne({
          $filters: { _id: promotionId },
          name: 1,
        });

        return analytics.track(EVENTS.PRO_INVITED_CUSTOMER, {
          ...sharedEventProperties,
          promotionId,
          promotionName: name,
          promotionLotIds,
          showAllLots,
        });
      });
    }

    if (properties.length) {
      properties.map(property => {
        const { address, _id: propertyId } = PropertyService.fetchOne({
          $filters: { externalId: property.externalId },
          address: 1,
        });

        return analytics.track(EVENTS.PRO_INVITED_CUSTOMER, {
          ...sharedEventProperties,
          propertyId,
          propertyAddress: address,
        });
      });
    }
  },
);

ServerEventService.addAfterMethodListener(
  adminCreateUser,
  ({ context, result: userId }) => {
    context.unblock();
    const analytics = new Analytics(context);
    const { userId: adminId } = context;

    analytics.track(EVENTS.ADMIN_INVITED_USER, { userId, adminId });
  },
);

ServerEventService.addAfterMethodListener(
  proInviteUserToOrganisation,
  ({ context, result: userId }) => {
    context.unblock();
    const analytics = new Analytics(context);
    const { userId: proId } = context;

    const { _id: orgId } = UserService.getUserMainOrganisation(proId);

    analytics.track(EVENTS.PRO_INVITED_PRO, {
      userId,
      proId,
      organisationId: orgId,
    });
  },
);
