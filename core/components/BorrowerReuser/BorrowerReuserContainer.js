import { compose, lifecycle, withProps, withState } from 'recompose';

import { getReusableBorrowers } from '../../api/borrowers/methodDefinitions';
import { switchBorrower } from '../../api/loans/methodDefinitions';

export default compose(
  withState('borrowers', 'setBorrowers', []),
  withState('isLastLoan', 'setIsLastLoan', []),
  withProps(({ loanId, borrowerId, setBorrowers, setIsLastLoan }) => ({
    fetchBorrowers: () =>
      getReusableBorrowers
        .run({ loanId, borrowerId })
        .then(({ borrowers, isLastLoan }) => {
          setBorrowers(borrowers);
          setIsLastLoan(isLastLoan);
        }),
  })),
  lifecycle({
    componentDidMount() {
      const { fetchBorrowers } = this.props;

      fetchBorrowers();
    },
  }),
  withProps(({ loanId, borrowerId: oldBorrowerId, fetchBorrowers }) => ({
    switchBorrower: (borrowerId, handleClose) =>
      switchBorrower
        .run({ oldBorrowerId, borrowerId, loanId })
        .then(handleClose)
        .then(fetchBorrowers),
  })),
);
