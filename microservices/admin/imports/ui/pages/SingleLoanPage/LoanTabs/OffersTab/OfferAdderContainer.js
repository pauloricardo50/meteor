import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { FORM_NAME, HAS_COUNTERPARTS, IS_DISCOUNT } from './constants';

const selector = formValueSelector(FORM_NAME);

export default connect(state => ({
  [HAS_COUNTERPARTS]: selector(state, HAS_COUNTERPARTS),
  [IS_DISCOUNT]: selector(state, IS_DISCOUNT),
}));
