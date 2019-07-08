// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/pro-light-svg-icons/faUserCircle';
import { Redirect } from 'react-router-dom';
import cx from 'classnames';

import TextField from '../Material/TextField';
import Loading from '../Loading/Loading';
import Button from '../Button';
import Checkbox from '../Checkbox';
import T from '../Translation';
import { getUserDisplayName } from '../../utils/userFunctions';
import PasswordResetPageContainer from './PasswordResetPageContainer';

export const PasswordResetPage = ({
  newPassword,
  newPassword2,
  hasReadConditions,
  handleChange,
  handleSubmit,
  user,
  error,
  submitting,
}) => {
  const isEnrollment = window.location && window.location.pathname.includes('enroll-account');
  const isValid = !!newPassword
    && newPassword === newPassword2
    && (!isEnrollment || hasReadConditions);

  if (error) {
    return <Redirect to="/login" />;
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
          onChange={e => handleChange(e.target.value, 'newPassword')}
          className="password-reset-page-input"
        />
        <TextField
          label={<T id="PasswordResetPage.confirmPassword" />}
          floatingLabelFixed
          type="password"
          value={newPassword2}
          onChange={e => handleChange(e.target.value, 'newPassword2')}
          className="password-reset-page-input"
        />

        {isEnrollment && (
          <Checkbox
            label={(
              <span className="disclaimer">
                <T
                  id="PasswordResetPage.disclaimer"
                  values={{
                    link: (
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`${Meteor.settings.public.subdomains.app}/files/Privacy Policy - e-Potek.pdf`}
                      >
                        <T id="PasswordResetPage.disclaimer.privacyPolicy" />
                      </a>
                    ),
                  }}
                />
              </span>
            )}
            value={hasReadConditions}
            onChange={(e, c) => handleChange(c, 'hasReadConditions')}
          />
        )}

        <div
          className={cx('password-reset-page-button', {
            enrollment: isEnrollment,
          })}
        >
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
