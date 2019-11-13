import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';
import ServerEventService from '../../events/server/ServerEventService';
import LoanService from './LoanService';
import { setMaxPropertyValueWithoutBorrowRatio } from '../methodDefinitions';
import { PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS } from '../../promotionOptions/promotionOptionConstants';

export const disableUserFormsListener = ({ params: { loanId } }) => {
  LoanService.update({ loanId, object: { userFormsEnabled: false } });
};

ServerEventService.addAfterMethodListener(
  setMaxPropertyValueWithoutBorrowRatio,
  ({ context, params }) => {
    const { loanId } = params;
    const loan = LoanService.fetchOne({
      $filters: { _id: loanId },
      maxPropertyValue: { date: 1 },
      promotionOptions: { _id: 1 },
    });
    const { maxPropertyValue = {}, promotionOptions = [] } = loan;
    const { date } = maxPropertyValue;

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
  },
);
