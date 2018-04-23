import { connect } from 'react-redux';
import { resetCalculator } from '../../../../redux/actions/widget1Actions';

const mapDispatchToProps = dispatch => ({
  onClick: () => dispatch(resetCalculator()),
});

export default connect(null, mapDispatchToProps);
