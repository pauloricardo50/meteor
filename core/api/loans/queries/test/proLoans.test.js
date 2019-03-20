// @flow
import Loans from 'core/api/loans';

// Sort this query properly so that the merge on the client succeeds
export default Loans.createQuery('PRO_LOANS_TEST', () => {});
