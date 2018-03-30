import { connect } from 'react-redux';
import { SALARY, FORTUNE, PROPERTY } from '../Widget1Page';

const order = [SALARY, FORTUNE, PROPERTY];

export default connect(
  ({ widget1 }, { name }) => ({ ...widget1[name] }),
  (dispatch, { name, onSubmit = () => {}, onClick = () => {} }) => {
    const index = order.indexOf(name);

    return {
      onSubmit: (event) => {
        event.preventDefault();
        onSubmit();
        dispatch({ type: 'step.SET', value: index + 1 });
      },
      onClick: () => {
        onClick();
        dispatch({ type: 'step.SET', value: index + 1 });
      },
    };
  },
);
