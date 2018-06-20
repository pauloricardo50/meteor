import { connect } from 'react-redux';
import { withProps, compose } from 'recompose';
import { toNumber } from 'core/utils/conversionFunctions';
import {
  setValue,
  setAuto,
  setAllowExtremeLoan,
  increaseSliderMax,
  getPropertyCappedValue,
} from '../../../../redux/actions/widget1Actions';
import {
  CAPPED_FIELDS,
  PURCHASE_TYPE,
  PROPERTY,
} from '../../../../redux/constants/widget1Constants';

const isLoanValue = name => CAPPED_FIELDS.includes(name);

const getSliderMax = (widget1, name) => {
  if (isLoanValue(name)) {
    return getPropertyCappedValue(name, { widget1 });
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
    setInputValue: (event) => {
      let { value } = event.target;
      if (value) {
        value = toNumber(value);
      }
      dispatch(setValue(name, value));
    },
    setValue: value => dispatch(setValue(name, value)),
    unsetValue: () => dispatch(setValue(name, '')),
    setAuto: () => dispatch(setAuto(name)),
    increaseSliderMax: () => {
      if (isLoanValue(name)) {
        return dispatch(setAllowExtremeLoan(name));
      }
      return dispatch(increaseSliderMax(name));
    },
  }),
);

const withCorrectPropertyName = withProps(({ name, purchaseType }) => ({
  labelName:
    name === PROPERTY && purchaseType === PURCHASE_TYPE.REFINANCING
      ? 'propertyValue'
      : undefined,
}));

export default compose(withConnect, withCorrectPropertyName);
