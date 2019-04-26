// @flow
import { Meteor } from 'meteor/meteor';

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
      <div className="password-reset-page" id="password-reset-page">
        <div className="card1 card-top">
          <h3 className="error">
            <T id="PasswordResetPage.errorTitle" />
          </h3>

          <p className="description">
            <T id="PasswordResetPage.errorDescription" />
          </p>

          <Button raised primary link to="/login">
            <T id="PasswordResetPage.errorButton" />
          </Button>
        </div>
      </div>
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
          <h4 className="secondary">
            <T id="PasswordResetPage.description" />
          </h4>
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

        <div className="secondary disclaimer">
          <small>
            <T
              id="PasswordResetPage.disclaimer"
              values={{
                link: (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${
                      Meteor.settings.public.subdomains.app
                    }/files/Privacy Policy - e-Potek.pdf`}
                  >
                    <T id="PasswordResetPage.disclaimer.privacyPolicy" />
                  </a>
                ),
              }}
            />
          </small>
        </div>
      </div>
    </form>
  );
};

export default PasswordResetPageContainer(PasswordResetPage);
