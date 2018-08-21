// @flow
import { connect } from 'react-redux';
import { lifecycle, compose, branch, renderNothing } from 'recompose';
import { addNewStructure } from 'core/api';
import { rehydrateLoan } from '../../../redux/financingStructures';
import type { Action } from '../../../redux/financingStructures';
import { ROLES } from '../../../api/constants';

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
        addNewStructure.run({ loanId: this.props.loan._id });
      }
    },
    componentWillReceiveProps({ loan, currentUser }) {
      if (loan.cantModifyStructures && currentUser.roles.includes(ROLES.USER)) {
        this.props.loadLoan(loan);
      }
    },
  }),
  branch(({ isLoaded }) => !isLoaded, renderNothing),
);
