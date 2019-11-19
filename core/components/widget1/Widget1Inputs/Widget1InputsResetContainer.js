import { connect } from 'react-redux';
import { widget1Actions } from '../../../redux/widget1';

const mapDispatchToProps = dispatch => ({
  onClick: () => dispatch(widget1Actions.resetCalculator()),
});

export default connect(null, mapDispatchToProps);
