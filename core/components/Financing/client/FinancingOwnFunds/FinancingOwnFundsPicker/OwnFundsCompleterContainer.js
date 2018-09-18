import { compose, withProps } from 'recompose';

import { OWN_FUNDS_USAGE_TYPES } from 'core/api/constants';
import FinancingDataContainer from '../../containers/FinancingDataContainer';
import SingleStructureContainer from '../../containers/SingleStructureContainer';
import {
  calculateMissingOwnFunds,
  calculateRequiredOwnFunds,
} from '../ownFundsHelpers';
import {
  getCurrentPledgedFunds,
  getMaxPledge,
} from './FinancingOwnFundsPickerHelpers';

export const getRequiredAndCurrentFunds = (props) => {
  const {
    value,
    structure: { ownFunds },
    ownFundsIndex,
    usageType,
  } = props;
  let pledgeAjustedValue = value || 0; // Avoid initialization issues
  let newPledgeCoveredValue = 0;
  let initialDiscountedValue = ownFundsIndex < 0 ? 0 : ownFunds[ownFundsIndex].value;
  const fundsToAdd = calculateMissingOwnFunds(props);
  const required = calculateRequiredOwnFunds(props);

  if (usageType === OWN_FUNDS_USAGE_TYPES.PLEDGE) {
    const currentPledgedFunds = getCurrentPledgedFunds({
      ownFunds,
      ownFundsIndex,
    });
    const maxPledge = getMaxPledge(props);
    initialDiscountedValue = 0;
    pledgeAjustedValue = 0;
    newPledgeCoveredValue = Math.min(
      currentPledgedFunds + value || 0,
      maxPledge,
    ); // Avoid initialization issues
  }

  return {
    required: required - newPledgeCoveredValue,
    current:
      required - fundsToAdd - initialDiscountedValue + pledgeAjustedValue,
  };
};

const OwnFundsCompleterContainer = compose(
  SingleStructureContainer,
  FinancingDataContainer({ asArrays: true }),
  withProps(getRequiredAndCurrentFunds),
);

export default OwnFundsCompleterContainer;
