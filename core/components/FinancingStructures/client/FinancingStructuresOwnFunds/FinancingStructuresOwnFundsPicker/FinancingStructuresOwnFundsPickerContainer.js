import { compose, withProps, withStateHandlers } from 'recompose';

import SingleStructureContainer from '../../containers/SingleStructureContainer';
import FinancingStructuresDataContainer from '../../containers/FinancingStructuresDataContainer';
import {
  chooseOwnFundsTypes,
  shouldAskForUsageType,
} from './FinancingStructuresOwnFundsPickerHelpers';

export const FIELDS = {
  TYPE: 'type',
  USAGE_TYPE: 'usageType',
  BORROWER_ID: 'borrowerId',
  VALUE: 'value',
};

const addState = withStateHandlers(
  ({ structure: { ownFunds }, borrowers }) => ({
    [FIELDS.TYPE]: undefined,
    [FIELDS.USAGE_TYPE]: undefined,
    [FIELDS.BORROWER_ID]: borrowers[0]._id,
    [FIELDS.VALUE]: undefined,
  }),
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

const withAdditionalProps = withProps(({ disableSubmit, ...props }) => ({
  handleDelete: () => {},
  handleSubmit: () => {
    if (disableSubmit) {
      return false;
    }
  },
  handleUpdateBorrower: () => {},
  types: chooseOwnFundsTypes(props),
}));

const FinancingStructuresOwnFundsPickerContainer = compose(
  SingleStructureContainer,
  FinancingStructuresDataContainer({ asArrays: true }),
  addState,
  withDisableSubmit,
  withAdditionalProps,
);

export default FinancingStructuresOwnFundsPickerContainer;
