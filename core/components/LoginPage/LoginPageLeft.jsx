import { Meteor } from 'meteor/meteor';

import React from 'react';

import T from '../Translation';

const LoginPageLeft = props => (
  <div className="left">
    <span className="content">
      <a href={`${Meteor.settings.public.subdomains.www}`} className="logo">
        <img src="/img/logo_square_white.svg" alt="e-Potek" />
      </a>
      <div className="text">
        <h1>
          <T defaultMessage="Accédez à votre compte e-Potek" />
        </h1>
        <div className="divider" />
        <p className="description">
          <T defaultMessage="Gérez votre demande de prêt hypothécaire, accompagné(e) par nos conseillers." />
        </p>
      </div>
    </span>
  </div>
);

export default LoginPageLeft;
