import { compose, withProps } from 'recompose';

import { OWN_FUNDS_USAGE_TYPES } from '../../../../../api/loans/loanConstants';
import Calculator from '../../../../../utils/Calculator';
import FinancingDataContainer from '../../containers/FinancingDataContainer';
import SingleStructureContainer from '../../containers/SingleStructureContainer';
import {
  getCurrentPledgedFunds,
  getMaxPledge,
} from './FinancingOwnFundsPickerHelpers';

const removePreviousValueEffect = ({ props, ownFundsIndex, ownFunds }) => {
  let requiredChange = 0;
  let currentChange = 0;
  // Editing existing value, cancel its effect
  const previousIsPledged =
    ownFunds[ownFundsIndex].usageType === OWN_FUNDS_USAGE_TYPES.PLEDGE;

  if (previousIsPledged) {
    const maxPledge = getMaxPledge(props);
    const previousPledgedValue = ownFunds[ownFundsIndex].value;
    requiredChange = Math.min(previousPledgedValue, maxPledge);
  } else {
    currentChange = -ownFunds[ownFundsIndex].value;
  }

  return { requiredChange, currentChange };
};

const removePledgingEffect = ({ props, ownFunds, ownFundsIndex, value }) => {
  const maxPledge = getMaxPledge(props);
  const currentPledgedFunds = getCurrentPledgedFunds({
    ownFunds,
    ownFundsIndex,
  });

  return {
    requiredChange: -Math.min(currentPledgedFunds + (value || 0), maxPledge),
    currentChange: -value || 0,
  };
};

export const getRequiredAndCurrentFunds = props => {
  const {
    value,
    structure: { ownFunds },
    ownFundsIndex,
    usageType,
  } = props;
  let required = Calculator.getRequiredOwnFunds(props);
  const previousNonPledgedFunds = ownFunds
    .filter(({ usageType: uT }) => uT !== OWN_FUNDS_USAGE_TYPES.PLEDGE)
    .reduce((sum, { value: v }) => sum + v, 0);
  let current = previousNonPledgedFunds + (value || 0);
  const isEditing = ownFundsIndex >= 0;

  if (isEditing) {
    const { requiredChange, currentChange } = removePreviousValueEffect({
      props,
      ownFundsIndex,
      ownFunds,
    });
    required += requiredChange;
    current += currentChange;
  }

  if (usageType === OWN_FUNDS_USAGE_TYPES.PLEDGE) {
    const { requiredChange, currentChange } = removePledgingEffect({
      props,
      ownFunds,
      ownFundsIndex,
      value,
    });
    required += requiredChange;
    current += currentChange;
  }

  return { required, current };
};

const OwnFundsCompleterContainer = compose(
  SingleStructureContainer,
  FinancingDataContainer,
  withProps(getRequiredAndCurrentFunds),
);

export default OwnFundsCompleterContainer;
