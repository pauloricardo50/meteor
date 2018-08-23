import PropTypes from 'prop-types';
import React from 'react';
import queryString from 'query-string';

import LoginPageLeft from './LoginPageLeft';
import LoginPageRight from './LoginPageRight';

const LoginPage = ({ location: { search }, history: { push } }) => {
  const { path } = queryString.parse(search);

  return (
    <section className="login-page">
      <LoginPageLeft />
      <LoginPageRight path={path} push={push} />
    </section>
  );
};

LoginPage.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default LoginPage;
