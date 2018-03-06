import { Meteor } from 'meteor/meteor';
import { Loans } from '..';
import { loanIsVerified } from '../../utils/loanFunctions';
import { AUCTION_STATUS, TASK_TYPE } from '../constants';

const verifyTaskValidation = ({ loanId }) => {
  const loan = Loans.findOne(loanId);
  return loanIsVerified({ loan });
};

const auctionTaskValidation = ({ loanId }) => {
  const loan = Loans.findOne(loanId);
  return (
    !!loan.logic.auction.endTime &&
    loan.logic.auction.status === AUCTION_STATUS.ENDED
  );
};

// TODO
const lenderChosenTaskValidation = task => true;

export const validateTask = (task) => {
  if (!task) {
    throw new Meteor.Error('no task in validateTask');
  }

  switch (task.type) {
  case TASK_TYPE.VERIFY: {
    return verifyTaskValidation(task);
  }
  case TASK_TYPE.AUCTION: {
    return auctionTaskValidation(task);
  }
  case TASK_TYPE.LENDER_CHOSEN: {
    return lenderChosenTaskValidation(task);
  }
  case TASK_TYPE.CUSTOM: {
    return true;
  }
  default:
    return true;
  }
};
