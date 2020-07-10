import './NewsletterSignup.scss';

import React, { useContext, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import TextInput from 'core/components/TextInput/TextInput';

import LanguageContext from '../../contexts/LanguageContext';
import { getLanguageData } from '../../utils/languages';
import meteorClient from '../../utils/meteorClient';
import Button from '../Button';
import { RichText } from '../prismic';
import RecentNewsletters from './RecentNewsletters';

const SignupSuccessMessage = ({ language }) => (
  <div className="success-message primary animated fadeIn">
    {getLanguageData(language).signupSuccessText}
  </div>
);

const SignupForm = ({ modal = false }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [openModal, setOpenModal] = useState(false);
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

  if (modal) {
    return (
      <div>
        <a
          onClick={() => setOpenModal(true)}
          className="signup-form-modal-button"
        >
          <b>{getLanguageData(language).signupModal}</b>
        </a>
        <Dialog open={openModal} onBackdropClick={() => setOpenModal(false)}>
          <DialogTitle>
            {getLanguageData(language)['signupModal.title']}
          </DialogTitle>
          <form onSubmit={handleSubmit} className="signup-form modal">
            <DialogContent>
              {success ? (
                <SignupSuccessMessage language={language} />
              ) : (
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
              )}
            </DialogContent>
            <DialogActions>
              <Button outlined primary onClick={() => setOpenModal(false)}>
                {getLanguageData(language).close}
              </Button>
              {!success && (
                <Button
                  primary
                  raised
                  className="button"
                  type="submit"
                  loading={loading}
                >
                  {getLanguageData(language).signupButtonText}
                </Button>
              )}
            </DialogActions>
          </form>
        </Dialog>
      </div>
    );
  }

  if (success) {
    return <SignupSuccessMessage language={language} />;
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
      return <SignupForm modal />;

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
