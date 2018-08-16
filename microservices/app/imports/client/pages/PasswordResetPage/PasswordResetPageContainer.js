import { Accounts } from 'meteor/accounts-base';
import { withStateHandlers, lifecycle, withState, compose } from 'recompose';

import { getUserByPasswordResetToken } from 'core/api';
import withMatchParam from '../../../core/containers/withMatchParam';

export default compose(
  withMatchParam('token'),
  withState('error', 'setError', null),
  withStateHandlers(
    { newPassword: '', newPassword2: '' },
    {
      handleChange: () => (event, key) => ({ [key]: event.target.value }),
      handleSubmit: ({ newPassword }, { token, history, setError }) => () => {
        Accounts.resetPassword(token, newPassword, (err) => {
          if (err) {
            setError(err);
          } else {
            history.push('/');
          }
        });
        return {};
      },
    },
  ),
  lifecycle({
    componentDidMount() {
      return getUserByPasswordResetToken
        .run({ token: this.props.token })
        .then((user) => {
          if (!user) {
            throw new Error('No user found');
          }

          this.setState({ user });
        })
        .catch(this.props.setError);
    },
  }),
);
