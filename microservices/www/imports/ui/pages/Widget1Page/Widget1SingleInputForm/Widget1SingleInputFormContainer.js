import { connect } from 'react-redux';
import { widget1Selectors, widget1Actions } from '../../../../redux/widget1';

const mapStateToProps = ({ widget1 }, { name }) => ({
  ...widget1[name],
  disableSubmit: !widget1[name].value,
  fields: widget1Selectors.selectFields({ widget1 }),
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
        dispatch(widget1Actions.setStep(nextStep));
      }
    },
    onDoNotKnow: () => {
      onClick();
      dispatch(widget1Actions.setStep(nextStep));
      dispatch(widget1Actions.setAuto(name, true));
      dispatch(widget1Actions.setValue(name, undefined));
    },
  };
};

export default connect(
  mapStateToProps,
  null,
  mergeProps,
);
