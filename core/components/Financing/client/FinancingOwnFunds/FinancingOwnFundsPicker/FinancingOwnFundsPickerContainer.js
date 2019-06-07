import { compose, withProps, withStateHandlers, withState } from 'recompose';

import {
  borrowerUpdate,
  pushBorrowerValue,
  updateStructure,
} from '../../../../../api';
import {
  OWN_FUNDS_USAGE_TYPES,
  RESIDENCE_TYPE,
} from '../../../../../api/constants';
import Calculator from '../../../../../utils/Calculator';
import SingleStructureContainer from '../../containers/SingleStructureContainer';
import FinancingDataContainer from '../../containers/FinancingDataContainer';
import {
  chooseOwnFundsTypes,
  shouldAskForUsageType,
  makeNewOwnFundsArray,
  getOwnFundsOfTypeAndBorrower,
  getAvailableFundsOfTypeAndBorrower,
  getNewWantedLoanAfterPledge,
} from './FinancingOwnFundsPickerHelpers';

export const FIELDS = {
  TYPE: 'type',
  USAGE_TYPE: 'usageType',
  BORROWER_ID: 'borrowerId',
  VALUE: 'value',
};

const makeInitialState = borrowers => ({
  [FIELDS.TYPE]: undefined,
  [FIELDS.USAGE_TYPE]: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
  [FIELDS.BORROWER_ID]: borrowers.length ? borrowers[0]._id : undefined,
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

const withStructureUpdate = withProps(({ loan: { _id: loanId }, structureId }) => ({
  updateLoan: wantedLoan =>
    updateStructure.run({ loanId, structureId, structure: { wantedLoan } }),
  updateOwnFunds: ownFunds =>
    updateStructure.run({ loanId, structureId, structure: { ownFunds } }),
}));

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
    handleUpdateBorrower: (event) => {
      if (event && event.preventDefault) {
        event.preventDefault();
      }
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
    allowPledge: loan.residenceType === RESIDENCE_TYPE.MAIN_RESIDENCE,
  };
});

const FinancingOwnFundsPickerContainer = compose(
  SingleStructureContainer,
  FinancingDataContainer,
  addState,
  withDisableSubmit,
  // StructureUpdateContainer,
  withStructureUpdate,
  withState('loading', 'setLoading', false),
  withAdditionalProps,
);

export default FinancingOwnFundsPickerContainer;
