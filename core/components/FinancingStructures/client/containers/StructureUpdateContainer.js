// @flow
import { connect } from 'react-redux';
import {
  makeSelectStructureValue,
  updateStructure,
} from '../../../../redux/financingStructures';

const mapStateToProps = (state, { id, structureId }) => ({
  value: makeSelectStructureValue(structureId, id)(state),
});

const mapDispatchToProps = (dispatch, { id, structureId }) => ({
  handleChange: value =>
    dispatch(updateStructure(structureId, { [id]: value })),
});

const StructureUpdateContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default StructureUpdateContainer;
