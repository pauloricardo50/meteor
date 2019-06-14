import { Meteor } from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { Redirect } from 'react-router-dom';

import PageHead from '../PageHead';
import LoginPageLeft from './LoginPageLeft';
import LoginPageRight from './LoginPageRight';

const LoginPage = ({ location: { search }, history: { push } }) => {
  const { path } = queryString.parse(search);

  if (Meteor.userId()) {
    return <Redirect to="/" />;
  }

  return (
    <section className="login-page">
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
