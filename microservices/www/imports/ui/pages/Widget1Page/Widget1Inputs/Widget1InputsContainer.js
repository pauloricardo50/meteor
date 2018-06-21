import { connect } from 'react-redux';

import { widget1Selectors } from '../../../../redux/widget1';

const mapStateToProps = state => ({
  fields: widget1Selectors.selectFields(state),
});

export default connect(mapStateToProps);
