import { withRouter } from 'react-router-dom';
import { compose, withProps } from 'recompose';

import { withContactButtonProvider } from 'core/components/ContactButton/ContactButtonContext';
import useCurrentUser from 'core/hooks/useCurrentUser';
import getBaseRedirect, { isLogin } from 'core/utils/redirection';

const getRedirect = pathname => {
  const currentUser = useCurrentUser();
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
