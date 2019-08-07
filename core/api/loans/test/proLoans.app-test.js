// @flow
// import Loans from 'core/api/loans';
const Loans = require('..').default;

module.exports = Loans.createQuery('PRO_LOANS_TEST', () => {});

// Sort this query properly so that the merge on the client succeeds
// export default Loans.createQuery('PRO_LOANS_TEST', () => {});
