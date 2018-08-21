import { withProps, compose } from 'recompose';
import { connect } from 'react-redux';
import SingleStructureContainer from '../containers/SingleStructureContainer';
import { updateStructure as updateStructureAction } from '../../../../redux/financingStructures';

const FinancingStructuresSingleHeaderContainer = compose(
  SingleStructureContainer,
  connect(
    null,
    dispatch => ({
      updateStructure: (structureId, object) =>
        dispatch(updateStructureAction(structureId, object)),
    }),
  ),
  withProps(({ structure, updateStructure }) => ({
    handleEditTitle: (name) => {
      updateStructure(structure.id, { name });
      return Promise.resolve();
    },
    handleEditDescription: (description) => {
      updateStructure(structure.id, { description });
      return Promise.resolve();
    },
  })),
);

export default FinancingStructuresSingleHeaderContainer;
