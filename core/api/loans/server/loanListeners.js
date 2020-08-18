import ServerEventService from '../../events/server/ServerEventService';
import { PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS } from '../../promotionOptions/promotionOptionConstants';
import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';
import { setUserStatus } from '../../users/methodDefinitions';
import { USER_STATUS } from '../../users/userConstants';
import { LOAN_STATUS } from '../loanConstants';
import {
  loanSetStatus,
  setMaxPropertyValueOrBorrowRatio,
} from '../methodDefinitions';
import LoanService from './LoanService';

export const disableUserFormsListener = ({ params: { loanId } }) => {
  LoanService.update({ loanId, object: { userFormsEnabled: false } });
};

ServerEventService.addAfterMethodListener(
  setMaxPropertyValueOrBorrowRatio,
  ({ params }) => {
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

ServerEventService.addAfterMethodListener(
  setUserStatus,
  ({
    params: { userId, unsuccessfulReason, ...params },
    result: { prevStatus, nextStatus },
  }) => {
    console.log('LOAN setUserStatus Listener:', {
      userId,
      unsuccessfulReason,
      prevStatus,
      nextStatus,
      ...params,
    });

    if (
      prevStatus === USER_STATUS.PROSPECT &&
      nextStatus === USER_STATUS.LOST
    ) {
      const loans = LoanService.fetch({
        $filters: { userId },
        _id: 1,
        status: 1,
      });

      loans.forEach(({ _id, status }) => {
        if (status !== LOAN_STATUS.UNSUCCESSFUL) {
          console.log('UNSUCESSFUL loanId:', _id);

          loanSetStatus.serverRun({
            loanId: _id,
            status: LOAN_STATUS.UNSUCCESSFUL,
            activitySource: 'Utilisateur lost',
          });
          LoanService.update({
            loanId: _id,
            object: { unsuccessfulReason },
          });
        }
      });
    }

    if (
      prevStatus === USER_STATUS.LOST &&
      nextStatus === USER_STATUS.PROSPECT
    ) {
      // This only happens when a bounced user's email is changed
      const loans = LoanService.fetch({ $filters: { userId }, _id: 1 });

      loans.forEach(({ _id }) => {
        console.log('LEAD loanId:', _id);
        loanSetStatus.serverRun({
          loanId: _id,
          status: LOAN_STATUS.LEAD,
          activitySource: 'server, unbounce',
        });

        LoanService.update({
          loanId: _id,
          object: { unsuccessfulReason: 1 },
          operator: '$unset',
        });
      });
    }
  },
);
