import { connect } from 'react-redux';
import { setValue, setAuto } from '../../../../redux/actions/widget1Actions';

export default connect(
  ({ widget1 }, { name }) => ({
    ...widget1[name],
  }),
  (dispatch, { name }) => ({
    // FIXME: Number is a temporary hack
    setValue: event =>
      dispatch(setValue(
        name,
        event.target.value && Number.parseInt(event.target.value),
      )),
    setAuto: () => dispatch(setAuto(name)),
  }),
);
