import React, { useState, useContext } from 'react';
import { RichText } from 'prismic-reactjs';
import { useCookies } from 'react-cookie';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Button from '../Button';
import LanguageContext from '../../contexts/LanguageContext';
import useContentBlock from '../../hooks/useContentBlock';
import { getLanguageData } from '../../utils/languages.js';
import { linkResolver } from '../../utils/linkResolver';

const acceptCookie = 'epotek_acceptCookie';

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
    '& a': {
      color: theme.palette.primary.main,
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '16px',
      lineHeight: 1.44,
    },
  },
  action: {
    '& button + button': {
      marginLeft: '12px',
    },
  },
}));

const CookiesNotification = () => {
  const [language] = useContext(LanguageContext);
  const [cookies, setCookie] = useCookies(acceptCookie);
  const [visible, setVisible] = useState(true);

  const cookieNotification = useContentBlock({
    uid: 'cookies-notification',
    lang: language,
  });

  if (!cookieNotification) return null;

  const message = RichText.render(cookieNotification, linkResolver);

  const handleAccept = () => {
    setCookie(acceptCookie, true, {
      maxAge: '31536000', // one year
      domain: 'e-potek.ch',
    });

    setVisible(false);
  };

  const handleDecline = () => {
    setCookie(acceptCookie, false, {
      maxAge: '31536000', // one year
      domain: 'e-potek.ch',
    });

    setVisible(false);
  };

  return (
    <Snackbar
      open={!cookies[acceptCookie] && visible}
      classes={useSnackbarStyles()}
    >
      <SnackbarContent
        classes={useSnackbarContentStyles()}
        message={message}
        action={[
          <Button key="decline" contained onClick={() => handleDecline()}>
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
