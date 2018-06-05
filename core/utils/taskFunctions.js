import adminLoansQuery from '../api/loans/queries/adminLoans';

window.adminLoansQuery = adminLoansQuery;

/**
 * Gets the loan to which the task is related
 * @param {object}  the task object received from the task query
 *
 * @return {object} a Promise which resolves with the related loan
 */
export const getTaskRelatedLoan = (task) => {
  const { loan, borrower, property } = task;

  if (loan) {
    return Promise.resolve(loan);
  }

  const relatedDocIdFieldName = borrower ? 'borrowerId' : 'propertyId';
  const docId = borrower ? borrower._id : property._id;
  // WARNING: In case of multiple loans for a property,
  //          we can get the wrong loan for the given task (should be fixed
  //          in the future, if multiple loans could be returned).
  console.log('>>>>>>>>', { [relatedDocIdFieldName]: docId });
  return adminLoansQuery
    .clone({ [relatedDocIdFieldName]: docId })
    .fetchOneSync();
};
