// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/pro-light-svg-icons/faUserCircle';

import TextField from '../Material/TextField';
import Loading from '../Loading/Loading';
import Button from '../Button';
import T from '../Translation';
import { getUserDisplayName } from '../../utils/userFunctions';
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
      <div className="card1 card-top">
        <div className="top">
          <div className="text">
            <FontAwesomeIcon icon={faUserCircle} className="icon" />
            <h1>{getUserDisplayName(user)}</h1>
          </div>
          <h3 className="secondary">
            <T id="PasswordResetPage.description" />
          </h3>
        </div>
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
      </div>
    </form>
  );
};

export default PasswordResetPageContainer(PasswordResetPage);
