import { withStateHandlers, lifecycle, withState, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';

import { compose } from 'core/api/containerToolkit/index';
import withMatchParam from 'core/containers/withMatchParam';

import { getUserByPasswordResetToken } from 'core/api';

export default compose(
  withMatchParam('token'),
  withState('error', 'setError', null),
  withRouter,
  withStateHandlers(
    { newPassword: '', newPassword2: '' },
    { handleChange: () => (event, key) => ({ [key]: event.target.value }) },
  ),
  withState('submitting', 'changeSubmitting', false),
  withProps(({ newPassword, token, history, setError, changeSubmitting }) => ({
    handleSubmit: event => {
      event.preventDefault();
      changeSubmitting(true);
      Accounts.resetPassword(token, newPassword, err => {
        if (err) {
          setError(err);
        } else {
          history.push('/');
        }
        changeSubmitting(false);
      });
    },
  })),
  lifecycle({
    componentDidMount() {
      return getUserByPasswordResetToken
        .run({ token: this.props.token })
        .then(user => this.setState({ user }))
        .catch(this.props.setError);
    },
  }),
);
