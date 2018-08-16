// @flow
import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import { getUserByPasswordResetToken } from 'core/api';
import { withRouter } from 'react-router-dom';

import TextField from 'core/components/Material/TextField';
import Button from 'core/components/Button';

import T from 'core/components/Translation';
import { withStateHandlers, lifecycle, withState, withProps } from 'recompose';
import withMatchParam from '../../../core/containers/withMatchParam';
import { compose } from '../../../core/api/containerToolkit/index';
import Loading from '../../../core/components/Loading/Loading';
import { getUserDisplayName } from '../../../core/utils/userFunctions';

export const PasswordResetPage = ({
  newPassword,
  newPassword2,
  handleChange,
  handleSubmit,
  user,
  error,
  submitting,
}) => {
  const isValid = !!newPassword && newPassword === newPassword2 && !submitting;

  if (error) {
    return <h3 className="error">{error.message}</h3>;
  }

  if (!user) {
    return <Loading />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      id="password-reset-page"
      className="password-reset-page"
    >
      <h1>
        <T
          id="PasswordResetPage.title"
          values={{ name: getUserDisplayName(user) }}
        />
      </h1>
      <TextField
        label={<T id="PasswordResetPage.password" />}
        floatingLabelFixed
        type="password"
        value={newPassword}
        onChange={e => handleChange(e, 'newPassword')}
        className="password-reset-page-input"
      />
      <TextField
        label={<T id="PasswordResetPage.confirmPassword" />}
        floatingLabelFixed
        type="password"
        value={newPassword2}
        onChange={e => handleChange(e, 'newPassword2')}
        className="password-reset-page-input"
      />

      <div className="password-reset-page-button">
        <Button
          raised
          label={<T id="PasswordResetPage.CTA" />}
          disabled={!isValid}
          type="submit"
          primary
          loading={submitting}
        />
      </div>
    </form>
  );
};

export default compose(
  withMatchParam('token'),
  withState('error', 'setError', null),
  withRouter,
  withStateHandlers(
    {
      newPassword: '',
      newPassword2: '',
    },
    {
      handleChange: () => (event, key) => ({ [key]: event.target.value }),
    },
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
)(PasswordResetPage);
