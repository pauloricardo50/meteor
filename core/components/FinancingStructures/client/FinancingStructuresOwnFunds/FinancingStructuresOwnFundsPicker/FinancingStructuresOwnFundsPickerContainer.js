import { compose, withProps, withStateHandlers } from 'recompose';

import SingleStructureContainer from '../../containers/SingleStructureContainer';
import FinancingStructuresDataContainer from '../../containers/FinancingStructuresDataContainer';
import { OWN_FUNDS_TYPES } from '../../../../../api/constants';
import { chooseOwnFundsTypes } from './FinancingStructuresOwnFundsPickerHelpers';

export const FIELDS = {
  TYPE: 'type',
  USAGE_TYPE: 'usageType',
  BORROWER_ID: 'borrowerId',
  VALUE: 'value',
};

const FinancingStructuresOwnFundsPickerContainer = compose(
  SingleStructureContainer,
  FinancingStructuresDataContainer({ asArrays: true }),
  withStateHandlers(
    ({ structure: { ownFunds }, borrowers }) => ({
      [FIELDS.TYPE]: undefined,
      [FIELDS.BORROWER_ID]: borrowers[0]._id,
      [FIELDS.VALUE]: undefined,
    }),
    { handleChange: () => (value, id) => ({ [id]: value }) },
  ),
  withProps((type, borrowerId, value) => ({
    disableSubmit: !(type && borrowerId && value),
  })),
  withProps(({ disableSubmit, ...props }) => ({
    handleDelete: () => {},
    handleSubmit: () => {
      if (disableSubmit) {
        return false;
      }
    },
    handleUpdateBorrower: () => {},
    types: chooseOwnFundsTypes(props),
  })),
);

export default FinancingStructuresOwnFundsPickerContainer;
