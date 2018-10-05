import { Meteor } from 'meteor/meteor';
import {
  withStateHandlers,
  lifecycle,
  withState,
  withProps,
  compose,
} from 'recompose';
import { withRouter } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';

import withMatchParam from 'core/containers/withMatchParam';
import { getUserByPasswordResetToken } from 'core/api';

const stateHandlers = withStateHandlers(
  { newPassword: '', newPassword2: '' },
  { handleChange: () => (event, key) => ({ [key]: event.target.value }) },
);

const props = withProps(({ newPassword, token, history, setError, changeSubmitting }) => ({
  handleSubmit: (event) => {
    event.preventDefault();
    changeSubmitting(true);
    Accounts.resetPassword(token, newPassword, (err) => {
      if (err) {
        setError(err);
      } else {
        history.push('/');
      }
      changeSubmitting(false);
    });
  },
}));

const lifeCycle = lifecycle({
  componentDidMount() {
    if (Meteor.user()) {
      // Avoid multi user issues
      Meteor.logout();
    }
    return getUserByPasswordResetToken
      .run({ token: this.props.token })
      .then((user) => {
        if (!user) {
          throw new Error('user not found');
        }
        this.setState({ user });
      })
      .catch(this.props.setError);
  },
});

export default compose(
  withMatchParam('token'),
  withState('error', 'setError', null),
  withRouter,
  stateHandlers,
  withState('submitting', 'changeSubmitting', false),
  props,
  lifeCycle,
);
