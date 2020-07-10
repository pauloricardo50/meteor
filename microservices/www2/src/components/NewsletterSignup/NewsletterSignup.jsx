import './NewsletterSignup.scss';

import React, { useContext, useState } from 'react';

import Loading from 'core/components/Loading';
import TextInput from 'core/components/TextInput/TextInput';

import LanguageContext from '../../contexts/LanguageContext';
import { getLanguageData } from '../../utils/languages';
import meteorClient from '../../utils/meteorClient';
import Button from '../Button';
import { RichText } from '../prismic';
import RecentNewsletters from './RecentNewsletters';

const simulateSignup = () =>
  new Promise(resolve => {
    setTimeout(() => resolve({ status: 200 }), 1000);
  });

const NewsletterSignup = ({ primary, placement }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [language] = useContext(LanguageContext);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      const result = await simulateSignup();
      // const result = await meteorClient.call('subscribeToNewsletter', {
      //   email,
      // });

      if (result.status === 200) {
        setLoading(false);
        setSuccess(true);
      } else {
        console.log({ result });
        setLoading(false);
        setSuccess(false);
      }
    } catch (error) {
      console.log({ error });
      setLoading(false);
      setSuccess(false);
    }
  };

  const SignupForm = () => {
    if (loading) return <Loading small />;

    if (success) {
      return (
        <div className="success-message">
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
        />

        <Button primary raised className="button" type="submit">
          {getLanguageData(language).signupButtonText}
        </Button>

        {success === false && (
          <div className="error-message">
            {getLanguageData(language).signupErrorText}
          </div>
        )}
      </form>
    );
  };

  switch (placement) {
    case 'footer':
      return (
        <>
          <p>Newsletter</p>
          <SignupForm />
        </>
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
