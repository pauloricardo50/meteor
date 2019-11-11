import SecurityService from '../../security';
import BorrowerService from './BorrowerService';
import {
  borrowerInsert,
  borrowerUpdate,
  borrowerDelete,
  pushBorrowerValue,
  popBorrowerValue,
  pullBorrowerValue,
  getReusableBorrowers,
} from '../methodDefinitions';
import { checkInsertUserId } from '../../helpers/server/methodServerHelpers';

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

getReusableBorrowers.setHandler((context, params) => {
  SecurityService.loans.isAllowedToUpdate(params.loanId);
  return BorrowerService.getReusableBorrowers({ ...params });
});
