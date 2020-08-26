import { subscribeToNewsletter } from '../../email/methodDefinitions';
import {
  adminLoanInsert,
  anonymousLoanInsert,
  loanInsertBorrowers,
  loanSetStatus,
  setMaxPropertyValueOrBorrowRatio,
  userLoanInsert,
} from '../../loans/methodDefinitions';
import LoanService from '../../loans/server/LoanService';
import { submitPromotionInterestForm } from '../../promotions/methodDefinitions';
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
  setUserStatus,
} from '../../users/methodDefinitions';
import UserService from '../../users/server/UserService';
import EVENTS from '../events';
import {
  analyticsCTA,
  analyticsLogin,
  analyticsOnboardingStep,
  analyticsOpenedIntercom,
  analyticsPage,
  analyticsStartedOnboarding,
  analyticsVerifyEmail,
} from '../methodDefinitions';
import { addAnalyticsListener } from './analyticsHelpers';
import { getOnboardingStepProperties } from './onboardingStepAnalyticsHelpers';

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
    const { name: adminName } = UserService.get(adminId, { name: 1 }) || {
      name: 'server',
    };

    let properties = {
      adminId,
      adminName,
      loanCategory,
      loanId,
      loanName,
      loanPurchaseType,
      loanResidenceType,
      loanStep,
      nextStatus,
      prevStatus,
    };

    if (customerId) {
      const user = UserService.get(customerId, {
        referredByUser: { name: 1 },
        referredByOrganisation: { name: 1 },
        assignedEmployee: { name: 1 },
        name: 1,
        email: 1,
      });

      properties = {
        ...properties,
        assigneeId: mainAssignee?._id,
        assigneeName: mainAssignee?.name,
        referringOrganisationName: user.referredByOrganisation?.name,
        referringOrganisationId: user.referredByOrganisation?._id,
        referringUserName: user.referredByUser?.name,
        referringUserId: user.referredByUser?._id,
        userName: user.name,
        userEmail: user.email,
        userId: user._id,
      };
    }

    analytics.track(EVENTS.LOAN_STATUS_CHANGED, properties);
  },
});

