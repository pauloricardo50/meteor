import moment from 'moment';
import Loans from '../loans';

import { LOAN_STATUS, AUCTION_STATUS } from '../constants';
import { getAuctionEndTime } from '../../utils/loanFunctions';

class LoanServiceModel {
  insert = ({ loan, userId }) => Loans.insert({ ...loan, userId });

  update = ({ loanId, object }) => Loans.update(loanId, { $set: object });

  remove = ({ loanId }) => Loans.remove(loanId);

  // TODO: make sure step is really done
  incrementStep = ({ loanId }) =>
    Loans.update(loanId, { $inc: { 'logic.step': 1 } });

  askVerification = ({ loanId }) => {
    const loan = Loans.findOne(loanId);

    if (loan.logic.verification.requested) {
      // Don't do anything if this loan is already in requested mode
      return false;
    }

    return Loans.update(loanId, {
      $set: {
        'logic.verification.requested': true,
        'logic.verification.requestedAt': new Date(),
      },
    });
  };

  startAuction = ({ loanId }) => {
    const loan = Loans.findOne(loanId);

    if (loan.logic.auction.status !== AUCTION_STATUS.NONE) {
      // Don't do anything if this auction has already started or ended
      return false;
    }

    return Loans.update(loanId, {
      $set: {
        'logic.auction.status': AUCTION_STATUS.STARTED,
        'logic.auction.startTime': moment().toDate(),
        'logic.auction.endTime': getAuctionEndTime(moment()),
      },
    });
  };

  endAuction = ({ loanId }) => {
    const loan = Loans.findOne(loanId);

    // This method is called in the future (through a job),
    // so only call this if the auction is ongoing
    if (!loan || loan.logic.auction.status !== AUCTION_STATUS.STARTED) {
      return false;
    }

    return Loans.update(id, {
      $set: {
        'logic.auction.status': AUCTION_STATUS.ENDED,
        'logic.auction.endTime': new Date(),
      },
    });
  };

  cancelAuction = ({ loanId }) =>
    Loans.update(loanId, {
      $set: {
        'logic.auction.endTime': undefined,
        'logic.auction.status': '',
        'logic.auction.startTime': undefined,
      },
    });

  confirmClosing = ({ loanId, object }) =>
    Loans.update(loanId, {
      $set: {
        status: LOAN_STATUS.DONE,
        ...object,
      },
    });

  disableUserForms = ({ loanId }) =>
    this.update({ loanId, object: { userFormsEnabled: false } });

  enableUserForms = ({ loanId }) =>
    this.update({ loanId, object: { userFormsEnabled: true } });

  static pushValue = ({ loanId, object }) =>
    Loans.update(loanId, { $push: object });

  static popValue = ({ loanId, object }) =>
    Loans.update(loanId, { $pop: object });
}

const LoanService = new LoanServiceModel({});

export { LoanServiceModel };
export default LoanService;
