import { connect } from 'react-redux';
import { widget1Constants, widget1Types } from '../../../redux/widget1';
import { commonTypes } from '../../../redux/common';

const mapStateToProps = ({ widget1: { purchaseType } }) => ({
  purchaseType,
});

const mapDispatchToProps = dispatch => ({
  setPurchaseType: value => {
    dispatch({ type: commonTypes.SET_VALUE('purchaseType'), value });
    if (value === widget1Constants.PURCHASE_TYPE.REFINANCING) {
      dispatch({ type: widget1Types.SET_AUTO('property'), auto: false });
      dispatch({ type: widget1Types.SET_AUTO('currentLoan'), auto: false });
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
