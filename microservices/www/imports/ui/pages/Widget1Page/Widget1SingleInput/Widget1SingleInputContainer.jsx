import { connect } from 'react-redux';
import {
  setValue,
  setAuto,
  increaseSliderMax,
} from '../../../../redux/actions/widget1Actions';

export default connect(
  ({ widget1 }, { name }) => ({ ...widget1[name] }),
  (dispatch, { name }) => ({
    // FIXME: Number is a temporary hack
    setValue: value =>
      dispatch(setValue(name, value && Number.parseInt(value))),
    setAuto: () => dispatch(setAuto(name)),
    increaseSliderMax: () => dispatch(increaseSliderMax(name)),
  }),
);
