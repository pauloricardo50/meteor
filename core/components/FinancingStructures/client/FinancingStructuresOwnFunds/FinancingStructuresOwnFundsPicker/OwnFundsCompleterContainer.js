import { compose, withProps } from 'recompose';

import FinancingStructuresDataContainer from '../../containers/FinancingStructuresDataContainer';
import SingleStructureContainer from '../../containers/SingleStructureContainer';
import {
  calculateMissingOwnFunds,
  calculateRequiredOwnFunds,
} from '../FinancingStructuresOwnFunds';

const OwnFundsCompleterContainer = compose(
  SingleStructureContainer,
  FinancingStructuresDataContainer({ asArrays: true }),
  withProps((props) => {
    const fundsToAdd = calculateMissingOwnFunds(props);
    const required = calculateRequiredOwnFunds(props);

    return { required, current: required - fundsToAdd };
  }),
);

export default OwnFundsCompleterContainer;
