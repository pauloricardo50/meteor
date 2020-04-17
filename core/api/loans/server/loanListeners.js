import ServerEventService from '../../events/server/ServerEventService';
import { PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS } from '../../promotionOptions/promotionOptionConstants';
import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';
import { setMaxPropertyValueOrBorrowRatio } from '../methodDefinitions';
import LoanService from './LoanService';

export const disableUserFormsListener = ({ params: { loanId } }) => {
  LoanService.update({ loanId, object: { userFormsEnabled: false } });
};

ServerEventService.addAfterMethodListener(
  setMaxPropertyValueOrBorrowRatio,
  ({ context, params }) => {
    const { loanId } = params;
    const loan = LoanService.get(loanId, {
      maxPropertyValue: { date: 1 },
      promotionOptions: { _id: 1 },
    });
    const { maxPropertyValue = {}, promotionOptions = [] } = loan;
    const { date } = maxPropertyValue;

    if (promotionOptions.length) {
      promotionOptions.forEach(({ _id: promotionOptionId }) =>
        PromotionOptionService.setProgress({
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
