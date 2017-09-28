import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import Button from '/imports/ui/components/general/Button';

import BetaAccess from './BetaAccess';
import { isDemo } from '/imports/js/helpers/browserFunctions';
import { T } from '/imports/ui/components/general/Translation';

const PasswordPage = (props) => {
  if (props.currentUser) {
    return <Redirect to="/home" />;
  }

  return (
    <main className="password-page animated fadeIn">
      <img src="/img/logo_black.svg" alt="e-Potek" />

      <Button
        raised
        className="subscribe"
        link
        to="http://eepurl.com/cI56Sn"
        primary
        label={<T id="PasswordPage.button" />}
      />
      <BetaAccess {...props} />
      {!isDemo() && (
        <Button
          raised
          label="Demo"
          // link
          // to="https://demo.e-potek.ch"
          style={{ marginTop: 16 }}
          focusRipple
          autoFocus
        />
      )}
    </main>
  );
};

PasswordPage.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any),
};

PasswordPage.defaultProps = {
  currentUser: undefined,
};

export default PasswordPage;
