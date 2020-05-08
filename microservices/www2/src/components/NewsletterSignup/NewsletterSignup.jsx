import React, { useState } from 'react';
import { RichText } from 'prismic-reactjs';
import TextInput from 'core/components/TextInput/TextInput';
import Button from '../Button';
import './NewsletterSignup.scss';

const NewsletterSignup = ({ primary, placement }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: get simpleDDP function to post data
    setEmail('');
  };

  const SignupForm = () => (
    <form onSubmit={handleSubmit} className="signup-form">
      <TextInput
        className="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button primary raised className="button" type="submit">
        {/* TODO: hardcode for now, translation will be added later */}
        S&apos;inscrire
      </Button>
    </form>
  );

  if (placement === 'footer') {
    return (
      <>
        <p>Newsletter</p>
        <SignupForm />;
      </>
    );
  }

  return (
    <section id={primary.section_id} className="newsletter-signup">
      {RichText.render(primary.section_heading)}

      {RichText.render(primary.content)}

      <SignupForm />
    </section>
  );
};

export default NewsletterSignup;
