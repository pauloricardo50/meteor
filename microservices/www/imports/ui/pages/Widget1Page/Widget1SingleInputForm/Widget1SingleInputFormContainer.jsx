import { connect } from 'react-redux';
import { SALARY, FORTUNE, PROPERTY } from '../Widget1Page';
import {
  setAuto,
  suggestValues,
} from '../../../../redux/actions/widget1Actions';
import { FINAL_STEP } from '../../../../redux/reducers/widget1';

const order = [SALARY, FORTUNE, PROPERTY];

export default connect(
  ({ widget1 }, { name }) => ({
    ...widget1[name],
    disableSubmit: !widget1[name].value,
  }),
  (dispatch, { name, onClick = () => {}, disableSubmit }) => {
    const nextStep = order.indexOf(name) + 1;

    return {
      onSubmit: (event) => {
        event.preventDefault();
        if (!disableSubmit) {
          onClick();
          dispatch({ type: 'step.SET', value: nextStep });
          const willBeFinalStep = nextStep === FINAL_STEP;
          if (willBeFinalStep) {
            // Special exception here, as suggestValues only runs once
            // the widget1 is at the FINAL_STEP. Suggest values should be run
            // if the user enters a value here
            dispatch(suggestValues());
          }
        }
      },
      onDoNotKnow: () => {
        onClick();
        dispatch({ type: 'step.SET', value: nextStep });
        dispatch(setAuto(name));
      },
    };
  },
);
