import moment from 'moment';
import EventService from '../../events';
import {
  requestLoanVerification,
  startAuction,
  endAuction,
  cancelAuction,
} from '../../methods';
import { Loans } from '../..';
import { EMAIL_IDS } from '../emailConstants';
import { sendEmail } from '../methodDefinitions';
import { getAuctionEndTime } from '../../../utils/loanFunctions';

EventService.addMethodListener(requestLoanVerification, (params) => {
  const { loanId } = params;
  const { userId } = Loans.findOne(loanId);

  return sendEmail.run({
    emailId: EMAIL_IDS.VERIFICATION_REQUESTED,
    userId,
    params,
  });
});

EventService.addMethodListener(startAuction, (params) => {
  const { loanId } = params;
  const { userId } = Loans.findOne(loanId);

  return sendEmail.run({
    emailId: EMAIL_IDS.AUCTION_STARTED,
    userId,
    params: { ...params, auctionEndTime: getAuctionEndTime(moment()) },
  });
});

EventService.addMethodListener(endAuction, (params) => {
  const { loanId } = params;
  const { userId } = Loans.findOne(loanId);

  return sendEmail.run({
    emailId: EMAIL_IDS.AUCTION_ENDED,
    userId,
    params,
  });
});

EventService.addMethodListener(cancelAuction, (params) => {
  const { loanId } = params;
  const { userId } = Loans.findOne(loanId);

  return sendEmail.run({
    emailId: EMAIL_IDS.AUCTION_CANCELLED,
    userId,
    params,
  });
});
