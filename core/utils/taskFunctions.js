/**
 * Gets the loan to which the task is related
 * @param {object}  the task object received from the task query
 *
 * @return {object} a Promise which resolves with the related loan
 */
export const getTaskRelatedLoan = ({ loan, borrower, property }) => {
  if (loan) {
    return loan;
  }

  if (borrower) {
    return borrower.loans[0];
  }

  if (property) {
    return property.loans[0];
  }
};
