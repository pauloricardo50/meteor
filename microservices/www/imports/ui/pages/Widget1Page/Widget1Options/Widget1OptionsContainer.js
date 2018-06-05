import { connect } from 'react-redux';
import { setValueAction } from '../../../../redux/reducers/widget1';

const mapStateToProps = ({ widget1: { usageType, purchaseType } }) => ({
  usageType,
  purchaseType,
});

const mapDispatchToProps = dispatch => ({
  setUsageType: (_, value) =>
    dispatch({ type: setValueAction('usageType'), value }),
  setPurchaseType: (_, value) =>
    dispatch({ type: setValueAction('purchaseType'), value }),
});

export default connect(mapStateToProps, mapDispatchToProps);
