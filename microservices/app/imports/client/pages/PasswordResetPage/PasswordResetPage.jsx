// @flow
import React from 'react';

import TextField from 'core/components/Material/TextField';
import Loading from 'core/components/Loading/Loading';
import Button from 'core/components/Button';
import T from 'core/components/Translation';
import { getUserDisplayName } from 'core/utils/userFunctions';
import PasswordResetPageContainer from './PasswordResetPageContainer';

export const PasswordResetPage = ({
  newPassword,
  newPassword2,
  handleChange,
  handleSubmit,
  user,
  error,
  submitting,
}) => {
  const isValid = !!newPassword && newPassword === newPassword2;

  if (error) {
    return (
      <h3 className="error" id="password-reset-page">
        {error.message}
      </h3>
    );
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

export default PasswordResetPageContainer(PasswordResetPage);
