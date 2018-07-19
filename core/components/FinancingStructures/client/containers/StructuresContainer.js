import { connect } from 'react-redux';
import { selectStructuresArray } from '../../../../redux/financingStructures';

export default connect((state) => {
  console.log('structs?', selectStructuresArray(state));

  return {
    structures: selectStructuresArray(state),
  };
});
