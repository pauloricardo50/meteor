import userLoan from './userLoan';

userLoan.expose({
  firewall(userId, params) {
    params.userId = userId;
  },
  embody: {
    // This will deepExtend your body
    $filter({ filters, params }) {
      filters.userId = params.userId;
    },
  },
  validateParams: { loanId: String },
});
