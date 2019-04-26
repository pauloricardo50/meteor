import UserService from 'core/api/users/server/UserService';
import ServerEventService from '../../events/server/ServerEventService';
import { requestLoanVerification, submitContactForm } from '../../methods';
import { Loans } from '../..';
import { EMAIL_IDS, INTERNAL_EMAIL } from '../emailConstants';
import { sendEmail, sendEmailToAddress } from '../methodDefinitions';

ServerEventService.addMethodListener(
  requestLoanVerification,
  (context, params) => {
    context.unblock();
    const { loanId } = params;
    const { userId } = Loans.findOne(loanId);

    return sendEmail.run({
      emailId: EMAIL_IDS.VERIFICATION_REQUESTED,
      userId,
      params,
    });
  },
);

ServerEventService.addMethodListener(submitContactForm, (context, params) => {
  context.unblock();
  return sendEmailToAddress.run({
    emailId: EMAIL_IDS.CONTACT_US,
    address: params.email,
    params,
  });
});

ServerEventService.addMethodListener(submitContactForm, (context, params) => {
  context.unblock();
  return sendEmailToAddress.run({
    emailId: EMAIL_IDS.CONTACT_US_ADMIN,
    address: INTERNAL_EMAIL,
    params,
  });
});

ServerEventService.addMethodListener(
  sendEmail,
  (context, { emailId, params, userId }) => {
    context.unblock();
    const emailsToWatch = [
      EMAIL_IDS.INVITE_USER_TO_PROMOTION,
      EMAIL_IDS.INVITE_USER_TO_PROPERTY,
      EMAIL_IDS.REFER_USER,
    ];

    if (!emailsToWatch.includes(emailId)) {
      return;
    }

    if (!params.proUserId) {
      return;
    }

    const { name, email } = UserService.fetchOne({
      $filters: { _id: userId },
      name: 1,
      email: 1,
    });

    return sendEmail.run({
      emailId: EMAIL_IDS.CONFIRM_USER_INVITATION,
      userId: params.proUserId,
      params: { name, email },
    });
  },
);
