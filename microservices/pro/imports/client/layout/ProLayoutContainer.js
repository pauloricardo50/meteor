import { useHistory } from 'react-router-dom';
import { withProps } from 'recompose';

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

export default withProps(() => {
  const history = useHistory();
  const redirect = getRedirect(history.location.pathname);
  return { redirect: !isLogin(history.location.pathname) && redirect };
});
