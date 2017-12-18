import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import Button from 'core/components/Button';

import BetaAccess from './BetaAccess';
import { isDemo } from 'core/utils/browserFunctions';
import { T } from 'core/components/Translation';
import { generalContainer } from 'core/containers/Containers';

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
        href="http://eepurl.com/cI56Sn"
        primary
        label={<T id="PasswordPage.button" />}
        autoFocus
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
};

PasswordPage.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any),
};

PasswordPage.defaultProps = {
  currentUser: undefined,
};

export default generalContainer(PasswordPage);
