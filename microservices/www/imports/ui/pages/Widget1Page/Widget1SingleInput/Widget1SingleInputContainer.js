import { connect } from 'react-redux';
import { toNumber } from 'core/utils/conversionFunctions';
import {
  setValue,
  setAuto,
  increaseSliderMax,
} from '../../../../redux/actions/widget1Actions';

export default connect(
  ({ widget1 }, { name }) => ({ ...widget1[name] }),
  (dispatch, { name }) => ({
    setInputValue: (event) => {
      let { value } = event.target;
      if (value) {
        value = toNumber(value);
      }
      dispatch(setValue(name, value));
    },
    setValue: value => dispatch(setValue(name, value)),
    unsetValue: () => {
      dispatch(setAuto(name, false));
      dispatch(setValue(name, undefined));
    },
    setAuto: () => dispatch(setAuto(name)),
    increaseSliderMax: () => dispatch(increaseSliderMax(name)),
  }),
);
