//      
import { compose, withProps } from 'recompose';

import SingleStructureContainer from './SingleStructureContainer';
import withLoan from './withLoan';
import { updateStructure } from '../../../../api';

export default compose(
  withLoan,
  SingleStructureContainer,
  withProps(({ structure, id, loan }) => ({
    value: structure[id],
    updateStructure: value =>
      updateStructure.run({
        loanId: loan._id,
        structureId: structure.id,
        structure: typeof value === 'object' ? value : { [id]: value },
      }),
  })),
);
