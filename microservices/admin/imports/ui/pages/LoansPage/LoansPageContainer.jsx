import query from 'core/api/loans/queries/adminLoans';
import { withQuery } from 'meteor/cultofcoders:grapher-react';

const LoansPageContainer = withQuery(() => query.clone(), { reactive: true });

export default LoansPageContainer;
