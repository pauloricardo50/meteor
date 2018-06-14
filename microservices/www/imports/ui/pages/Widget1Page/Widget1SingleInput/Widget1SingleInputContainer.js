import { connect } from 'react-redux';
import { toNumber } from 'core/utils/conversionFunctions';
import {
  setValue,
  setAuto,
  setAllowExtremeLoan,
  increaseSliderMax,
  getPropertyCappedValue,
} from '../../../../redux/actions/widget1Actions';
import { CAPPED_FIELDS } from '../../../../redux/constants/widget1Constants';

const isLoanValue = name => CAPPED_FIELDS.includes(name);

const getSliderMax = (widget1, name) => {
  if (isLoanValue(name)) {
    return getPropertyCappedValue(name, { widget1 });
  }

  return widget1[name].sliderMax;
};

export default connect(
  ({ widget1 }, { name }) => ({
    ...widget1[name],
    sliderMax: getSliderMax(widget1, name),
    isLoanValue: isLoanValue(name),
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
