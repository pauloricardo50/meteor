import { checkInsertUserId } from '../../helpers/server/methodServerHelpers';
import SecurityService from '../../security';
import {
  borrowerDelete,
  borrowerInsert,
  borrowerUpdate,
  getReusableBorrowers,
  popBorrowerValue,
  pullBorrowerValue,
  pushBorrowerValue,
} from '../methodDefinitions';
import BorrowerService from './BorrowerService';

borrowerInsert.setHandler((context, { borrower, userId }) =>
  BorrowerService.insert({
    borrower,
    userId: checkInsertUserId(userId),
  }),
);

borrowerUpdate.setHandler((context, params) => {
  SecurityService.borrowers.isAllowedToUpdate(params.borrowerId);
  return BorrowerService.update(params);
});

borrowerDelete.setHandler((context, params) => {
  if (!params.loanId) {
    SecurityService.checkCurrentUserIsAdmin();
  } else {
    SecurityService.borrowers.isAllowedToDelete(params.borrowerId);
  }
  return BorrowerService.remove(params);
});

pushBorrowerValue.setHandler((context, params) => {
  SecurityService.borrowers.isAllowedToUpdate(params.borrowerId);
  return BorrowerService.pushValue(params);
});

popBorrowerValue.setHandler((context, params) => {
  SecurityService.borrowers.isAllowedToUpdate(params.borrowerId);
  return BorrowerService.popValue(params);
});

pullBorrowerValue.setHandler((context, params) => {
  SecurityService.borrowers.isAllowedToUpdate(params.borrowerId);
  return BorrowerService.pullValue(params);
});

getReusableBorrowers.setHandler(({ userId }, params) => {
  const { loanId, insuranceRequestId } = params;

  if (loanId) {
    SecurityService.loans.isAllowedToUpdate(params.loanId, userId);
  } else if (insuranceRequestId) {
    SecurityService.checkUserIsAdmin(userId);
  }

  return BorrowerService.getReusableBorrowers(params);
});
