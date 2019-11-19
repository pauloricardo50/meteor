import { useContext } from 'react';
import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import getBaseRedirect, { isLogin } from 'core/utils/redirection';
import { withContactButtonProvider } from 'core/components/ContactButton/ContactButtonContext';
import { CurrentUserContext } from 'core/containers/CurrentUserContext';

const getRedirect = pathname => {
  const currentUser = useContext(CurrentUserContext);
  const baseRedirect = getBaseRedirect(currentUser, pathname);

  if (baseRedirect !== undefined) {
    return baseRedirect;
  }

  return false;
};

const withRedirect = withProps(({ history }) => {
  const redirect = getRedirect(history.location.pathname);
  return { redirect: !isLogin(history.location.pathname) && redirect };
});

export default compose(withRouter, withRedirect, withContactButtonProvider);
