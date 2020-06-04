import React, { useContext, useState } from 'react';
import { RichText } from 'prismic-reactjs';
import TextInput from 'core/components/TextInput/TextInput';
import Button from '../Button';
import RecentNewsletters from './RecentNewsletters';
import LanguageContext from '../../contexts/LanguageContext';
import { getLanguageData } from '../../utils/languages';
import './NewsletterSignup.scss';

// TODO: replace with meteorClient call to subscribeToNewsletter
const simulateSignup = () => {
  return new Promise(resolve => {
    setTimeout(() => resolve({ status: 200 }), 1000);
  });
};

const NewsletterSignup = ({ primary, placement }) => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [language] = useContext(LanguageContext);

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await simulateSignup();
    if (result.status === 200) setSuccess(true);
  };

  const SignupForm = () => {
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
          className="email"
          value={email}
          onChange={e => setEmail(e.currentTarget.value)}
        />

        <Button primary raised className="button" type="submit">
          {getLanguageData(language).signupButtonText}
        </Button>
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
        <section id={primary.section_id} className="newsletter-signup--article">
          <div className="newsletter-signup__content">
            {RichText.render(primary.section_heading)}

            {RichText.render(primary.content)}

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
        <section id={primary.section_id} className="newsletter-signup">
          <div className="newsletter-signup__content">
            {RichText.render(primary.section_heading)}

            {RichText.render(primary.content)}

            <SignupForm />
          </div>

          <RecentNewsletters />
        </section>
      );
  }
};

export default NewsletterSignup;
