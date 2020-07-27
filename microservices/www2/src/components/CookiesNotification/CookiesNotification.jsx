import React, { useContext, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles } from '@material-ui/core/styles';
import { useCookies } from 'react-cookie';

import LanguageContext from '../../contexts/LanguageContext';
import useContentBlock from '../../hooks/useContentBlock';
import { getLanguageData } from '../../utils/languages.js';
import Button from '../Button';
import { RichText } from '../prismic';

const acceptCookie = 'epotek_acceptCookie';

const useSnackbarStyles = makeStyles(() => ({
  root: {
    zIndex: 2147483004,
  },
}));

const useSnackbarContentStyles = makeStyles(theme => ({
  root: {
    backgroundColor: 'white',
    padding: 8,
    zIndex: 2147483004, // Be above intercom
  },
  message: {
    fontSize: 12,
    fontWeight: 300,
    color: 'black',
    '& a': {
      color: theme.palette.primary.main,
    },
    '& p': {
      margin: 0,
    },
  },
  action: {
    marginRight: 0,
  },
}));

const cookieOptions = {
  maxAge: '31536000', // one year
  domain: '.e-potek.ch',
};

const CookiesNotification = () => {
  const [language] = useContext(LanguageContext);
  const [cookies, setCookie] = useCookies(acceptCookie);
  const hasSetCookie = !!cookies[acceptCookie];
  const [visible, setVisible] = useState(
    process.env.NODE_ENV === 'production' && !hasSetCookie,
  );
  const contentClasses = useSnackbarContentStyles();
  const snackbarClasses = useSnackbarStyles();

  const cookieNotification = useContentBlock({
    uid: 'cookies-notification',
    lang: language,
  });

  if (!cookieNotification) return null;

  const handleAccept = () => {
    setCookie(acceptCookie, 'all', cookieOptions);
    setVisible(false);
  };

  const handleDecline = () => {
    setCookie(acceptCookie, 'limited', cookieOptions);
    setVisible(false);
  };

  return (
    <Snackbar open={visible} classes={snackbarClasses}>
      <SnackbarContent
        classes={contentClasses}
        message={<RichText render={cookieNotification} />}
        elevation={1}
        action={[
          <Button
            key="decline"
            contained
            onClick={handleDecline}
            className="mr-8"
            size="small"
          >
            {getLanguageData(language).cookieDecline}
          </Button>,
          <Button
            key="accept"
            raised
            primary
            onClick={handleAccept}
            size="small"
          >
            {getLanguageData(language).cookieAccept}
          </Button>,
        ]}
      />
    </Snackbar>
  );
};

export default CookiesNotification;
