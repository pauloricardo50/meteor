import { connect } from 'react-redux';
import {
  setValueAction,
  setAutoAction,
} from '../../../../redux/reducers/widget1';
import { PURCHASE_TYPE } from '../../../../redux/constants/widget1Constants';

const mapStateToProps = ({ widget1: { purchaseType } }) => ({
  purchaseType,
});

const mapDispatchToProps = dispatch => ({
  setPurchaseType: (_, value) => {
    dispatch({ type: setValueAction('purchaseType'), value });
    if (value === PURCHASE_TYPE.REFINANCING) {
      dispatch({ type: setAutoAction('property'), auto: false });
      dispatch({ type: setAutoAction('currentLoan'), auto: false });
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
