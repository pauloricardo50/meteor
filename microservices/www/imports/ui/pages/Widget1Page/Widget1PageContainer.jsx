import { connect } from 'react-redux';

export default connect(({ widget1: { step } }) => ({ step }));
