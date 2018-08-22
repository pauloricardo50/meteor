// @flow
import React from 'react';
import { compose, lifecycle, mapProps } from 'recompose';
import { connect } from 'react-redux';

import T from '../../Translation';
import Button from '../../Button';
import Icon from '../../Icon';
import StructuresContainer from './containers/StructuresContainer';
import { rehydrateLoan } from '../../../redux/financingStructures';

type FinancingStructuresRefresherProps = {};

const APPEAR_DELAY = 1000;

export const FinancingStructuresRefresher = ({
  showRefresh,
  handleRefresh,
}) => {
  if (showRefresh) {
    return (
      <Button
        raised
        primary
        onClick={handleRefresh}
        className="financing-structures-refresher animated fadeInDown"
        style={{ animationDelay: `${APPEAR_DELAY}ms` }}
      >
        <Icon type="loop" />
        <T id="FinancingStructuresRefresher.label" />
      </Button>
    );
  }

  return null;
};

const dataIsDifferent = ({ loanFromDB, structures }) =>
  JSON.stringify(loanFromDB.structures) !== JSON.stringify(structures);

const structuresLengthHasChanged = ({ loanFromDB, structures }) =>
  loanFromDB.structures.length !== structures.length;

export default compose(
  connect(
    null,
    dispatch => ({ loadLoan: loan => dispatch(rehydrateLoan(loan)) }),
  ),
  StructuresContainer,
  lifecycle({
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
  }),
  mapProps(({ showRefresh, loanFromDB, loadLoan }) => ({
    showRefresh,
    handleRefresh: () => loadLoan(loanFromDB),
  })),
)(FinancingStructuresRefresher);
