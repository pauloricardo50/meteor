import { compose, lifecycle, withProps } from 'recompose';
import merge from 'lodash/merge';
import loanFiles from '../loans/queries/loanFiles';

const normalizeArray = array =>
  array.reduce((object, item) => ({ ...object, [item._id]: item }), {});

const ids = loans => loans.map(({ _id }) => _id);

const mergeLoanWithDocuments = fileData => (loan) => {
  if (!fileData) {
    return loan;
  }

  const loanDocuments = fileData[loan._id];

  if (!loanDocuments) {
    return loan;
  }

  return merge({}, loan, loanDocuments);
};

const withLoansDocuments = compose(
  lifecycle({
    componentWillReceiveProps({ loans }) {
      const { loans: oldLoans } = this.props;
      const loanIds = ids(loans);
      const oldLoanIds = ids(oldLoans);

      if (JSON.stringify(loanIds) !== JSON.stringify(oldLoanIds)) {
        loanFiles.clone({ loanIds }).fetch((err, fileData) => {
          console.log('fileData', fileData);
          if (err) {
            throw err;
          }

          this.setState({
            fileData: normalizeArray(fileData),
          });
        });
      }
    },
  }),
  withProps(({ loans, fileData }) => ({
    loans: loans.map(mergeLoanWithDocuments(fileData)),
  })),
);

export default withLoansDocuments;
