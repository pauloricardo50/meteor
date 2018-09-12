import { compose, withProps } from 'recompose';

import { OWN_FUNDS_USAGE_TYPES } from 'core/api/constants';
import FinancingStructuresDataContainer from '../../containers/FinancingStructuresDataContainer';
import SingleStructureContainer from '../../containers/SingleStructureContainer';
import { calculateMaxLoan } from '../../FinancingStructuresFinancing/FinancingStructuresFinancing';
import {
  calculateMissingOwnFunds,
  calculateRequiredOwnFunds,
} from '../ownFundsHelpers';
import { getNewWantedLoanAfterPledge } from './FinancingStructuresOwnFundsPickerHelpers';

export const getRequiredAndCurrentFunds = (props) => {
  const {
    value,
    structure: { ownFunds, wantedLoan },
    ownFundsIndex,
    usageType,
  } = props;
  let pledgeAjustedValue = value || 0; // Avoid initialization issues
  let newPledgeCoveredValue = 0;
  const maxLoanWithNewPledge = getNewWantedLoanAfterPledge(props);
  let initialDiscountedValue = ownFundsIndex < 0 ? 0 : ownFunds[ownFundsIndex].value;
  const fundsToAdd = calculateMissingOwnFunds(props);
  const required = calculateRequiredOwnFunds(props);

  if (usageType === OWN_FUNDS_USAGE_TYPES.PLEDGE) {
    initialDiscountedValue = 0;
    pledgeAjustedValue = 0;
    newPledgeCoveredValue = value || 0; // Avoid initialization issues
  }

  return {
    required: required - newPledgeCoveredValue,
    current:
      required - fundsToAdd - initialDiscountedValue + pledgeAjustedValue,
  };
};

const OwnFundsCompleterContainer = compose(
  SingleStructureContainer,
  FinancingStructuresDataContainer({ asArrays: true }),
  withProps(getRequiredAndCurrentFunds),
);

export default OwnFundsCompleterContainer;
