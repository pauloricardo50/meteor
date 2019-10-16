import SessionService from 'core/api/sessions/server/SessionService';
import { loanSetStatus } from '../../loans/methodDefinitions';
import { followImpersonatedSession } from '../../sessions/methodDefinitions';
import LoanService from '../../loans/server/LoanService';
import UserService from '../../users/server/UserService';
import ServerEventService from '../../events/server/ServerEventService';
import EVENTS from '../events';
import Analytics from './Analytics';

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
