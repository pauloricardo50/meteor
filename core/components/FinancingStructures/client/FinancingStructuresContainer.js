// @flow
import { connect } from 'react-redux';
import {
  lifecycle,
  compose,
  branch,
  renderNothing,
  withState,
} from 'recompose';
import { addNewStructure } from 'core/api';
import {
  rehydrateLoan,
  rehydrateProperties,
  rehydrateBorrowers,
} from '../../../redux/financingStructures';
import type { Action } from '../../../redux/financingStructures';
import { ROLES } from '../../../api/constants';
import ClientEventService, {
  LOAD_LOAN,
} from '../../../api/events/ClientEventService/index';

export default compose(
  connect(
    state => ({ isLoaded: state.financingStructures.isLoaded }),
    (dispatch: Action => any) => ({
      loadLoan: loan => dispatch(rehydrateLoan(loan)),
      loadProperties: loan => dispatch(rehydrateProperties(loan.properties)),
      loadBorrowers: loan => dispatch(rehydrateBorrowers(loan.borrowers)),
    }),
  ),
  withState('loadLoanOnce', 'setLoadLoanOnce', false),
  lifecycle({
    componentDidMount() {
      this.props.loadLoan(this.props.loan);
      if (this.props.loan.structures.length === 0) {
        addNewStructure.run({ loanId: this.props.loan._id });
      }

      // When this event is emitted, it means an update has been pushed to the server
      // Wait until the update comes back from the server, load the loan once, and
      // then revert to not loading it
      ClientEventService.addListener(LOAD_LOAN, () =>
        this.props.setLoadLoanOnce(true));
    },
    componentWillUnmount() {
      ClientEventService.removeAllListeners(LOAD_LOAN);
    },
    componentWillReceiveProps({ loan, currentUser }) {
      if (loan.cantModifyStructures && currentUser.roles.includes(ROLES.USER)) {
        this.props.loadLoan(loan);
      }

      console.log('received new props');

      if (
        JSON.stringify(loan.borrowers)
        !== JSON.stringify(this.props.loan.borrowers)
      ) {
        this.props.loadBorrowers(loan);
      }
      if (
        JSON.stringify(loan.properties)
        !== JSON.stringify(this.props.loan.properties)
      ) {
        this.props.loadProperties(loan);
      }

      if (this.props.loadLoanOnce) {
        this.props.setLoadLoanOnce(false);
        this.props.loadLoan(loan);
      }
    },
  }),
  branch(({ isLoaded }) => !isLoaded, renderNothing),
);
