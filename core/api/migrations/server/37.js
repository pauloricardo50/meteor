import { Migrations } from 'meteor/percolate:migrations';

import InsuranceRequestService from '../../insuranceRequests/server/InsuranceRequestService';
import LoanService from '../../loans/server/LoanService';

export const up = () => {
  const insuranceRequests = InsuranceRequestService.fetch({
    revenues: { _id: 1 },
    loan: { _id: 1 },
  });

  const promiseArrays = insuranceRequests
    .filter(({ loan }) => !!loan?._id)
    .map(({ revenues = [], loan: { _id: loanId } }) =>
      revenues.map(({ _id: revenueId }) =>
        LoanService.rawCollection.update(
          { _id: loanId },
          { $addToSet: { revenueLinks: revenueId } },
        ),
      ),
    );

  return Promise.all(promiseArrays.reduce((a, arr) => [...a, ...arr], []));
};

export const down = () => {
  const insuranceRequests = InsuranceRequestService.fetch({
    revenues: { _id: 1, loan: { _id: 1 } },
    loan: { _id: 1 },
  });

  const promiseArrays = insuranceRequests
    .filter(({ loan }) => !!loan?._id)
    .map(({ revenues = [], loan: { _id: loanId } }) =>
      revenues
        .filter(({ loan }) => loan?._id)
        .map(({ _id: revenueId }) =>
          LoanService.rawCollection.update(
            { _id: loanId },
            { $pull: { revenueLinks: revenueId } },
          ),
        ),
    );

  return Promise.all(promiseArrays.reduce((a, arr) => [...a, ...arr], []));
};

Migrations.add({
  version: 37,
  name: 'Link insuranceRequest revenues to the loan as well',
  up,
  down,
});
