import { Meteor } from 'meteor/meteor';

import React, { useMemo } from 'react';
import { faUserCircle } from '@fortawesome/pro-light-svg-icons/faUserCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect } from 'react-router-dom';
import SimpleSchema from 'simpl-schema';

import AutoForm from '../AutoForm2/AutoForm';
import Loading from '../Loading/Loading';
import T from '../Translation';
import PasswordResetPageContainer from './PasswordResetPageContainer';

SimpleSchema.setDefaultMessages({
  messages: {
    fr: {
      passwordMismatch: 'Entrez 2 fois le même mot de passe',
      requiredPolicy: 'Vous devez accepter la politique de confidentialité',
    },
  },
});

export const passwordSchema = {
  newPassword: {
    type: String,
    min: 8,
    uniforms: { type: 'password', placeholder: null },
  },
  newPassword2: {
    type: String,
    min: 8,
    uniforms: { type: 'password', placeholder: null },
    custom() {
      if (this.value !== this.field('newPassword').value) {
        return 'passwordMismatch';
      }
    },
  },
};

const getSchema = ({
  isEnrollment,
  user: { firstName, lastName, phoneNumbers = [], email },
}) => {
  const omitFields = [
    firstName && 'firstName',
    lastName && 'lastName',
    phoneNumbers.length > 0 && 'phoneNumber',
  ].filter(x => x);
  const hasAdditionalInfo = omitFields.length < 3;

  return new SimpleSchema({
    // Add hidden username field make password managers work properly
    username: {
      type: String,
      optional: true,
      uniforms: {
        render: () => (
          <input
            type="text"
            id="username"
            name="username"
            value={email}
            style={{ display: 'none' }}
          />
        ),
      },
    },
    firstName: String,
    lastName: String,
    phoneNumber: { type: String, optional: true },
    divider: {
      optional: true,
      type: String,
      uniforms: {
        render: () => <hr style={{ width: 120, margin: '16px auto' }} />,
      },
      condition: () => hasAdditionalInfo,
    },
    ...passwordSchema,
    newsletterSignup: {
      type: Boolean,
      optional: true,
      uniforms: {
        checkboxes: true,
        label: (
          <span className="newsletter-signup">
            <T id="PasswordResetPage.newsletterSignup" />
          </span>
        ),
      },
    },
    hasReadPrivacyPolicy: {
      type: Boolean,
      optional: true,
      custom() {
        if (!this.value) {
          return 'requiredPolicy';
        }
      },
      uniforms: {
        checkboxes: true,
        label: (
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
        ),
      },
    },
  }).omit(
    ...omitFields,
    !isEnrollment && 'hasReadPrivacyPolicy',
    !isEnrollment && 'newsletterSignup',
  );
};

export const PasswordResetPage = ({
  user,
  error,
  handleSubmit,
  pathname = '',
  loading,
}) => {
  const isEnrollment = pathname.includes('enroll-account');

  if (error) {
    return <Redirect to="/login" />;
  }

  if (!user) {
    return <Loading />;
  }

  const schema = useMemo(() => getSchema({ isEnrollment, user }));

  return (
    <div
      id="password-reset-page"
      className="password-reset-page animated fadeInUp"
    >
      <div className="card1 card-top">
        <div className="top">
          <div className="text">
            <FontAwesomeIcon icon={faUserCircle} className="icon" />
            <h1>{user.name}</h1>
          </div>
          <h4 className="description secondary text-center mb-32">
            <T
              id={`PasswordResetPage.${
                isEnrollment ? 'enrollment' : 'description'
              }`}
            />
          </h4>
        </div>

        <AutoForm
          schema={schema}
          onSubmit={handleSubmit}
          model={{ username: user.email }}
          submitFieldProps={{
            label: isEnrollment ? (
              <T id="general.continue" />
            ) : (
              <T id="general.save" />
            ),
            secondary: true,
            primary: false,
            size: 'large',
            style: { margin: '0 auto', display: 'block' },
            // Let the form handle loading of the button, but override it
            // if the loading state is true
            loading: loading || undefined,
          }}
        />
      </div>
    </div>
  );
};

export default PasswordResetPageContainer(PasswordResetPage);
