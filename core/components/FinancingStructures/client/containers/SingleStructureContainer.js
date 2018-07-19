import { connect } from 'react-redux';
import { makeSelectStructure } from '../../../../redux/financingStructures';

export default connect((state, { structureId }) => ({
  structure: makeSelectStructure(structureId)(state),
}));
