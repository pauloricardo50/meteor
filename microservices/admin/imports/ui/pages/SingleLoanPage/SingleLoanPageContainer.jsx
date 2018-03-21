import query from 'core/api/loans/queries/adminLoan';
import { withQuery } from 'meteor/cultofcoders:grapher-react';

const SingleLoanPageContainer = withQuery(
  ({ match }) => query.clone({ _id: match.params.loanId }),
  { reactive: true, single: true },
);

export default SingleLoanPageContainer;
