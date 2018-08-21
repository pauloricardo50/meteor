// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import T from '../Translation';

type LoginPageLeftProps = {};

const LoginPageLeft = (props: LoginPageLeftProps) => (
  <div className="left">
    <span className="content">
      <a href={`${Meteor.settings.public.subdomains.www}`} className="logo">
        <img src="/img/logo_square_white.svg" alt="e-Potek" />
      </a>
      <div className="text">
        <h1>
          <T id="LoginPage.title" />
        </h1>
        <div className="divider" />
        <p className="description">
          <T id="LoginPage.description" />
        </p>
      </div>
    </span>
  </div>
);

export default LoginPageLeft;
