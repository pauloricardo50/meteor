// @flow
import { connect } from 'react-redux';
import { lifecycle, compose, branch, renderNothing } from 'recompose';
import { addStructure } from 'core/api';
import { rehydrateLoan } from '../../../redux/financingStructures';
import type { Action } from '../../../redux/financingStructures';

export default compose(
  connect(
    state => ({ isLoaded: state.financingStructures.isLoaded }),
    (dispatch: Action => any) => ({
      loadLoan: loan => dispatch(rehydrateLoan(loan)),
    }),
  ),
  lifecycle({
    componentDidMount() {
      this.props.loadLoan(this.props.loan);
      if (this.props.loan.structures.length === 0) {
        addStructure.run({ loanId: this.props.loan._id });
      }
    },
    componentWillReceiveProps({ loan }) {
      this.props.loadLoan(loan);
    },
  }),
  branch(({ isLoaded }) => !isLoaded, renderNothing),
);
