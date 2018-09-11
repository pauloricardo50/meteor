import { compose, withProps, withStateHandlers } from 'recompose';
import { connect } from 'react-redux';

import { updateStructure } from '../../../../../redux/financingStructures';
import SingleStructureContainer from '../../containers/SingleStructureContainer';
import FinancingStructuresDataContainer from '../../containers/FinancingStructuresDataContainer';
import {
  chooseOwnFundsTypes,
  shouldAskForUsageType,
  makeNewOwnFundsArray,
} from './FinancingStructuresOwnFundsPickerHelpers';

export const FIELDS = {
  TYPE: 'type',
  USAGE_TYPE: 'usageType',
  BORROWER_ID: 'borrowerId',
  VALUE: 'value',
};

const addState = withStateHandlers(
  ({ structure, borrowers, ownFundsIndex }) => {
    if (!structure) {
      return {};
    }

    if (ownFundsIndex < 0) {
      return {
        [FIELDS.TYPE]: undefined,
        [FIELDS.USAGE_TYPE]: undefined,
        [FIELDS.BORROWER_ID]: borrowers[0]._id,
        [FIELDS.VALUE]: undefined,
      };
    }

    return structure.ownFunds[ownFundsIndex];
  },
  { handleChange: () => (value, id) => ({ [id]: value }) },
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
    updateOwnFunds: ownFunds =>
      dispatch(updateStructure(structureId, { ownFunds })),
  }),
);

const withAdditionalProps = withProps(({ disableSubmit, updateOwnFunds, handleClose, ...props }) => ({
  handleDelete: () => {
    updateOwnFunds(makeNewOwnFundsArray({ ...props, shouldDelete: true }));
    handleClose();
  },
  handleSubmit: (event) => {
    event.preventDefault();
    if (disableSubmit) {
      return false;
    }

    updateOwnFunds(makeNewOwnFundsArray(props));
    handleClose();
  },
  handleUpdateBorrower: () => {},
  types: chooseOwnFundsTypes(props),
}));

const FinancingStructuresOwnFundsPickerContainer = compose(
  SingleStructureContainer,
  FinancingStructuresDataContainer({ asArrays: true }),
  addState,
  withDisableSubmit,
  withStructureUpdate,
  withAdditionalProps,
);

export default FinancingStructuresOwnFundsPickerContainer;
