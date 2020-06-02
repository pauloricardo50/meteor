import React, { useState, useContext } from 'react';
import { RichText } from 'prismic-reactjs';
import { useCookies } from 'react-cookie';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Button from '../Button';
import LanguageContext from '../../contexts/LanguageContext';
import useAllCookiesNotifications from '../../hooks/useAllCookiesNotifications';
import { getLanguageData } from '../../utils/languages.js';
import { linkResolver } from '../../utils/linkResolver';
// import './CookiesPrompt.scss';

const useSnackbarStyles = makeStyles({
  root: {
    transform: 'unset',
    bottom: 0,
    right: 0,
    left: 0,
  },
});

const useSnackbarContentStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '120px',
    backgroundColor: 'white',
  },
  message: {
    fontSize: '12px',
    fontWeight: 300,
    fontStyle: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: 'black',
    [theme.breakpoints.up('md')]: {
      fontSize: '16px',
      lineHeight: 1.44,
    },
  },
}));

const CookiesNotification = () => {
  const [language] = useContext(LanguageContext);
  const [cookies, setCookie] = useCookies(['epAccept']);
  const [visible, setVisible] = useState(true);
  const allCookiesNotifications = useAllCookiesNotifications();

  const cookieNotification = allCookiesNotifications.find(({ node }) =>
    node._meta.lang.includes(language),
  );

  if (!cookieNotification) return null;

  const handleAccept = () => {
    setCookie('epAccept', true, {
      maxAge: '31536000', // one year
      domain: 'e-potek.ch',
    });

    setVisible(false);
  };

  return (
    <Snackbar open={!cookies.epAccept && visible} classes={useSnackbarStyles()}>
      <SnackbarContent
        classes={useSnackbarContentStyles()}
        message={RichText.render(cookieNotification.node.content, linkResolver)}
        action={[
          <Button key="decline" raised onClick={() => setVisible(false)}>
            {getLanguageData(language).cookieDecline}
          </Button>,
          <Button key="accept" raised primary onClick={() => handleAccept()}>
            {getLanguageData(language).cookieAccept}
          </Button>,
        ]}
      />
    </Snackbar>
  );
};

export default CookiesNotification;
