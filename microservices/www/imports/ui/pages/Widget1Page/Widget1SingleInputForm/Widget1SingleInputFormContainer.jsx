import { connect } from 'react-redux';
import { SALARY, FORTUNE, PROPERTY } from '../Widget1Page';
import {
  setAuto,
  setStep,
  setValue,
} from '../../../../redux/actions/widget1Actions';

const order = [SALARY, FORTUNE, PROPERTY];

const mapStateToProps = ({ widget1 }, { name }) => ({
  ...widget1[name],
  disableSubmit: !widget1[name].value,
});

const mapDispatchToProps = (
  dispatch,
  { name, onClick = () => {}, disableSubmit },
) => {
  const nextStep = order.indexOf(name) + 1;

  return {
    onSubmit: (event) => {
      event.preventDefault();
      if (!disableSubmit) {
        onClick();
        dispatch(setStep(nextStep));
      }
    },
    onDoNotKnow: () => {
      onClick();
      dispatch(setStep(nextStep));
      dispatch(setAuto(name, true));
      dispatch(setValue(name, undefined));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps);
