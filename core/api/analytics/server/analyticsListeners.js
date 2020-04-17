import {
  adminLoanInsert,
  anonymousLoanInsert,
  loanInsertBorrowers,
  loanSetStatus,
  setMaxPropertyValueWithoutBorrowRatio,
  userLoanInsert,
} from '../../loans/methodDefinitions';
import LoanService from '../../loans/server/LoanService';
import PromotionService from '../../promotions/server/PromotionService';
import { PROPERTY_CATEGORY } from '../../properties/propertyConstants';
import PropertyService from '../../properties/server/PropertyService';
import { followImpersonatedSession } from '../../sessions/methodDefinitions';
import SessionService from '../../sessions/server/SessionService';
import {
  adminCreateUser,
  anonymousCreateUser,
  proInviteUser,
  proInviteUserToOrganisation,
} from '../../users/methodDefinitions';
import UserService from '../../users/server/UserService';
import EVENTS from '../events';
import {
  analyticsCTA,
  analyticsLogin,
  analyticsPage,
  analyticsVerifyEmail,
} from '../methodDefinitions';
import { addAnalyticsListener } from './analyticsHelpers';

addAnalyticsListener({
  method: [proInviteUser, proInviteUserToOrganisation, adminCreateUser],
  func: ({ analytics, result, config: { name: methodName } }) => {
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
      const user = UserService.get(userId, {
        name: 1,
        email: 1,
        referredByUser: { name: 1 },
        referredByOrganisation: { name: 1 },
        assignedEmployee: { name: 1 },
      });

      const {
        name: userName,
        email: userEmail,
        referredByUser: { _id: referringUserId, name: referringUserName } = {},
        referredByOrganisation: {
          _id: referringOrganisationId,
          name: referringOrganisationName,
        } = {},
        assignedEmployee: { _id: assigneeId, name: assigneeName } = {},
      } = user;

      let origin;

      if (methodName.includes('pro')) {
        origin = 'pro';
      } else if (methodName.includes('admin')) {
        origin = 'admin';
      }

      analytics.createAnalyticsUser(userId, {
        userId,
        userName,
        userEmail,
        referringUserId,
        referringUserName,
        referringOrganisationId,
        referringOrganisationName,
        assigneeId,
        assigneeName,
        origin,
      });
    }
  },
});

addAnalyticsListener({
  method: loanSetStatus,
  func: ({
    analytics,
    context,
    result: { nextStatus, prevStatus },
    params: { loanId },
  }) => {
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
      mainAssignee,
    } = LoanService.get(loanId, {
      userId: 1,
      category: 1,
      name: 1,
      purchaseType: 1,
      residenceType: 1,
      step: 1,
      mainAssignee: 1,
    });
    const { name: adminName } = UserService.get(adminId, { name: 1 });
    if (customerId) {
      const user = UserService.get(customerId, {
        referredByUser: { name: 1 },
        referredByOrganisation: { name: 1 },
        assignedEmployee: { name: 1 },
        name: 1,
      });
      assigneeId = mainAssignee?._id;
      assigneeName = mainAssignee?.name;
      referredByOrganisation = user.referredByOrganisation?.name;
      referredByUser = user.referredByUser?.name;
      customerName = user.name;
    }

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
});

addAnalyticsListener({
  method: followImpersonatedSession,
  func: ({ analytics, params: { connectionId } }) => {
    const { impersonatingAdmin: admin } = SessionService.get(
      { connectionId },
      { impersonatingAdmin: { name: 1 } },
    );

    analytics.track(EVENTS.USER_FOLLOWED_IMPERSONATING_ADMIN, {
      adminId: admin._id,
      adminName: admin.name,
    });
  },
});

addAnalyticsListener({
  method: analyticsLogin,
  func: ({ analytics, params }) => {
    analytics.identify();
    analytics.track(EVENTS.USER_LOGGED_IN, params);
  },
});

addAnalyticsListener({
  method: analyticsPage,
  func: ({ analytics, params }) => {
    analytics.page(params);
  },
});

addAnalyticsListener({
  method: analyticsVerifyEmail,
  func: ({ analytics, params: { trackingId } }) => {
    analytics.identify(trackingId);
    analytics.track(EVENTS.USER_VERIFIED_EMAIL);
  },
});

addAnalyticsListener({
  method: analyticsCTA,
  func: ({ analytics, params }) => {
    analytics.cta(params);
  },
});

