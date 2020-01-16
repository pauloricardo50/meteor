import {
  compose,
  withProps,
  withStateHandlers,
  withState,
  lifecycle,
} from 'recompose';

import { MIN_INSURANCE2_WITHDRAW } from 'core/config/financeConstants';
import {
  borrowerUpdate,
  pushBorrowerValue,
  updateStructure,
} from '../../../../../api';
import {
  OWN_FUNDS_USAGE_TYPES,
  RESIDENCE_TYPE,
  OWN_FUNDS_TYPES,
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

const getInitialState = ({ structure, borrowers, ownFundsIndex }) => {
  // On load, the redux store has not loaded yet, causing this to crash
  // if we don't add this simple check
  if (!structure) {
    return {};
  }

  // New ownFunds object
  if (ownFundsIndex < 0) {
    return {
      [FIELDS.TYPE]: undefined,
      [FIELDS.USAGE_TYPE]: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
      [FIELDS.BORROWER_ID]: borrowers[0]._id,
      [FIELDS.VALUE]: undefined,
    };
  }

  // When editing existing ownFunds object
  return structure.ownFunds[ownFundsIndex];
};

const addState = withStateHandlers(getInitialState, {
  handleChange: () => (value, id) => ({ [id]: value }),
  reset: (_, props) => () => getInitialState(props),
});

const withDisableSubmit = withProps(
  ({ type, borrowerId, value, usageType }) => {
    const pickedOwnFundIsInvalid = !(
      type &&
      borrowerId &&
      value >= 0 &&
      (!shouldAskForUsageType(type) || usageType)
    );
    const insurance2WithdrawIsTooLow =
      type === OWN_FUNDS_TYPES.INSURANCE_2 &&
      usageType === OWN_FUNDS_USAGE_TYPES.WITHDRAW &&
      value < MIN_INSURANCE2_WITHDRAW;

    return {
      disableSubmit: pickedOwnFundIsInvalid || insurance2WithdrawIsTooLow,
    };
  },
);

const withStructureUpdate = withProps(
  ({ loan: { _id: loanId }, structureId }) => ({
    updateLoan: wantedLoan =>
      updateStructure.run({ loanId, structureId, structure: { wantedLoan } }),
    updateOwnFunds: ownFunds =>
      updateStructure.run({ loanId, structureId, structure: { ownFunds } }),
  }),
);

const withAdditionalProps = withProps(props => {
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
    handleSubmit: event => {
      event.preventDefault();
      if (disableSubmit) {
        return false;
      }

      if (
        shouldAskForUsageType(type) &&
        usageType === OWN_FUNDS_USAGE_TYPES.PLEDGE
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
    handleUpdateBorrower: event => {
      if (event && event.preventDefault) {
        event.preventDefault();
      }
      setLoading(true);

      if (Calculator.isTypeWithArrayValues(type)) {
        const currentlyAvailable = getAvailableFundsOfTypeAndBorrower(props);
        const deltaNeeded =
          otherValueOfTypeAndBorrower + value - currentlyAvailable;
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
  lifecycle({
    UNSAFE_componentWillReceiveProps({
      structure: { ownFunds: nextFunds },
      ownFundsIndex: nextIndex,
    }) {
      const {
        structure: { ownFunds },
        ownFundsIndex,
      } = this.props;
      if (
        JSON.stringify(ownFunds[ownFundsIndex]) !==
        JSON.stringify(nextFunds[nextIndex])
      ) {
        this.props.reset();
      }
    },
  }),
  withDisableSubmit,
  withStructureUpdate,
  withState('loading', 'setLoading', false),
  withAdditionalProps,
);

export default FinancingOwnFundsPickerContainer;
