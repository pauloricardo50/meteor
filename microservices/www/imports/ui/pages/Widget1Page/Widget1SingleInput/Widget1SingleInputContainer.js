import { connect } from 'react-redux';
import { toNumber } from 'core/utils/conversionFunctions';
import {
  setValue,
  setAuto,
  increaseSliderMax,
} from '../../../../redux/actions/widget1Actions';
import {
  CAPPED_FIELDS,
  PROPERTY,
} from '../../../../redux/constants/widget1Constants';

const getSliderMax = (widget1, name) => {
  if (CAPPED_FIELDS.includes(name)) {
    return widget1[PROPERTY].value;
  }

  return widget1[name].sliderMax;
};

export default connect(
  ({ widget1 }, { name }) => ({
    ...widget1[name],
    sliderMax: getSliderMax(widget1, name),
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
    increaseSliderMax: () => dispatch(increaseSliderMax(name)),
  }),
);
