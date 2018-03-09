import query from 'core/api/loans/queries/adminLoans';
import { withQuery } from 'meteor/cultofcoders:grapher-react';
import LoansPage from './LoansPage';

const LoansPageWithData = withQuery(() => query.clone(), {
  reactive: true,
})(LoansPage);

export default LoansPageWithData;
