import query from 'core/api/borrowers/queries/borrowers';
import { withQuery } from 'meteor/cultofcoders:grapher-react';

const BorrowersPageContainer = withQuery(() => query.clone(), {
  reactive: true,
});

export default BorrowersPageContainer;
