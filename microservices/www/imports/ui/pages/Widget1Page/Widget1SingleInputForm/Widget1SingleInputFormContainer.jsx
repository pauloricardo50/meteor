import { connect } from 'react-redux';
import {
  setAuto,
  setStep,
  setValue,
} from '../../../../redux/actions/widget1Actions';
import {
  SALARY,
  FORTUNE,
  PROPERTY,
} from '../../../../redux/constants/widget1Constants';

const order = [PROPERTY, SALARY, FORTUNE];

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
