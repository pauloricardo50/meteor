import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { Redirect } from 'react-router-dom';

import useCurrentUser from '../../hooks/useCurrentUser';
import PageHead from '../PageHead';
import LoginPageLeft from './LoginPageLeft';
import LoginPageRight from './LoginPageRight';

const LoginPage = ({
  location: { search },
  history: { push },
  onSignInSuccess,
}) => {
  const currentUser = useCurrentUser();
  const { path = '/' } = queryString.parse(search);

  if (currentUser) {
    return <Redirect to={path} />;
  }

  return (
    <section className="login-page animated fadeIn">
      <PageHead titleId="LoginPage" />
      <LoginPageLeft />
      <LoginPageRight
        path={path}
        push={push}
        onSignInSuccess={onSignInSuccess}
      />
    </section>
  );
};

LoginPage.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default LoginPage;
