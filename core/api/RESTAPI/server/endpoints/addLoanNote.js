import { Meteor } from 'meteor/meteor';

import LoanService from '../../../loans/server/LoanService';
import { proAddLoanTask } from '../../../tasks/methodDefinitions';
import { withMeteorUserId } from '../helpers';
import { HTTP_STATUS_CODES } from '../restApiConstants';
import {
  checkAccessToUser,
  checkQuery,
  getImpersonateUserId,
  impersonateSchema,
} from './helpers';

const addLoanNoteAPI = ({ user: { _id: userId }, body, query }) => {
  const { 'impersonate-user': impersonateUser } = checkQuery({
    query,
    schema: impersonateSchema,
  });
  const { note, loanId } = body;

  const exists = LoanService.exists(loanId);

  if (!exists) {
    throw new Meteor.Error(
      HTTP_STATUS_CODES.NOT_FOUND,
      `No loan found with id "${loanId}", or you don't have access to it.`,
    );
  }

  let proId;
  if (impersonateUser) {
    proId = getImpersonateUserId({ userId, impersonateUser });
  }

  const { user } = LoanService.get(loanId, {
    user: {
      referredByOrganisationLink: 1,
      referredByUserLink: 1,
    },
  });

  checkAccessToUser({
    user,
    proId: proId || userId,
    errorMessage: `No loan found with id "${loanId}", or you don't have access to it.`,
  });

  return withMeteorUserId({ userId, impersonateUser }, () =>
    proAddLoanTask.run(body).then(() =>
      Promise.resolve({
        status: HTTP_STATUS_CODES.OK,
        message: `Successfully added a note on loan with id "${loanId}" !`,
        note,
      }),
    ),
  );
};

export default addLoanNoteAPI;
