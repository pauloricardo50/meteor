import { connect } from 'react-redux';
import { selectStructuresArray } from '../../../../redux/financing';

export default connect(state => ({
  structures: selectStructuresArray(state),
}));
