import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import BetaAccess from './passwordPage/BetaAccess.jsx';

const PasswordPage = props => (
  <main className="password-page animated fadeIn">
    <img src="/img/logo_black.svg" alt="e-Potek" />

    <h3>En Développement</h3>

    <RaisedButton
      className="subscribe"
      href="http://eepurl.com/cI56Sn"
      primary
      label="M'avertir du lancement"
      keyboardFocused
    />
    <BetaAccess {...props} />
    <RaisedButton label="Demo" href="https://demo.e-potek.ch" style={{ marginTop: 16 }} />
  </main>
);

PasswordPage.propTypes = {};

export default PasswordPage;
