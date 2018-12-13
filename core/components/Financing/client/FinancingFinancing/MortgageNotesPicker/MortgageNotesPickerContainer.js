import { withProps, compose } from 'recompose';
import FinancingDataContainer from '../../containers/FinancingDataContainer';
import SingleStructureContainer from '../../containers/SingleStructureContainer';
import { getProperty } from '../../FinancingCalculator';

export default compose(
  FinancingDataContainer,
  SingleStructureContainer,
  withProps((data) => {
    const { mortgageNotes = [] } = getProperty(data);
    return { currentMortgageNotes: [...mortgageNotes] };
  }),
);
