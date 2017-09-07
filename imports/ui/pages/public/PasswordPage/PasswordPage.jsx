import React from 'react';

import Button from '/imports/ui/components/general/Button';

import BetaAccess from './BetaAccess';
import { isDemo } from '/imports/js/helpers/browserFunctions';
import { T } from '/imports/ui/components/general/Translation';

const PasswordPage = props => (
  <main className="password-page animated fadeIn">
    <img src="/img/logo_black.svg" alt="e-Potek" />

    <Button
      raised
      className="subscribe"
      href="http://eepurl.com/cI56Sn"
      primary
      label={<T id="PasswordPage.button" />}
      keyboardFocused
    />
    <BetaAccess {...props} />
    {!isDemo() && (
      <Button
        raised
        label="Demo"
        href="https://demo.e-potek.ch"
        style={{ marginTop: 16 }}
      />
    )}
  </main>
);

PasswordPage.propTypes = {};

export default PasswordPage;
