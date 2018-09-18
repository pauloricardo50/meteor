import { connect } from 'react-redux';
import { makeSelectStructure } from '../../../../redux/financing';

export default connect((state, { structureId }) => ({
  structure: makeSelectStructure(structureId)(state),
}));
