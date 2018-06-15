import { connect } from 'react-redux';
import {
  setAuto,
  setStep,
  setValue,
} from '../../../../redux/actions/widget1Actions';
import { selectFields } from '../../../../redux/reducers/widget1';

const mapStateToProps = ({ widget1 }, { name }) => ({
  ...widget1[name],
  disableSubmit: !widget1[name].value,
  fields: selectFields({ widget1 }),
});

const mergeProps = (
  { fields, ...stateProps },
  { dispatch },
  { name, onClick = () => {}, disableSubmit, ...ownProps },
) => {
  const nextStep = fields.indexOf(name) + 1;

  return {
    ...stateProps,
    ...ownProps,
    name,
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

export default connect(mapStateToProps, null, mergeProps);
