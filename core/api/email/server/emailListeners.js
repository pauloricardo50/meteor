import ServerEventService from '../../events/server/ServerEventService';
import { requestLoanVerification, submitContactForm } from '../../methods';
import { Loans } from '../..';
import { EMAIL_IDS, INTERNAL_EMAIL } from '../emailConstants';
import { sendEmail, sendEmailToAddress } from '../methodDefinitions';

ServerEventService.addMethodListener(requestLoanVerification, (params) => {
  const { loanId } = params;
  const { userId } = Loans.findOne(loanId);

  return sendEmail.run({
    emailId: EMAIL_IDS.VERIFICATION_REQUESTED,
    userId,
    params,
  });
});

ServerEventService.addMethodListener(submitContactForm, params =>
  sendEmailToAddress.run({
    emailId: EMAIL_IDS.CONTACT_US,
    address: params.email,
    params,
  }));

ServerEventService.addMethodListener(submitContactForm, params =>
  sendEmailToAddress.run({
    emailId: EMAIL_IDS.CONTACT_US_ADMIN,
    address: INTERNAL_EMAIL,
    params,
  }));
