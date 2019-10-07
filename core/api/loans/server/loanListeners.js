import Analytics from 'core/api/analytics/server/Analytics';
import { PROPERTY_CATEGORY } from 'core/api/properties/propertyConstants';
import EVENTS from 'core/api/analytics/events';
import PromotionReservationService from 'core/api/promotionReservations/server/PromotionReservationService';
import { PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS } from 'core/api/promotionReservations/promotionReservationConstants';
import ServerEventService from '../../events/server/ServerEventService';
import LoanService from './LoanService';
import { requestLoanVerification } from '../..';
import {
  setMaxPropertyValueWithoutBorrowRatio,
  loanInsertBorrowers,
} from '../methodDefinitions';

export const disableUserFormsListener = ({ params: { loanId } }) => {
  LoanService.update({ loanId, object: { userFormsEnabled: false } });
};

ServerEventService.addAfterMethodListener(
  requestLoanVerification,
  disableUserFormsListener,
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
      promotionReservations: { _id: 1 },
    });
    const {
      maxPropertyValue = {},
      properties = [],
      hasProProperty,
      anonymous,
      promotions = [],
      hasPromotion,
      promotionReservations = [],
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
      property = properties.find(({ category }) => category === PROPERTY_CATEGORY.PRO);
    }

    let promotion = {};
    if (hasPromotion) {
      promotion = promotions[0];
    }

    if (promotionReservations.length) {
      promotionReservations.forEach(({ _id: promotionReservationId }) =>
        PromotionReservationService.updateMortgageCertification({
          promotionReservationId,
          status:
            PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.CALCULATED,
          date,
        }));
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
