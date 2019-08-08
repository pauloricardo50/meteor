import { loanSetStatus } from '../../loans/methodDefinitions';
import LoanService from '../../loans/server/LoanService';
import UserService from '../../users/server/UserService';
import ServerEventService from '../../events/server/ServerEventService';
import EVENTS from '../events';
import Analytics from './Analytics';

ServerEventService.addAfterMethodListener(
  loanSetStatus,
  ({ context, result: { prevStatus, nextStatus }, params: { loanId } }) => {
    const { userId: adminId } = context;
    let referredByOrganization;
    let referredByUser;
    const {
      userId,
      category,
      name: loanName,
      purchaseType,
      residenceType,
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
    const { name } = UserService.fetchOne({
      $filters: { _id: adminId },
      name: 1,
    });
    if (userId) {
      const user = UserService.fetchOne({
        $filters: { _id: userId },
        referredByUser: { name: 1 },
        referredByOrganisation: { name: 1 },
      });
      referredByOrganization = user.referredByOrganization && user.referredByOrganization.name;
      referredByUser = user.referredByUser && user.referredByUser.name;
    }

    const analytics = new Analytics(context);
    analytics.track(EVENTS.LOAN_STATUS_CHANGED, {
      category,
      loanId,
      loanName,
      loanStep,
      name,
      nextStatus,
      prevStatus,
      purchaseType,
      referredByOrganization,
      referredByUser,
      residenceType,
      adminId,
    });
  },
);
