//
import { compose, lifecycle } from 'recompose';
import { addNewStructure } from 'core/api';

import injectLoanContext from './containers/injectLoanContext';

export default compose(
  injectLoanContext,
  lifecycle({
    componentDidMount() {
      if (this.props.loan.structures.length === 0) {
        addNewStructure.run({ loanId: this.props.loan._id });
      }
    },
  }),
);
