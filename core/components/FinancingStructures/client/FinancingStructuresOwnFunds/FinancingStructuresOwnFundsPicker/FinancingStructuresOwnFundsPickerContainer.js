import { compose, withProps, withStateHandlers } from 'recompose';
import SingleStructureContainer from '../../containers/SingleStructureContainer';
import FinancingStructuresDataContainer from '../../containers/FinancingStructuresDataContainer';

export const FIELDS = {
  TYPE: 'type',
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
  withProps(({ disableSubmit }) => ({
    handleDelete: () => {},
    handleSubmit: () => {
      if (disableSubmit) {
        return false;
      }
    },
    handleUpdateBorrower: () => {},
    types: [
      'fortuneUsed',
      'secondPillarPledged',
      'secondPillarWithdrawal',
      'thirdPillarPledged',
      'thirdPillarWithdrawal',
      'thirdPartyFortuneUsed',
    ],
  })),
);

export default FinancingStructuresOwnFundsPickerContainer;
