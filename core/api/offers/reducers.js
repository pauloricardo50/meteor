import Offers from '.';

Offers.addReducers({
  loanId: {
    body: {
      lender: { loan: { _id: 1 } },
    },
    reduce: ({
      lender: {
        loan: { _id: loanId },
      },
    }) => loanId,
  },
});
