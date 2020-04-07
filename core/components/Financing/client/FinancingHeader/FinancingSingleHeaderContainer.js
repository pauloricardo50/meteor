import { compose, withProps } from 'recompose';

import StructureUpdateContainer from '../containers/StructureUpdateContainer';

const FinancingSingleHeaderContainer = compose(
  StructureUpdateContainer,
  withProps(({ updateStructure }) => ({
    handleEditTitle: name => updateStructure({ name }),
    handleEditDescription: description => updateStructure({ description }),
  })),
);

export default FinancingSingleHeaderContainer;
