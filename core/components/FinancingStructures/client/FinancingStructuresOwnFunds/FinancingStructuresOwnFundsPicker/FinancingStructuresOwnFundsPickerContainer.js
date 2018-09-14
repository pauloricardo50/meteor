import { compose, withProps, withStateHandlers, withState } from 'recompose';
import { connect } from 'react-redux';

import { updateStructure } from '../../../../../redux/financingStructures';
import { borrowerUpdate, pushBorrowerValue } from '../../../../../api';
import Calculator from '../../../../../utils/Calculator';
import SingleStructureContainer from '../../containers/SingleStructureContainer';
import FinancingStructuresDataContainer from '../../containers/FinancingStructuresDataContainer';
import {
  chooseOwnFundsTypes,
  shouldAskForUsageType,
  makeNewOwnFundsArray,
  getOwnFundsOfTypeAndBorrower,
  getAvailableFundsOfTypeAndBorrower,
  getNewWantedLoanAfterPledge,
} from './FinancingStructuresOwnFundsPickerHelpers';
import ClientEventService, {
  LOAD_LOAN,
} from '../../../../../api/events/ClientEventService/index';
import {
  OWN_FUNDS_USAGE_TYPES,
  RESIDENCE_TYPE,
} from '../../../../../api/constants';

export const FIELDS = {
  TYPE: 'type',
  USAGE_TYPE: 'usageType',
  BORROWER_ID: 'borrowerId',
  VALUE: 'value',
};

const makeInitialState = borrowers => ({
  [FIELDS.TYPE]: undefined,
  [FIELDS.USAGE_TYPE]: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
  [FIELDS.BORROWER_ID]: borrowers[0]._id,
  [FIELDS.VALUE]: undefined,
});

const addState = withStateHandlers(
  ({ structure, borrowers, ownFundsIndex }) => {
    // On load, the redux store has not loaded yet, causing this to crash
    // if we don't add this simple check
    if (!structure) {
      return {};
    }

    // New ownFunds object
    if (ownFundsIndex < 0) {
      return makeInitialState(borrowers);
    }

    // Editing existing ownFunds object
    return structure.ownFunds[ownFundsIndex];
  },
  {
    handleChange: () => (value, id) => ({ [id]: value }),
    reset: (_, { borrowers }) => () => makeInitialState(borrowers),
  },
);

const withDisableSubmit = withProps(({ type, borrowerId, value, usageType }) => ({
  disableSubmit: !(
    type
      && borrowerId
      && value >= 0
      && (!shouldAskForUsageType(type) || usageType)
  ),
}));

const withStructureUpdate = connect(
  null,
  (dispatch, { structureId }) => ({
    updateLoan: wantedLoan =>
      dispatch(updateStructure(structureId, { wantedLoan })),
    updateOwnFunds: ownFunds =>
      dispatch(updateStructure(structureId, { ownFunds })),
  }),
);

const withAdditionalProps = withProps((props) => {
  const {
    disableSubmit,
    updateOwnFunds,
    updateLoan,
    handleClose,
    setLoading,
    borrowerId,
    type,
    value,
    usageType,
    handleChange,
    reset,
    ownFundsIndex,
    loan,
  } = props;
  const otherValueOfTypeAndBorrower = getOwnFundsOfTypeAndBorrower(props);

  const updateCleanup = () => {
    ClientEventService.emit(LOAD_LOAN);
    setLoading(false);
  };

  return {
    handleDelete: () => {
      updateOwnFunds(makeNewOwnFundsArray({ ...props, shouldDelete: true }));
      handleClose();
    },
    handleSubmit: (event) => {
      event.preventDefault();
      if (disableSubmit) {
        return false;
      }

      if (
        shouldAskForUsageType(type)
        && usageType === OWN_FUNDS_USAGE_TYPES.PLEDGE
      ) {
        updateLoan(getNewWantedLoanAfterPledge(props));
      }

      updateOwnFunds(makeNewOwnFundsArray(props));
      handleClose();

      if (ownFundsIndex === -1) {
        // Cleanup
        reset();
      }
    },
    handleUpdateBorrower: () => {
      setLoading(true);

      if (Calculator.isTypeWithArrayValues(type)) {
        const currentlyAvailable = getAvailableFundsOfTypeAndBorrower(props);
        const deltaNeeded = otherValueOfTypeAndBorrower + value - currentlyAvailable;
        return pushBorrowerValue
          .run({
            borrowerId,
            object: {
              [type]: { value: deltaNeeded, description: 'Ajout automatique' },
            },
          })
          .finally(updateCleanup);
      }

      return borrowerUpdate
        .run({
          borrowerId,
          object: { [type]: otherValueOfTypeAndBorrower + value },
        })
        .finally(updateCleanup);
    },
    handleCancelUpdateBorrower: remaining => () => {
      handleChange(remaining, FIELDS.VALUE);
    },
    types: chooseOwnFundsTypes(props),
    otherValueOfTypeAndBorrower,
    allowPledge: loan.general.residenceType === RESIDENCE_TYPE.MAIN_RESIDENCE,
  };
});

const FinancingStructuresOwnFundsPickerContainer = compose(
  SingleStructureContainer,
  FinancingStructuresDataContainer({ asArrays: true }),
  addState,
  withDisableSubmit,
  withStructureUpdate,
  withState('loading', 'setLoading', false),
  withAdditionalProps,
);

export default FinancingStructuresOwnFundsPickerContainer;
