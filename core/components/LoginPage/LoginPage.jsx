import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { Redirect } from 'react-router-dom';

import PageHead from '../PageHead';
import LoginPageLeft from './LoginPageLeft';
import LoginPageRight from './LoginPageRight';
import { CurrentUserContext } from '../../containers/CurrentUserContext';

const LoginPage = ({ location: { search }, history: { push } }) => {
  const { path } = queryString.parse(search);
  const currentUser = useContext(CurrentUserContext);

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
