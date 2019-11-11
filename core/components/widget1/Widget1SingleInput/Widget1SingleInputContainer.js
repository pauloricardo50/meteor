import { connect } from 'react-redux';
import { withProps, compose } from 'recompose';
import { toNumber } from 'core/utils/conversionFunctions';
import { widget1Constants, widget1Actions } from '../../../redux/widget1';

const isLoanValue = name => widget1Constants.CAPPED_FIELDS.includes(name);

const getSliderMax = (widget1, name) => {
  if (isLoanValue(name)) {
    return widget1Actions.getPropertyCappedValue(name, { widget1 });
  }

  return widget1[name].sliderMax;
};

const withConnect = connect(
  ({ widget1 }, { name }) => ({
    ...widget1[name],
    sliderMax: getSliderMax(widget1, name),
    isLoanValue: isLoanValue(name),
    purchaseType: widget1.purchaseType,
  }),
  (dispatch, { name }) => ({
    setInputValue: event => {
      let { value } = event.target;
      if (value) {
        value = toNumber(value);
      }
      dispatch(widget1Actions.setValue(name, value));
    },
    setValue: value => dispatch(widget1Actions.setValue(name, value)),
    unsetValue: () => dispatch(widget1Actions.setValue(name, '')),
    setAuto: () => dispatch(widget1Actions.setAuto(name)),
    increaseSliderMax: () => {
      if (isLoanValue(name)) {
        return dispatch(widget1Actions.setAllowExtremeLoan(name));
      }
      return dispatch(widget1Actions.increaseSliderMax(name));
    },
  }),
);

const withCorrectPropertyName = withProps(({ name, purchaseType }) => ({
  labelName:
    name === widget1Constants.PROPERTY &&
    purchaseType === widget1Constants.PURCHASE_TYPE.REFINANCING
      ? 'propertyValue'
      : undefined,
}));

export default compose(withConnect, withCorrectPropertyName);
