import './NewsletterSignup.scss';

import React, { useContext, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { RichText } from 'prismic-reactjs';

import Loading from 'core/components/Loading';
import TextInput from 'core/components/TextInput/TextInput';

import LanguageContext from '../../contexts/LanguageContext';
import { getLanguageData } from '../../utils/languages';
import meteorClient from '../../utils/meteorClient';
import Button from '../Button';
import RecentNewsletters from './RecentNewsletters';

const simulateSignup = () =>
  new Promise(resolve => {
    setTimeout(() => resolve({ status: 200 }), 1000);
  });

const SignupForm = ({
  loading,
  success,
  language,
  handleSubmit,
  setEmail,
  email,
}) => {
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
const ModalSignupForm = ({
  loading,
  success,
  language,
  handleSubmit,
  setEmail,
  email,
  openModal,
  setOpenModal,
}) => (
  <>
    <Button onClick={() => setOpenModal(true)} primary size="small">
      {getLanguageData(language).signupModal}
    </Button>
    <Dialog open={openModal} onBackdropClick={() => setOpenModal(false)}>
      <DialogTitle>
        {getLanguageData(language)['signupModal.title']}
      </DialogTitle>
      <form onSubmit={handleSubmit} className="signup-form modal">
        <DialogContent>
          {loading ? (
            <Loading small />
          ) : success ? (
            <div className="success-message">
              {getLanguageData(language).signupSuccessText}
            </div>
          ) : (
            <>
              <TextInput
                label="Email"
                className="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                }}
              />

              {success === false && (
                <div className="error-message">
                  {getLanguageData(language).signupErrorText}
                </div>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button outlined primary onClick={() => setOpenModal(false)}>
            {getLanguageData(language).close}
          </Button>
          {!success && (
            <Button primary raised className="button" type="submit">
              {getLanguageData(language).signupButtonText}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  </>
);

const NewsletterSignup = ({ primary, placement }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [openModal, setOpenModal] = useState(false);
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
        // setOpenModal(false);
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

  switch (placement) {
    case 'footer':
      return (
        <ModalSignupForm
          loading={loading}
          success={success}
          language={language}
          handleSubmit={handleSubmit}
          setEmail={setEmail}
          email={email}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      );
    // return (
    //   <div className="footer-newsletter">
    //     <p>
    //       <b>
    //         <u>Newsletter</u>
    //       </b>
    //     </p>
    //     <SignupForm />
    //   </div>
    // );

    case 'article':
      return (
        <section
          id={primary.section_id}
          className="newsletter-signup--article container"
        >
          <div className="newsletter-signup__content">
            {RichText.render(primary.section_heading)}

            {RichText.render(primary.content)}

            <SignupForm
              loading={loading}
              success={success}
              language={language}
              handleSubmit={handleSubmit}
              setEmail={setEmail}
              email={email}
            />
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
            {RichText.render(primary.section_heading)}

            {RichText.render(primary.content)}

            <SignupForm
              loading={loading}
              success={success}
              language={language}
              handleSubmit={handleSubmit}
              setEmail={setEmail}
              email={email}
            />
          </div>

          <RecentNewsletters />
        </section>
      );
  }
};

export default NewsletterSignup;
