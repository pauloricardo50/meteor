import { withState, compose, withProps } from 'recompose';
import { connect } from 'react-redux';

import { updateStructure } from '../../../../redux/financing';
import StructureUpdateContainer from '../containers/StructureUpdateContainer';
import FinancingDataContainer from '../containers/FinancingDataContainer';
import SingleStructureContainer from '../containers/SingleStructureContainer';
import { calculateRequiredOwnFunds } from './ownFundsHelpers';

export const completeValue = (data, fundsToAdd) => {
  const { value, max } = data;

  if (fundsToAdd === 0) {
    return value;
  }

  if (fundsToAdd < 0) {
    return Math.max(value + fundsToAdd, 0);
  }

  const maximumValue = max(data);

  return Math.min(maximumValue, value + fundsToAdd);
};

const isPledgedValue = id => id.endsWith('Pledged');

const makeHandleClick = (props, activateButton, fundsToAdd) => () => {
  if (!activateButton) {
    return;
  }

  const { handleChange, id, increaseWantedLoan, value } = props;
  const updatedValue = completeValue(props, fundsToAdd);
  handleChange(updatedValue);

  if (isPledgedValue(id)) {
    const loanIncrease = updatedValue - value;
    increaseWantedLoan(loanIncrease);
  }
};

const withConnect = connect(
  null,
  (dispatch, { structureId, structure: { wantedLoan } }) => ({
    increaseWantedLoan: increment =>
      dispatch(updateStructure(structureId, { wantedLoan: wantedLoan + increment })),
  }),
);

const OwnFundsCompleterContainer = compose(
  SingleStructureContainer,
  FinancingDataContainer({ asArrays: true }),
  StructureUpdateContainer,
  withState('hovering', 'setHover', false),
  withConnect,
  withProps((props) => {
    const fundsToAdd = calculateRequiredOwnFunds(props);
    const activateButton = fundsToAdd !== 0;

    return {
      activateButton,
      handleClick: makeHandleClick(props, activateButton, fundsToAdd),
    };
  }),
);

export default OwnFundsCompleterContainer;
