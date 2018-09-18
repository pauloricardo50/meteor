import { compose, lifecycle, mapProps } from 'recompose';
import { connect } from 'react-redux';
import StructuresContainer from '../containers/StructuresContainer';
import { rehydrateLoan } from '../../../../redux/financing';

const dataIsDifferent = ({ loanFromDB, structures }) =>
  JSON.stringify(loanFromDB.structures) !== JSON.stringify(structures);

const structuresLengthHasChanged = ({ loanFromDB, structures }) =>
  loanFromDB.structures.length !== structures.length;

const withConnect = connect(
  null,
  dispatch => ({ loadLoan: loan => dispatch(rehydrateLoan(loan)) }),
);

const withRefreshChecker = lifecycle({
  componentDidMount() {
    this.setState({ showRefresh: false });
  },
  componentWillReceiveProps(nextProps) {
    if (dataIsDifferent(nextProps)) {
      // First set the state back to false, so that the animation-delay resets
      // When data is being modified continuously
      this.setState({ showRefresh: false }, () =>
        this.setState({ showRefresh: true }));
    } else {
      this.setState({ showRefresh: false });
    }

    if (structuresLengthHasChanged(nextProps)) {
      this.props.loadLoan(this.props.loanFromDB);
    }
  },
});

const withMapProps = mapProps(({ showRefresh, loanFromDB, loadLoan }) => ({
  showRefresh,
  handleRefresh: () => loadLoan(loanFromDB),
}));

const FinancingRefresherContainer = compose(
  withConnect,
  StructuresContainer,
  withRefreshChecker,
  withMapProps,
);

export default FinancingRefresherContainer;
