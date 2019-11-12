import Analytics from '../../analytics/server/Analytics';
import { PROPERTY_CATEGORY } from '../../properties/propertyConstants';
import EVENTS from '../../analytics/events';
import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';
import SecurityService from '../../security';
import ServerEventService from '../../events/server/ServerEventService';
import LoanService from './LoanService';
import {
  setMaxPropertyValueWithoutBorrowRatio,
  loanInsertBorrowers,
} from '../methodDefinitions';
import { PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS } from '../../promotionOptions/promotionOptionConstants';

export const disableUserFormsListener = ({ params: { loanId } }) => {
  LoanService.update({ loanId, object: { userFormsEnabled: false } });
};

ServerEventService.addAfterMethodListener(
  setMaxPropertyValueWithoutBorrowRatio,
  ({ context, params }) => {
    const { userId } = context;
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
      promotionOptions: { _id: 1 },
    });
    const {
      maxPropertyValue = {},
      properties = [],
      hasProProperty,
      anonymous,
      promotions = [],
      hasPromotion,
      promotionOptions = [],
    } = loan;
    const { canton, main = {}, second = {}, type, date } = maxPropertyValue;
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

    if (promotionOptions.length) {
      promotionOptions.forEach(({ _id: promotionOptionId }) =>
        PromotionOptionService.updateStatusObject({
          promotionOptionId,
          id: 'simpleVerification',
          object: {
            status: PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.CALCULATED,
            date,
          },
        }),
      );
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
      amount,
      anonymous,
      proProperty: property,
      promotion,
    });
  },
);
