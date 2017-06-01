import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import BetaAccess from './passwordPage/BetaAccess.jsx';
import { isDemo } from '/imports/js/helpers/browserFunctions';
import { T } from '/imports/ui/components/general/Translation.jsx';

const PasswordPage = props => (
  <main className="password-page animated fadeIn">
    <img src="/img/logo_black.svg" alt="e-Potek" />

    <RaisedButton
      className="subscribe"
      href="http://eepurl.com/cI56Sn"
      primary
      label={<T id="PasswordPage.button" />}
      keyboardFocused
    />
    <BetaAccess {...props} />
    {!isDemo() &&
      <RaisedButton label="Demo" href="https://demo.e-potek.ch" style={{ marginTop: 16 }} />}
  </main>
);

PasswordPage.propTypes = {};

export default PasswordPage;
