import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { proUser } from 'core/api/users/queries';
import getBaseRedirect, { isLogin } from 'core/utils/redirection';
import { withContactButtonProvider } from 'core/components/ContactButton/ContactButtonContext';
import { injectCurrentUser } from 'core/containers/CurrentUserContext';

const getRedirect = (currentUser, pathname) => {
  const baseRedirect = getBaseRedirect(currentUser, pathname);
  if (baseRedirect !== undefined) {
    return baseRedirect;
  }

  return false;
};

const withProUser = withSmartQuery({
  query: proUser,
  queryOptions: { reactive: true, single: true },
  dataName: 'currentUser',
  renderMissingDoc: false,
});

const withRedirect = withProps(({ currentUser, history }) => {
  const redirect = getRedirect(currentUser, history.location.pathname);
  return { redirect: !isLogin(history.location.pathname) && redirect };
});

export default compose(
  withProUser,
  injectCurrentUser,
  withRouter,
  withRedirect,
  withContactButtonProvider,
);
