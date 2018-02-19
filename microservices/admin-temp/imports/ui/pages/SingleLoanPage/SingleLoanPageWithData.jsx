import query from 'core/api/loans/queries/adminLoanView';
import { withQuery } from 'meteor/cultofcoders:grapher-react';
import SingleLoanPage from './SingleLoanPage';

const SingleLoanPageWithData = withQuery(
  ({ match }) => query.clone({ _id: match.params.loanId }),
  {
    reactive: true,
    single: true,
  },
)(SingleLoanPage);

export default SingleLoanPageWithData;