addAnalyticsListener({
  method: setMaxPropertyValueWithoutBorrowRatio,
  func: ({ analytics, params: { loanId } }) => {
    const loan = LoanService.get(loanId, {
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
});

addAnalyticsListener({
  method: loanInsertBorrowers,
  func: ({ analytics, params: { loanId, amount } }) => {
    const loan = LoanService.get(loanId, {
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
});

addAnalyticsListener({
  method: [anonymousLoanInsert, userLoanInsert, adminLoanInsert],
  func: ({
    analytics,
    params: { proPropertyId, referralId, trackingId },
    result: loanId,
  }) => {
    const { name: loanName, purchaseType } = LoanService.get(loanId, {
      name: 1,
      purchaseType: 1,
    });
    analytics.track(
      EVENTS.LOAN_CREATED,
      {
        loanId,
        propertyId: proPropertyId,
        referralId,
        anonymous: true,
        loanName,
        purchaseType,
      },
      trackingId,
    );
  },
});

addAnalyticsListener({
  method: anonymousCreateUser,
  analyticsProps: ({ context, result: userId }) => ({ ...context, userId }),
  func: ({
    analytics,
    params: { trackingId, loanId, ctaId },
    result: userId,
  }) => {
    const user = UserService.get(userId, {
      name: 1,
      email: 1,
      referredByUser: { name: 1 },
      referredByOrganisation: { name: 1 },
      assignedEmployee: { name: 1 },
    });

    const {
      name: userName,
      email: userEmail,
      referredByUser: { _id: referringUserId, name: referringUserName } = {},
      referredByOrganisation: {
        _id: referringOrganisationId,
        name: referringOrganisationName,
      } = {},
      assignedEmployee: { _id: assigneeId, name: assigneeName } = {},
    } = user;

    analytics.identify(trackingId);
    analytics.track(
      EVENTS.USER_CREATED,
      {
        userId,
        userName,
        userEmail,
        referringUserId,
        referringUserName,
        referringOrganisationId,
        referringOrganisationName,
        assigneeId,
        assigneeName,
        origin: 'user',
        ctaId,
      },
      trackingId,
    );

    if (loanId) {
      const { name: loanName } = LoanService.get(loanId, { name: 1 });
      analytics.track(EVENTS.LOAN_ANONYMOUS_LOAN_CLAIMED, {
        loanId,
        loanName,
      });
    }
  },
});

addAnalyticsListener({
  method: proInviteUser,
  func: ({
    analytics,
    context,
    params: { user, propertyIds = [], promotionIds = [], properties = [] },
    result: { userId: customerId },
  }) => {
    const { userId: referringUserId } = context;
    const {
      firstName,
      lastName,
      email,
      promotionLotIds = [],
      showAllLots = false,
    } = user;
    const { assignedEmployee = {} } = UserService.get(customerId, {
      assignedEmployee: { name: 1 },
    });
    const { _id: assigneeId, name: assigneeName } = assignedEmployee;

    const { name: referringUserName } = UserService.get(referringUserId, {
      name: 1,
    });
    const { name: referringOrganisationName, _id: referringOrganisationId } =
      UserService.getUserMainOrganisation(referringUserId) || {};

    const referOnly =
      propertyIds.length === 0 &&
      promotionIds.length === 0 &&
      properties.length === 0;

    const sharedEventProperties = {
      customerId,
      customerName: `${firstName} ${lastName}`,
      customerEmail: email,
      referringUserId,
      referringUserName,
      referringOrganisationId,
      referringOrganisationName,
      assigneeId,
      assigneeName,
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
        const { address } = PropertyService.get(propertyId, { address: 1 });

        return analytics.track(EVENTS.PRO_INVITED_CUSTOMER, {
          ...sharedEventProperties,
          propertyId,
          propertyAddress: address,
        });
      });
    }

    if (promotionIds.length) {
      promotionIds.map(promotionId => {
        const { name } = PromotionService.get(promotionId, { name: 1 });

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
        const { address, _id: propertyId } = PropertyService.get(
          { externalId: property.externalId },
          { address: 1 },
        );

        return analytics.track(EVENTS.PRO_INVITED_CUSTOMER, {
          ...sharedEventProperties,
          propertyId,
          propertyAddress: address,
        });
      });
    }
  },
});

addAnalyticsListener({
  method: adminCreateUser,
  func: ({ analytics, result: userId }) => {
    const {
      name: userName,
      email: userEmail,
      assignedEmployee: { name: assigneeName, _id: assigneeId },
      referredByUser,
      referredByOrganisation,
    } = UserService.get(userId, {
      name: 1,
      email: 1,
      assignedEmployee: { name: 1 },
      referredByUser: { name: 1 },
      referredByOrganisation: { name: 1 },
    });
    let referringUserId;
    let referringUserName;
    let referringOrganisationId;
    let referringOrganisationName;

    if (referredByUser) {
      referringUserId = referredByUser._id;
      referringUserName = referredByUser.name;
    }

    if (referredByOrganisation) {
      referringOrganisationId = referredByOrganisation._id;
      referringOrganisationName = referredByOrganisation.name;
    }

    analytics.track(EVENTS.ADMIN_INVITED_USER, {
      userId,
      userName,
      userEmail,
      referringUserId,
      referringUserName,
      referringOrganisationId,
      referringOrganisationName,
      assigneeId,
      assigneeName,
    });
  },
});

addAnalyticsListener({
  method: proInviteUserToOrganisation,
  func: ({ analytics, context, result: proId }) => {
    const { userId } = context;
    const { name: proName, email: proEmail } = UserService.get(proId, {
      name: 1,
      email: 1,
    });
    const {
      _id: organisationId,
      name: organisationName,
    } = UserService.getUserMainOrganisation(userId);

    analytics.track(EVENTS.PRO_INVITED_PRO, {
      proId,
      proName,
      proEmail,
      organisationId,
      organisationName,
    });
  },
});
