import './NewsletterSignup.scss';

import React, { useContext, useState } from 'react';

import TextInput from 'core/components/TextInput/TextInput';

import LanguageContext from '../../contexts/LanguageContext';
import { getLanguageData } from '../../utils/languages';
import meteorClient from '../../utils/meteorClient';
import Button from '../Button';
import { RichText } from '../prismic';
import RecentNewsletters from './RecentNewsletters';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState();
  const [language] = useContext(LanguageContext);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email) return;

    try {
      setError(null);
      setLoading(true);
      await meteorClient.call('subscribeToNewsletter', {
        email,
      });
      setLoading(false);
      setSuccess(true);
    } catch (err) {
      if (err.error === 500) {
        setError(getLanguageData(language).signupErrorText);
      } else {
        setError(err.message);
      }
      setLoading(false);
      setSuccess(false);
    }
  };

  if (success) {
    return (
      <div className="success-message primary animated fadeIn">
        {getLanguageData(language).signupSuccessText}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <TextInput
        label="Email"
        className="email"
        value={email}
        onChange={e => {
          setEmail(e.target.value);
        }}
        error={!!error}
        helperText={error}
      />

      <Button primary raised className="button" type="submit" loading={loading}>
        {getLanguageData(language).signupButtonText}
      </Button>
    </form>
  );
};

const NewsletterSignup = ({ primary, placement }) => {
  switch (placement) {
    case 'footer':
      // return (
      //   <ModalSignupForm
      //     loading={loading}
      //     success={success}
      //     language={language}
      //     handleSubmit={handleSubmit}
      //     setEmail={setEmail}
      //     email={email}
      //     openModal={openModal}
      //     setOpenModal={setOpenModal}
      //   />
      // );
      return (
        <div className="footer-newsletter">
          <p>
            <b>
              <u>Newsletter</u>
            </b>
          </p>
          <SignupForm />
        </div>
      );

    case 'article':
      return (
        <section
          id={primary.section_id}
          className="newsletter-signup--article container"
        >
          <div className="newsletter-signup__content">
            <RichText render={primary.section_heading} />

            <RichText render={primary.content} />

            <SignupForm />
          </div>

          {primary.illustration && (
            <div className="newsletter-signup__image">
              <img src={primary.illustration.url} alt="" />
            </div>
          )}
        </section>
      );

    default:
      return (
        <section
          id={primary.section_id}
          className="newsletter-signup container"
        >
          <div className="newsletter-signup__content">
            <RichText render={primary.section_heading} />

            <RichText render={primary.content} />

            <SignupForm />
          </div>

          <RecentNewsletters />
        </section>
      );
  }
};

export default NewsletterSignup;
