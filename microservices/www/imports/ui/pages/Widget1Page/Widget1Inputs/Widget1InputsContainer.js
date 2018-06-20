import { connect } from 'react-redux';

import { selectFields } from '../../../../redux/reducers/widget1';

const mapStateToProps = state => ({ fields: selectFields(state) });

export default connect(mapStateToProps);
