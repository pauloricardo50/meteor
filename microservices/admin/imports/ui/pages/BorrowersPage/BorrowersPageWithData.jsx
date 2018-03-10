import query from 'core/api/borrowers/queries/borrowers';
import { withQuery } from 'meteor/cultofcoders:grapher-react';
import BorrowersPage from './BorrowersPage';

const BorrowersPageWithData = withQuery(() => query.clone(), {
  reactive: true,
})(BorrowersPage);

export default BorrowersPageWithData;