addAnalyticsListener({
  method: followImpersonatedSession,
  func: ({ analytics, params: { connectionId }, context }) => {
    const { userId } = context;
    const {
      name: userName,
      email: userEmail,
      referredByUser: { _id: referringUserId, name: referringUserName } = {},
      referredByOrganisation: {
        _id: referringOrganisationId,
        name: referringOrganisationName,
      } = {},
      assignedEmployee: { _id: assigneeId, name: assigneeName } = {},
    } = UserService.get(userId, {
      name: 1,
      email: 1,
      referredByOrganisation: { name: 1 },
      referredByUser: { name: 1 },
      assignedEmployee: { name: 1 },
    });

    const { impersonatingAdmin: admin } = SessionService.get(
      { connectionId },
      { impersonatingAdmin: { name: 1 } },
    );

    analytics.track(EVENTS.USER_FOLLOWED_IMPERSONATING_ADMIN, {
      adminId: admin._id,
      adminName: admin.name,
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
  method: analyticsLogin,
  func: ({ analytics, params, context }) => {
    const { userId } = context;
    const {
      name: userName,
      email: userEmail,
      referredByUser: { _id: referringUserId, name: referringUserName } = {},
      referredByOrganisation: {
        _id: referringOrganisationId,
        name: referringOrganisationName,
      } = {},
      assignedEmployee: { _id: assigneeId, name: assigneeName } = {},
    } = UserService.get(userId, {
      name: 1,
      email: 1,
      referredByOrganisation: { name: 1 },
      referredByUser: { name: 1 },
      assignedEmployee: { name: 1 },
    });
    analytics.identify();
    analytics.track(EVENTS.USER_LOGGED_IN, {
      ...params,
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
  method: analyticsPage,
  func: ({ analytics, params }) => {
    analytics.page(params);
  },
});

addAnalyticsListener({
  method: analyticsVerifyEmail,
  func: ({ analytics, context: { userId } }) => {
    const user = UserService.get(userId, {
      name: 1,
      email: 1,
      referredByOrganisation: { name: 1 },
      referredByUser: { name: 1 },
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
    analytics.track(EVENTS.USER_VERIFIED_EMAIL, {
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
  method: analyticsCTA,
  func: ({ analytics, params }) => {
    analytics.cta(params);
  },
});

addAnalyticsListener({
  method: setMaxPropertyValueOrBorrowRatio,
  func: ({ analytics, params: { loanId } }) => {
    const loan = LoanService.get(loanId, {
      maxPropertyValue: 1,
      properties: { value: 1, category: 1, address: 1 },
      hasProProperty: 1,
      hasPromotion: 1,
      anonymous: 1,
      promotions: { _id: 1, name: 1 },
      name: 1,
      purchaseType: 1,
      user: {
        name: 1,
        email: 1,
        referredByOrganisation: { name: 1 },
        referredByUser: { name: 1 },
        assignedEmployee: { name: 1 },
      },
    });
    const {
      maxPropertyValue = {},
      properties = [],
      hasProProperty,
      anonymous,
      promotions = [],
      hasPromotion,
      name: loanName,
      purchaseType,
    } = loan;
    const {
      canton,
      main = {},
      second = {},
      type: interfaceType,
    } = maxPropertyValue;
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

    const { user = {} } = loan;

    const {
      _id: userId,
      name: userName,
      email: userEmail,
      referredByUser: { _id: referringUserId, name: referringUserName } = {},
      referredByOrganisation: {
        _id: referringOrganisationId,
        name: referringOrganisationName,
      } = {},
      assignedEmployee: { _id: assigneeId, name: assigneeName } = {},
    } = user;

    analytics.track(EVENTS.LOAN_MAX_PROPERTY_VALUE_CALCULATED, {
      loanId,
      loanName,
      canton,
      interfaceType,
      anonymous,
      purchaseType,
      proPropertyValue: property.value,
      proPropertyId: property._id,
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
      user: {
        name: 1,
        email: 1,
        referredByOrganisation: { name: 1 },
        referredByUser: { name: 1 },
        assignedEmployee: { name: 1 },
      },
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

    const { user = {} } = loan;
    const {
      _id: userId,
      name: userName,
      email: userEmail,
      referredByUser: { _id: referringUserId, name: referringUserName } = {},
      referredByOrganisation: {
        _id: referringOrganisationId,
        name: referringOrganisationName,
      } = {},
      assignedEmployee: { _id: assigneeId, name: assigneeName } = {},
    } = user;

    analytics.track(EVENTS.LOAN_BORROWERS_INSERTED, {
      loanId,
      loanName,
      amount,
      anonymous,
      proPropertyId: property._id,
      proPropertyAddress: property.address,
      promotionId: promotion._id,
      promotionName: promotion.name,
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
  method: [anonymousLoanInsert, userLoanInsert, adminLoanInsert, proInviteUser],
  analyticsProps: ({ result, params }) => {
    const userId = result?.userId || params?.userId;
    if (userId) {
      return { userId };
    }

    return undefined;
  },
  func: ({ analytics, params: { referralId }, result }) => {
    let loanId;
    if (typeof result === 'object') {
      // Lets assume that only one loan is created.
      // The case where many loans are created happens when
      // a pro invites a user to multiple promotions, which
      // should not occur
      const { loanIds = [], loanId: resultLoanId } = result;
      loanId = resultLoanId || loanIds?.[0];
    } else {
      loanId = result;
    }

    if (!loanId) {
      return;
    }

    const {
      name: loanName,
      purchaseType,
      user = {},
      promotions = [],
      properties = [],
      anonymous,
    } = LoanService.get(loanId, {
      name: 1,
      purchaseType: 1,
      user: {
        name: 1,
        email: 1,
        referredByOrganisation: { name: 1 },
        referredByUser: { name: 1 },
        assignedEmployee: { name: 1 },
      },
      promotions: { name: 1 },
      properties: { _id: 1 },
      anonymous: 1,
    });

    const [promotion] = promotions;
    const proPropertyId = properties?.[0]?._id;

    const {
      _id: userId,
      name: userName,
      email: userEmail,
      referredByUser: { _id: referringUserId, name: referringUserName } = {},
      referredByOrganisation: {
        _id: referringOrganisationId,
        name: referringOrganisationName,
      } = {},
      assignedEmployee: { _id: assigneeId, name: assigneeName } = {},
    } = user;

    analytics.track(EVENTS.LOAN_CREATED, {
      loanId,
      propertyId: proPropertyId,
      referralId,
      anonymous,
      loanName,
      purchaseType,
      userId,
      userName,
      userEmail,
      referringUserId,
      referringUserName,
      referringOrganisationId,
      referringOrganisationName,
      assigneeId,
      assigneeName,
      promotionId: promotion?._id,
      promotionName: promotion?.name,
    });

    // if (purchaseType) {
    //   analytics.track(EVENTS.COMPLETED_ONBOARDING_STEP, {
    //     loanId,
    //     loanName,
    //     anonymous,
    //     completedStep: 'purchaseType',
    //     purchaseType,
    //     userId,
    //     userName,
    //     userEmail,
    //     referringUserId,
    //     referringUserName,
    //     referringOrganisationId,
    //     referringOrganisationName,
    //     assigneeId,
    //     assigneeName,
    //     promotionId: promotion?._id,
    //     promotionName: promotion?.name,
    //     propertyId: proPropertyId,
    //   });
    // }
  },
});

addAnalyticsListener({
  method: anonymousCreateUser,
  analyticsProps: ({ context, result: userId }) => ({ ...context, userId }),
  func: ({ analytics, params: { loanId, ctaId }, result: userId }) => {
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

    // The user is creating himself, make sure all recent tracks are
    // attributed to him
    analytics.identify();

    analytics.track(EVENTS.USER_CREATED, {
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
    });

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
      assignedEmployee: { name: assigneeName, _id: assigneeId } = {},
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

addAnalyticsListener({
  method: analyticsOpenedIntercom,
  func: ({
    analytics,
    params: { lastPageTitle, lastPagePath, lastPageMicroservice },
    context,
  }) => {
    const { userId } = context;

    let params = {
      lastPageTitle,
      lastPagePath,
      lastPageMicroservice,
    };

    if (userId) {
      const user = UserService.get(userId, {
        name: 1,
        email: 1,
        referredByUser: { name: 1 },
        referredByOrganisation: { name: 1 },
        assignedEmployee: { intercomId: 1, name: 1 },
      });

      params = {
        ...params,
        userId: user?._id,
        userName: user?.name,
        userEmail: user?.email,
        referringUserId: user?.referredByUser?._id,
        referringUserName: user?.referredByUser?.name,
        referringOrganisationId: user?.referredByOrganisation?._id,
        referringOrganisationName: user?.referredByOrganisation?.name,
        assigneeId: user?.assignedEmployee?._id,
        assigneeName: user?.assignedEmployee?.name,
      };
    }

    analytics.track(EVENTS.INTERCOM_OPENED_MESSENGER, params);
  },
});

addAnalyticsListener({
  method: subscribeToNewsletter,
  func: ({ analytics, params: { email } }) => {
    analytics.track(EVENTS.SUBSCRIBE_TO_NEWSLETTER, { userEmail: email });
  },
});

addAnalyticsListener({
  method: submitPromotionInterestForm,
  func: ({ analytics, params: { email, promotionId } }) => {
    const { name: promotionName } = PromotionService.get(promotionId, {
      name: 1,
    });
    analytics.track(EVENTS.SUBMIT_PROMOTION_INTEREST_FORM, {
      userEmail: email,
      promotionName,
    });
  },
});

addAnalyticsListener({
  method: setUserStatus,
  analyticsProps: ({ context, params: { userId } }) => ({
    ...context,
    userId,
  }),
  func: ({
    analytics,
    params: { userId, reason, ...params },
    result: { prevStatus, nextStatus },
  }) => {
    console.log('ANALYTICS setUserStatus Listener:', {
      userId,
      reason,
      prevStatus,
      nextStatus,
      ...params,
    });

    if (prevStatus !== nextStatus) {
      const user = UserService.get(userId, {
        name: 1,
        email: 1,
        assignedEmployee: { name: 1 },
        referredByOrganisation: { name: 1 },
        referredByUser: { name: 1 },
      });

      analytics.track(EVENTS.USER_CHANGED_STATUS, {
        prevStatus,
        nextStatus,
        userId: user?._id,
        userName: user?.name,
        userEmail: user?.email,
        referringUserId: user?.referredByUser?._id,
        referringUserName: user?.referredByUser?.name,
        referringOrganisationId: user?.referredByOrganisation?._id,
        referringOrganisationName: user?.referredByOrganisation?.name,
        assigneeId: user?.assignedEmployee?._id,
        assigneeName: user?.assignedEmployee?.name,
        statusChangeReason: reason,
      });
    }
  },
});

addAnalyticsListener({
  method: analyticsOnboardingStep,
  func: ({ analytics, context, params }) => {
    const { latestStep, activeStep, currentTodoStep } = params;
    // User landed on the very first step, or came back to continue on a new session
    // No progress is made, therefore we should not track this step
    if (!latestStep) {
      return;
    }

    // User went to a different step that the one he needs to complete in the flow
    if (activeStep !== currentTodoStep) {
      return;
    }

    const properties = getOnboardingStepProperties({ context, params });

    analytics.track(EVENTS.COMPLETED_ONBOARDING_STEP, properties);
  },
});

addAnalyticsListener({
  method: analyticsStartedOnboarding,
  type: 'before',
  func: ({
    analytics,
    context: { userId },
    params: { loanId, activeStep, previousStep },
  }) => {
    const {
      hasStartedOnboarding,
      anonymous,
      purchaseType,
      properties = [],
      promotions = [],
      name: loanName,
    } = LoanService.get(loanId, {
      anonymous: 1,
      purchaseType: 1,
      properties: { _id: 1 },
      promotions: { name: 1 },
      name: 1,
      hasStartedOnboarding: 1,
    });

    if (hasStartedOnboarding) {
      return;
    }

    let params = {
      loanId,
      loanName,
      propertyId: properties?.[0]?._id,
      promotionId: promotions?.[0]?._id,
      promotionName: promotions?.[0]?.name,
      purchaseType,
      anonymous,
      currentStep: activeStep,
      previousStep,
    };

    if (userId) {
      const user = UserService.get(userId, {
        name: 1,
        email: 1,
        referredByUser: { name: 1 },
        referredByOrganisation: { name: 1 },
        assignedEmployee: { intercomId: 1, name: 1 },
      });

      params = {
        ...params,
        userId: user?._id,
        userName: user?.name,
        userEmail: user?.email,
        referringUserId: user?.referredByUser?._id,
        referringUserName: user?.referredByUser?.name,
        referringOrganisationId: user?.referredByOrganisation?._id,
        referringOrganisationName: user?.referredByOrganisation?.name,
        assigneeId: user?.assignedEmployee?._id,
        assigneeName: user?.assignedEmployee?.name,
      };
    }

    analytics.track(EVENTS.STARTED_ONBOARDING, params);
  },
});
