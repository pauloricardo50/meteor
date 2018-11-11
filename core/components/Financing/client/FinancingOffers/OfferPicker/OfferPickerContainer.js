import { compose } from 'recompose';

import SingleStructureContainer from '../../containers/SingleStructureContainer';
import StructureUpdateContainer from '../../containers/StructureUpdateContainer';
import FinancingDataContainer from '../../containers/FinancingDataContainer';

export default compose(
  FinancingDataContainer,
  SingleStructureContainer,
  StructureUpdateContainer,
);
