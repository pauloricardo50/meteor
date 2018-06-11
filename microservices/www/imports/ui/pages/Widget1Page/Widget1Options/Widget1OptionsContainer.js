import { connect } from 'react-redux';
import { setValueAction } from '../../../../redux/reducers/widget1';

const mapStateToProps = ({ widget1: { purchaseType } }) => ({
  purchaseType,
});

const mapDispatchToProps = dispatch => ({
  setPurchaseType: (_, value) =>
    dispatch({ type: setValueAction('purchaseType'), value }),
});

export default connect(mapStateToProps, mapDispatchToProps);
