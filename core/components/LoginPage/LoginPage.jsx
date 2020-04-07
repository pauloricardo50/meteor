import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { Redirect } from 'react-router-dom';

import { CurrentUserContext } from '../../containers/CurrentUserContext';
import PageHead from '../PageHead';
import LoginPageLeft from './LoginPageLeft';
import LoginPageRight from './LoginPageRight';

const LoginPage = ({ location: { search }, history: { push } }) => {
  const currentUser = useContext(CurrentUserContext);
  const { path } = queryString.parse(search);

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <section className="login-page animated fadeIn">
      <PageHead titleId="LoginPage" />
      <LoginPageLeft />
      <LoginPageRight path={path} push={push} />
    </section>
  );
};

LoginPage.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default LoginPage;
