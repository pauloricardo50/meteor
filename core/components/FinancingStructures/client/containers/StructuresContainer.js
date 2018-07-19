import { connect } from 'react-redux';
import { selectStructuresArray } from '../../../../redux/financingStructures';

export default connect(state => ({
  structures: selectStructuresArray(state),
}));
